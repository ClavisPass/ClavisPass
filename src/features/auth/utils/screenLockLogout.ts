import ScreenLockLogoutController from "../model/ScreenLockLogoutController";

export type ScreenLockPayload = { locked: boolean };

type ListenFn = <T>(
  event: string,
  handler: (event: { payload: T }) => void
) => Promise<() => void>;

export async function initScreenLockLogout(opts: {
  onLock: () => void;
  oncePerLockCycle?: boolean;
}): Promise<ScreenLockLogoutController> {
  const oncePerLockCycle = opts.oncePerLockCycle ?? true;

  let disposed = false;
  let unlisten: null | (() => void) = null;
  let alreadyFiredForThisLock = false;

  let listen: ListenFn | null = null;
  try {
    const mod = await import("@tauri-apps/api/event");
    listen = mod.listen as unknown as ListenFn;
  } catch {
    return {
      dispose: () => {
        disposed = true;
      },
    };
  }

  if (disposed || !listen) {
    return { dispose: () => {} };
  }

  unlisten = await listen<ScreenLockPayload>("screen-lock://changed", (event) => {
    if (disposed) return;

    const locked = !!event.payload?.locked;

    if (locked) {
      if (oncePerLockCycle) {
        if (alreadyFiredForThisLock) return;
        alreadyFiredForThisLock = true;
      }
      opts.onLock();
    } else {
      alreadyFiredForThisLock = false;
    }
  });

  return {
    dispose: () => {
      disposed = true;
      if (unlisten) unlisten();
      unlisten = null;
    },
  };
}
