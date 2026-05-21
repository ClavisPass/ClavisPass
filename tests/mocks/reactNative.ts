import React from "react";

function createHostComponent(name: string) {
  return React.forwardRef<any, any>(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children),
  );
}

export const View = createHostComponent("View");
export const Text = createHostComponent("Text");
export const Pressable = createHostComponent("Pressable");
export const ScrollView = createHostComponent("ScrollView");
export const TouchableOpacity = createHostComponent("TouchableOpacity");
export const TextInput = createHostComponent("TextInput");

export const Platform = {
  OS: "web",
  select<T>(values: Partial<Record<string, T>> & { default?: T }) {
    return values[Platform.OS] ?? values.default;
  },
};

export function setPlatform(os: string) {
  Platform.OS = os;
}

export const StyleSheet = {
  hairlineWidth: 1,
  create<T extends Record<string, any>>(styles: T): T {
    return styles;
  },
  flatten(style: any) {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style ?? {};
  },
};

export function useWindowDimensions() {
  return { width: 1024, height: 768, scale: 1, fontScale: 1 };
}

export const Dimensions = {
  get() {
    return { width: 1024, height: 768, scale: 1, fontScale: 1 };
  },
};

export const InteractionManager = {
  runAfterInteractions(callback: () => void) {
    callback();
    return { cancel() {} };
  },
};

class AnimatedValue {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  setValue(value: number) {
    this.value = value;
  }
}

export const Animated = {
  Value: AnimatedValue,
  View,
  timing: () => ({ start: (callback?: () => void) => callback?.() }),
  parallel: () => ({ start: (callback?: () => void) => callback?.() }),
};
