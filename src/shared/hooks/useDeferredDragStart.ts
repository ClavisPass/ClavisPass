import { useCallback, useRef } from "react";
import type { GestureResponderEvent } from "react-native";

const DEFAULT_DRAG_START_DISTANCE = 4;

export function useDeferredDragStart(
  onDragStart?: () => void,
  distance = DEFAULT_DRAG_START_DISTANCE,
  options?: {
    onPendingStart?: () => void;
    onPendingEnd?: () => void;
    startImmediately?: boolean;
  },
) {
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartedRef = useRef(false);

  const resetDragStart = useCallback(() => {
    startPointRef.current = null;
    dragStartedRef.current = false;
    options?.onPendingEnd?.();
  }, [options]);

  const handleTouchStart = useCallback((event: GestureResponderEvent) => {
    const touch = event.nativeEvent;
    startPointRef.current = { x: touch.pageX, y: touch.pageY };
    dragStartedRef.current = Boolean(options?.startImmediately);
    options?.onPendingStart?.();
    if (options?.startImmediately) {
      onDragStart?.();
    }
  }, [onDragStart, options]);

  const handleTouchMove = useCallback(
    (event: GestureResponderEvent) => {
      if (!startPointRef.current) {
        return;
      }

      const touch = event.nativeEvent;
      const deltaX = touch.pageX - startPointRef.current.x;
      const deltaY = touch.pageY - startPointRef.current.y;

      if (Math.hypot(deltaX, deltaY) < distance) return;

      options?.onPendingEnd?.();
      if (dragStartedRef.current) return;

      if (!onDragStart) return;
      dragStartedRef.current = true;
      onDragStart();
    },
    [distance, onDragStart, options],
  );

  return {
    onTouchCancel: resetDragStart,
    onTouchEnd: resetDragStart,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
  };
}
