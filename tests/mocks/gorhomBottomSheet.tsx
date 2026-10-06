import React from "react";

function host(name: string) {
  return React.forwardRef<any, any>(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children),
  );
}

export const BottomSheetModalProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => <>{children}</>;

export const BottomSheetBackdrop = host("BottomSheetBackdrop");
export const BottomSheetModal = host("BottomSheetModal");
export const BottomSheetView = host("BottomSheetView");

