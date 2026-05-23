type Listener = (active: boolean) => void;

const listeners = new Set<Listener>();
let activeRecorders = 0;

function emit() {
  const active = activeRecorders > 0;
  listeners.forEach((listener) => listener(active));
}

export function beginHotkeyRecording() {
  activeRecorders += 1;
  emit();

  let ended = false;
  return () => {
    if (ended) return;
    ended = true;
    activeRecorders = Math.max(0, activeRecorders - 1);
    emit();
  };
}

export function subscribeHotkeyRecording(listener: Listener) {
  listeners.add(listener);
  listener(activeRecorders > 0);

  return () => {
    listeners.delete(listener);
  };
}
