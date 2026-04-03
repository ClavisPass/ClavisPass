import type { SearchEntrySuggestion } from "../../../shared/bridge";

interface SuggestionRowProps {
  item: SearchEntrySuggestion;
}

export function SuggestionRow({ item }: SuggestionRowProps) {
  return (
    <article className="suggestion-row">
      <div className="suggestion-copy">
        <p className="suggestion-title">{item.title}</p>
        <p className="suggestion-identity">{item.email ?? item.username ?? "No username or email"}</p>
      </div>
    </article>
  );
}
