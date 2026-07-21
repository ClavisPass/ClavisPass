import React, { Profiler, useCallback } from "react";
import type { ProfilerOnRenderCallback, ReactNode } from "react";

import { logger } from "../../infrastructure/logging/logger";

type Props = {
  children: ReactNode;
  id: string;
  logMount?: boolean;
  minDurationMs?: number;
};

const isDev =
  typeof __DEV__ !== "undefined"
    ? __DEV__
    : process.env.NODE_ENV === "development";

declare global {
  // Set this to true in the dev console to enable profiler output.
  // eslint-disable-next-line no-var
  var __CLAVISPASS_PERF_LOGS__: boolean | undefined;
}

const arePerfLogsEnabled = () => {
  if (!isDev) return false;
  if (globalThis.__CLAVISPASS_PERF_LOGS__ === true) return true;

  try {
    return (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("__CLAVISPASS_PERF_LOGS__") === "true"
    );
  } catch {
    return false;
  }
};

export default function PerfProfiler({
  children,
  id,
  logMount = true,
  minDurationMs = 12,
}: Props) {
  const enabled = arePerfLogsEnabled();

  const onRender = useCallback<ProfilerOnRenderCallback>(
    (profilerId, phase, actualDuration, baseDuration, startTime, commitTime) => {
      if (!enabled) return;
      if (phase === "mount" && !logMount && actualDuration < minDurationMs) {
        return;
      }
      if (phase !== "mount" && actualDuration < minDurationMs) return;

      logger.info(`[Perf] ${profilerId}`, {
        phase,
        actualDuration: Number(actualDuration.toFixed(1)),
        baseDuration: Number(baseDuration.toFixed(1)),
        renderToCommitMs: Number((commitTime - startTime).toFixed(1)),
      });
    },
    [enabled, logMount, minDurationMs],
  );

  if (!enabled) return <>{children}</>;

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
