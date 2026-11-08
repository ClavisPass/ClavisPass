type Bounds = { top: number; bottom: number };

/** Scroll only enough to reveal the input and, when they fit together, its suggestion. */
export function moduleScrollOffset({
  viewport,
  input,
  trailingBottom,
  offset,
  maxOffset,
}: {
  viewport: Bounds;
  input: Bounds;
  trailingBottom?: number;
  offset: number;
  maxOffset: number;
}) {
  const available = viewport.bottom - viewport.top;
  if (available <= 0) return offset;
  const groupBottom = Math.max(input.bottom, trailingBottom ?? input.bottom);
  if (input.bottom - input.top > available) {
    return Math.max(
      0,
      Math.min(Math.max(0, maxOffset), offset + input.bottom - viewport.bottom),
    );
  }
  const bottom =
    groupBottom - input.top <= available ? groupBottom : input.bottom;
  const delta =
    bottom > viewport.bottom
      ? bottom - viewport.bottom
      : input.top < viewport.top
        ? input.top - viewport.top
        : 0;
  return Math.max(0, Math.min(Math.max(0, maxOffset), offset + delta));
}
