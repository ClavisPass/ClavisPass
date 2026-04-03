import type { FillDataResult } from "../shared/bridge";
import type {
  PromptResolutionResult,
  SavePromptCandidate,
  SavePromptDecision,
  SavePromptResolution
} from "../shared/types";
import type { SearchEntrySuggestion } from "../shared/bridge";
import { getNormalizedDomainFromUrl } from "../shared/domain";

interface PreparedFillRecord {
  tabId: number;
  fillData: FillDataResult;
  preparedAt: number;
}

interface SavePromptEvaluation {
  promptCreated: boolean;
  prompt?: SavePromptDecision;
}

interface RegisteredFrameInfo {
  frameId: number;
  url?: string;
  updatedAt: number;
}

function normalizeIdentity(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

function buildPromptTitle(domain: string): string {
  const firstLabel = domain.split(".")[0] ?? domain;
  return firstLabel.charAt(0).toUpperCase() + firstLabel.slice(1);
}

export class ExtensionState {
  private readonly preparedFillByTab = new Map<number, PreparedFillRecord>();
  private readonly framesByTab = new Map<number, Map<number, RegisteredFrameInfo>>();
  private pendingPrompt?: SavePromptDecision;
  private lastPromptFingerprint?: string;

  setPreparedFill(tabId: number, fillData: FillDataResult): PreparedFillRecord {
    const record: PreparedFillRecord = {
      tabId,
      fillData,
      preparedAt: Date.now()
    };

    this.preparedFillByTab.set(tabId, record);
    return record;
  }

  getPreparedFill(tabId: number): PreparedFillRecord | undefined {
    return this.preparedFillByTab.get(tabId);
  }

  consumePreparedFill(tabId: number): PreparedFillRecord | undefined {
    const record = this.preparedFillByTab.get(tabId);
    this.preparedFillByTab.delete(tabId);
    return record;
  }

  clearPreparedFill(tabId: number): void {
    this.preparedFillByTab.delete(tabId);
  }

  registerFrame(tabId: number, frameId: number, url?: string): void {
    let frames = this.framesByTab.get(tabId);
    if (!frames) {
      frames = new Map<number, RegisteredFrameInfo>();
      this.framesByTab.set(tabId, frames);
    }

    frames.set(frameId, {
      frameId,
      url,
      updatedAt: Date.now()
    });
  }

  getRegisteredFrames(tabId: number): RegisteredFrameInfo[] {
    const frames = this.framesByTab.get(tabId);
    if (!frames) {
      return [];
    }

    return [...frames.values()].sort((left, right) => left.frameId - right.frameId);
  }

  clearFramesForTab(tabId: number): void {
    this.framesByTab.delete(tabId);
  }

  getPendingPrompt(): SavePromptDecision | undefined {
    return this.pendingPrompt;
  }

  evaluateSavePromptCandidate(
    candidate: SavePromptCandidate,
    suggestions: SearchEntrySuggestion[],
    existingFillDataById: Map<string, FillDataResult>
  ): SavePromptEvaluation {
    const normalizedDomain = getNormalizedDomainFromUrl(candidate.url);
    if (!normalizedDomain || !candidate.password) {
      return { promptCreated: false };
    }

    const normalizedUsername = normalizeIdentity(candidate.username);
    const fingerprint = JSON.stringify({
      domain: normalizedDomain,
      username: normalizedUsername,
      passwordLength: candidate.password.length
    });

    if (this.lastPromptFingerprint === fingerprint) {
      return { promptCreated: false, prompt: this.pendingPrompt };
    }

    const matchingSuggestion = suggestions.find((item) => {
      if (!normalizedUsername) {
        return false;
      }

      return normalizeIdentity(item.username) === normalizedUsername || normalizeIdentity(item.email) === normalizedUsername;
    });

    if (matchingSuggestion) {
      const existingFillData = existingFillDataById.get(matchingSuggestion.entryId);
      if (existingFillData && existingFillData.password === candidate.password) {
        this.lastPromptFingerprint = fingerprint;
        return { promptCreated: false };
      }

      const prompt: SavePromptDecision = {
        id: crypto.randomUUID(),
        kind: "update",
        candidate,
        suggestedTitle: matchingSuggestion.title,
        existingEntryId: matchingSuggestion.entryId,
        existingEntryTitle: matchingSuggestion.title,
        matchedHostname: normalizedDomain,
        createdAt: Date.now()
      };

      this.pendingPrompt = prompt;
      this.lastPromptFingerprint = fingerprint;
      return { promptCreated: true, prompt };
    }

    const prompt: SavePromptDecision = {
      id: crypto.randomUUID(),
      kind: "create",
      candidate,
      suggestedTitle: buildPromptTitle(normalizedDomain),
      matchedHostname: normalizedDomain,
      createdAt: Date.now()
    };

    this.pendingPrompt = prompt;
    this.lastPromptFingerprint = fingerprint;
    return { promptCreated: true, prompt };
  }

  resolvePendingPrompt(promptId: string, decision: SavePromptResolution): PromptResolutionResult {
    if (!this.pendingPrompt || this.pendingPrompt.id !== promptId) {
      return {
        prompt: this.pendingPrompt,
        message: "No matching save prompt is currently pending."
      };
    }

    const prompt = this.pendingPrompt;
    this.pendingPrompt = undefined;

    if (decision === "dismiss") {
      return {
        message: "Suggestion dismissed."
      };
    }

    if (decision === "save") {
      return {
        message: `Save confirmed for ${prompt.suggestedTitle}. Desktop write commands are the next integration step.`
      };
    }

    return {
      message: `Update confirmed for ${prompt.existingEntryTitle ?? prompt.suggestedTitle}. Desktop write commands are the next integration step.`
    };
  }
}
