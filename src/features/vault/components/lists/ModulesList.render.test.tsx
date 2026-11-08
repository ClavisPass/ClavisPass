import React, { useState } from "react";
import { act } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderBare } from "../../../../../tests/render/render";
import ModulesList from "./ModulesList";
import ModulesEnum from "../../model/ModulesEnum";
import getTemplate from "../../utils/getTemplate";
import TemplateEnum from "../../model/TemplateEnum";
import getModuleData from "../../utils/getModuleData";
import { setPlatform } from "../../../../../tests/mocks/reactNative";

const native = vi.hoisted(() => ({
  scrollTo: vi.fn(),
  scrollToEnd: vi.fn(),
  listeners: new Map<string, (event: any) => void>(),
  height: 400,
  inputTop: 450,
  focused: false,
}));

vi.mock("react-native", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    KeyboardAvoidingView: actual.View,
    TextInput: Object.assign(actual.TextInput as object, {
      State: {
        currentlyFocusedInput: () =>
          native.focused
            ? {
                measureInWindow: (callback: (...args: number[]) => void) =>
                  callback(0, native.inputTop, 200, 44),
              }
            : null,
      },
    }),
    View: React.forwardRef((props: any, ref) => {
      React.useImperativeHandle(ref, () => ({
        measureInWindow: (callback: (...args: number[]) => void) => {
          const isModule = Boolean(props.children?.props?.id);
          callback(
            0,
            native.inputTop + (isModule ? -8 : 52),
            350,
            isModule ? 60 : 30,
          );
        },
      }));
      return React.createElement("View", props, props.children);
    }),
    Keyboard: {
      addListener: (name: string, listener: (event: any) => void) => {
        native.listeners.set(name, listener);
        return { remove: () => native.listeners.delete(name) };
      },
    },
    ScrollView: React.forwardRef((props: any, ref) => {
      React.useImperativeHandle(ref, () => ({
        scrollTo: native.scrollTo,
        scrollToEnd: native.scrollToEnd,
        measureInWindow: (callback: (...args: number[]) => void) =>
          callback(0, 100, 350, native.height),
      }));
      return React.createElement("ScrollView", props, props.children);
    }),
  };
});
vi.mock("../../utils/getModule", () => ({
  default: (...args: any[]) =>
    React.createElement("ModuleField", {
      id: args[0].id,
      autoFocus: args[7],
    }),
}));
vi.mock("./DraggableModulesList.shared", () => ({
  DraggableModulesFooter: (props: any) =>
    React.createElement("PredictionButton", {
      onPress: props.onAddPredictedModule,
    }),
}));

describe("predicted module focus", () => {
  beforeEach(() => {
    setPlatform("web");
    native.listeners.clear();
    native.height = 400;
    native.inputTop = 450;
    native.focused = false;
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: (time: number) => void) => {
        callback(0);
        return 0;
      },
    );
  });

  it("reveals the last task and prediction together without scrolling to the list end", async () => {
    setPlatform("android");
    const renderer = await renderBare(
      <ModulesList
        value={getTemplate(TemplateEnum.TASKLIST)}
        moduleAutoFocus={false}
        addModule={vi.fn()}
        deleteModule={vi.fn()}
        changeModule={vi.fn()}
        fastAccess={null}
        navigation={{} as any}
      />,
    );
    const scroll = () => renderer.root.findByType("ScrollView" as any);
    await act(async () => {
      scroll().props.onLayout({ nativeEvent: { layout: { height: 400 } } });
      scroll().props.onContentSizeChange(350, 1200);
    });
    native.focused = true;
    await act(async () =>
      native.listeners.get("keyboardDidShow")?.({
        endCoordinates: { screenY: 500, height: 300 },
      }),
    );
    // The suggestion ends at 532; the usable viewport ends at 492 (8px spacing).
    expect(native.scrollTo).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    expect(native.scrollTo).toHaveBeenLastCalledWith({ y: 40, animated: true });
    expect(native.scrollToEnd).not.toHaveBeenCalled();
    native.inputTop -= 40;
    await act(async () =>
      scroll().props.onScroll({ nativeEvent: { contentOffset: { y: 40 } } }),
    );
    native.scrollTo.mockClear();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });
    expect(native.scrollTo).not.toHaveBeenCalled();
    await act(async () => renderer.unmount());
  });

  it("coalesces layout bursts and does not restart an animation toward the same target", async () => {
    setPlatform("android");
    const renderer = await renderBare(
      <ModulesList
        value={getTemplate(TemplateEnum.TASKLIST)}
        moduleAutoFocus={false}
        addModule={vi.fn()}
        deleteModule={vi.fn()}
        changeModule={vi.fn()}
        fastAccess={null}
        navigation={{} as any}
      />,
    );
    const scroll = () => renderer.root.findByType("ScrollView" as any);
    await act(async () => {
      scroll().props.onLayout({ nativeEvent: { layout: { height: 400 } } });
      scroll().props.onContentSizeChange(350, 1200);
    });
    native.focused = true;
    await act(async () =>
      native.listeners.get("keyboardDidShow")?.({
        endCoordinates: { screenY: 500, height: 300 },
      }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(40);
    });
    await act(async () => scroll().props.onContentSizeChange(350, 1250));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(79);
    });
    expect(native.scrollTo).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(native.scrollTo).toHaveBeenCalledExactlyOnceWith({
      y: 40,
      animated: true,
    });

    // Layout changes midway through the animation still resolve to the same target.
    native.inputTop -= 10;
    await act(async () => {
      scroll().props.onScroll({ nativeEvent: { contentOffset: { y: 10 } } });
      scroll().props.onContentSizeChange(350, 1300);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    expect(native.scrollTo).toHaveBeenCalledTimes(1);
    native.inputTop -= 30;
    await act(async () => {
      scroll().props.onScroll({ nativeEvent: { contentOffset: { y: 40 } } });
      scroll().props.onContentSizeChange(350, 1300);
      scroll().props.onLayout({ nativeEvent: { layout: { height: 400 } } });
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(native.scrollTo).toHaveBeenCalledTimes(1);
    await act(async () => renderer.unmount());
  });

  it("cancels a pending correction when the user starts scrolling", async () => {
    setPlatform("android");
    const renderer = await renderBare(
      <ModulesList
        value={getTemplate(TemplateEnum.TASKLIST)}
        moduleAutoFocus={false}
        addModule={vi.fn()}
        deleteModule={vi.fn()}
        changeModule={vi.fn()}
        fastAccess={null}
        navigation={{} as any}
      />,
    );
    const scroll = renderer.root.findByType("ScrollView" as any);
    await act(async () => {
      scroll.props.onLayout({ nativeEvent: { layout: { height: 400 } } });
      scroll.props.onContentSizeChange(350, 1200);
    });
    native.focused = true;
    await act(async () =>
      native.listeners.get("keyboardDidShow")?.({
        endCoordinates: { screenY: 500, height: 300 },
      }),
    );
    await act(async () => scroll.props.onScrollBeginDrag());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(native.scrollTo).not.toHaveBeenCalled();
    await act(async () => renderer.unmount());
  });
  afterEach(() => {
    setPlatform("web");
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("uses only actual keyboard overlap after resize instead of adding the full keyboard height", async () => {
    setPlatform("android");
    const renderer = await renderBare(
      <ModulesList
        value={getTemplate(TemplateEnum.TASKLIST)}
        moduleAutoFocus={false}
        addModule={vi.fn()}
        deleteModule={vi.fn()}
        changeModule={vi.fn()}
        fastAccess={null}
        navigation={{} as any}
      />,
    );
    const scroll = () => renderer.root.findByType("ScrollView" as any);
    await act(async () => {
      native.listeners.get("keyboardDidShow")?.({
        endCoordinates: { screenY: 500, height: 300 },
      });
    });
    expect(scroll().props.contentContainerStyle.paddingBottom).toBe(12);
    native.height = 600;
    await act(async () =>
      scroll().props.onLayout({ nativeEvent: { layout: { height: 600 } } }),
    );
    expect(scroll().props.contentContainerStyle.paddingBottom).toBe(212);
    native.height = 400;
    await act(async () =>
      scroll().props.onLayout({ nativeEvent: { layout: { height: 400 } } }),
    );
    expect(scroll().props.contentContainerStyle.paddingBottom).toBe(12);
    await act(async () => renderer.unmount());
  });

  it.each(["web", "android"])(
    "focuses each new predicted task on %s even when initial autofocus is disabled",
    async (platform) => {
      setPlatform(platform);
      function Editor() {
        const [value, setValue] = useState(() =>
          getTemplate(TemplateEnum.TASKLIST),
        );
        return (
          <ModulesList
            value={value}
            moduleAutoFocus={false}
            addModule={(type) => {
              const added = getModuleData(type);
              setValue((current) => ({
                ...current,
                modules: [...current.modules, added],
              }));
              return added.id;
            }}
            deleteModule={vi.fn()}
            changeModule={vi.fn()}
            fastAccess={null}
            navigation={{} as any}
          />
        );
      }
      const renderer = await renderBare(<Editor />);
      const fields = () => renderer.root.findAllByType("ModuleField" as any);
      expect(fields().map((field) => field.props.autoFocus)).toEqual([false]);
      await act(async () =>
        renderer.root.findByType("PredictionButton" as any).props.onPress(),
      );
      expect(fields().map((field) => field.props.autoFocus)).toEqual([
        false,
        true,
      ]);
      await act(async () =>
        renderer.root.findByType("PredictionButton" as any).props.onPress(),
      );
      expect(fields().map((field) => field.props.autoFocus)).toEqual([
        false,
        false,
        true,
      ]);
      if (platform === "android")
        expect(native.scrollToEnd).not.toHaveBeenCalled();
      await act(async () => renderer.unmount());
    },
  );

  it("leaves initial autofocus disabled for modules added without a prediction click", async () => {
    const initial = getTemplate(TemplateEnum.TASKLIST);
    const props = {
      value: initial,
      moduleAutoFocus: false,
      addModule: vi.fn(),
      deleteModule: vi.fn(),
      changeModule: vi.fn(),
      fastAccess: null,
      navigation: {} as any,
    };
    const renderer = await renderBare(<ModulesList {...props} />);
    await act(async () =>
      renderer.update(
        <ModulesList
          {...props}
          value={{
            ...initial,
            modules: [...initial.modules, getModuleData(ModulesEnum.TASK)],
          }}
        />,
      ),
    );
    expect(
      renderer.root
        .findAllByType("ModuleField" as any)
        .map((field) => field.props.autoFocus),
    ).toEqual([false, false]);
    await act(async () => renderer.unmount());
  });
});
