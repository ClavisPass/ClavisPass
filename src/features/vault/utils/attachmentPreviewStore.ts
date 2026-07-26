import { AttachmentFile } from "../model/modules/AttachmentModuleType";

const previews = new Map<string, AttachmentFile>();

export function setAttachmentPreview(file: AttachmentFile): string {
  const previewId = `${file.id}-${Date.now()}`;
  previews.set(previewId, file);
  return previewId;
}

export function getAttachmentPreview(previewId: string): AttachmentFile | null {
  return previews.get(previewId) ?? null;
}

export function clearAttachmentPreview(previewId: string) {
  previews.delete(previewId);
}
