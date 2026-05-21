import React from "react";

function host(name: string) {
  return React.forwardRef<any, any>(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children),
  );
}

export const Text = host("PaperText");
export const Button = host("PaperButton");
export const Chip = host("PaperChip");
export const Icon = host("PaperIcon");
export const IconButton = host("PaperIconButton");
export const Divider = host("PaperDivider");
export const Searchbar = host("PaperSearchbar");
export const TextInput = host("PaperTextInput");
export const ActivityIndicator = host("PaperActivityIndicator");
export const TouchableRipple = host("PaperTouchableRipple");
export const Surface = host("PaperSurface");

export const Portal = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
);

export const Modal = ({
  children,
  visible,
}: {
  children?: React.ReactNode;
  visible?: boolean;
}) => (visible === false ? null : <>{children}</>);

export const PaperProvider = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
);

const baseColors = {
  primary: "#787FF6",
  background: "#fff",
  surface: "#fff",
  surfaceVariant: "#f5f5f5",
  surfaceDisabled: "#ddd",
  onSurface: "#111",
  onSurfaceVariant: "#555",
  onSurfaceDisabled: "#999",
  onPrimary: "#fff",
  outline: "#ccc",
  outlineVariant: "#ddd",
  error: "#d00",
  elevation: {
    level0: "transparent",
    level1: "#fafafa",
    level2: "#f5f5f5",
    level3: "#fff",
    level4: "#eee",
    level5: "#ddd",
  },
  shadow: "none",
};

export const MD3LightTheme = {
  dark: false,
  colors: baseColors,
};

export const MD3DarkTheme = {
  dark: true,
  colors: {
    ...baseColors,
    background: "#111",
    surface: "#111",
    onSurface: "#fff",
  },
};
