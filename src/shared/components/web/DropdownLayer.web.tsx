import React, { useEffect } from "react";

type Props = {
  id?: string;
};

/**
 * Creates a fixed DOM node for portals/popovers that should not be clipped
 * by scroll containers / overflow hidden.
 */
export default function DropdownLayer({ id = "dropdown-layer" }: Props) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) return;

    const el = document.createElement("div");
    el.id = id;

    // keep it "neutral": no backdrop, no pointer swallowing, just a layer
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.zIndex = "10000";
    el.style.pointerEvents = "none";

    document.body.appendChild(el);

    return () => {
      // remove only if we created it
      const node = document.getElementById(id);
      if (node === el) node.remove();
    };
  }, [id]);

  return null;
}
