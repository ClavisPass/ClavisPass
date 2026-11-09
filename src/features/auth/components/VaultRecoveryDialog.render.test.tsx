import React from "react";
import { act } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";
import {
  renderWithAppProviders,
  textContent,
} from "../../../../tests/render/render";
import VaultRecoveryDialog from "./VaultRecoveryDialog";

const verifyKey = vi.hoisted(() =>
  vi.fn(async (_content: string, key: string) => {
    if (key !== "valid-test-key") throw new Error("bad key");
  }),
);
vi.mock("../../../infrastructure/crypto/vault/vaultRecovery", () => ({
  supportsVaultRecovery: () => true,
  verifyVaultRecoveryKey: verifyKey,
}));
vi.mock("../../../shared/components/modals/Modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("expo-crypto", () => ({}));
vi.mock("react-native", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  Keyboard: { dismiss: vi.fn() },
}));

describe("forgot master password", () => {
  it("requires the recovery key before presenting the new-password fields", async () => {
    const onRecover = vi.fn(async () => {});
    const view = await renderWithAppProviders(
      <VaultRecoveryDialog
        content="vault-ciphertext"
        recoverySupported
        onDismiss={vi.fn()}
        onRecover={onRecover}
      />,
    );
    const inputs = () => view.root.findAllByType("PaperTextInput" as any);
    expect(inputs()).toHaveLength(1);
    expect(inputs()[0].props.label).toBe("login:recoveryEnterKey");
    await act(async () => inputs()[0].props.onChangeText("invalid-test-key"));
    await act(async () => inputs()[0].props.onSubmitEditing());
    expect(textContent(view)).toContain("login:recoveryInvalidKey");
    expect(onRecover).not.toHaveBeenCalled();
    await act(async () => inputs()[0].props.onChangeText("valid-test-key"));
    await act(async () => inputs()[0].props.onSubmitEditing());
    expect(inputs()).toHaveLength(2);
    expect(inputs()[0].props.label).toBe("login:newMasterPassword");
    const password = "D#77tRf9G.mYn4?Xq2S!F8";
    await act(async () => inputs()[0].props.onChangeText(password));
    await act(async () => inputs()[1].props.onChangeText("different"));
    await act(async () => inputs()[1].props.onSubmitEditing());
    expect(onRecover).not.toHaveBeenCalled();
    await act(async () => inputs()[1].props.onChangeText(password));
    await act(async () => inputs()[1].props.onSubmitEditing());
    expect(onRecover).toHaveBeenCalledWith(
      "valid-test-key",
      password,
      expect.any(Function),
    );
    await act(async () => view.unmount());
  });

  it("does not offer a recovery write for an unsupported provider", async () => {
    const view = await renderWithAppProviders(
      <VaultRecoveryDialog
        content="vault-ciphertext"
        recoverySupported={false}
        onDismiss={vi.fn()}
        onRecover={vi.fn()}
      />,
    );
    expect(view.root.findAllByType("PaperTextInput" as any)).toHaveLength(0);
    expect(textContent(view)).toContain("login:recoveryProviderUnsupported");
    await act(async () => view.unmount());
  });
});
