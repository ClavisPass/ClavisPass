import React from "react";

function createIcon(name: string) {
  return React.forwardRef<any, any>((props, ref) =>
    React.createElement(name, { ...props, ref }),
  );
}

export const Feather = createIcon("FeatherIcon");

export default {
  Feather,
};
