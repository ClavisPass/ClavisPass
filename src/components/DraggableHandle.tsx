import React, { useEffect, useRef } from "react";
import { Platform, View, ViewStyle } from "react-native";

type HandleProps = {
  onDeltaX: (dx: number) => void;
  style?: ViewStyle | ViewStyle[];
};

export const DraggableHandle: React.FC<HandleProps> = ({ onDeltaX, style }) => {
  const startXRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || startXRef.current == null) return;
      const dx = e.clientX - startXRef.current;
      if (dx) onDeltaX(dx);
      startXRef.current = e.clientX;
    };
    const onUp = () => {
      draggingRef.current = false;
      startXRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onDeltaX]);

  const onPointerDown = (e: any) => {
    draggingRef.current = true;
    startXRef.current = e?.nativeEvent?.clientX ?? e?.clientX ?? null;
  };
  const baseStyle: ViewStyle = {
    width: 8,
    height: "100%" as any,
    justifyContent: "center",
    alignItems: "center",
  };

  const webOnly: any = Platform.select({
    web: {
      cursor: "col-resize",
      touchAction: "none",
      userSelect: "none",
    },
    default: {},
  });

  return (
    <View
      style={[baseStyle, webOnly, style as any]}
      onPointerDown={onPointerDown}
      onPointerCancel={() => {
        draggingRef.current = false;
        startXRef.current = null;
      }}
    />
  );
};
