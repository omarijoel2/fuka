import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, FileText, Calendar, GraduationCap, Users, Briefcase, Loader2 } from "lucide-react";

interface SearchResult {
  type: string;
  url: string;
  title: string;
  description?: string;
  category?: string;
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; colour: string }> = {
  news:        { label: "News", icon: FileText, colour: "#1A5C38" },
  event:       { label: "Event", icon: Calendar, colour: "#C9A227" },
  programme:   { label: "Programme", icon: GraduationCap, colour: "#1B3A6B" },
  staff:       { label: "Staff", icon: Users, colour: "#2D6A4F" },
  opportunity: { label: "Opportunity", icon: Briefcase, colour: "#8B1A1A" },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface Props {
  onClose?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onClose, autoFocus = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(d => { setResults(d?.data?.results ?? []); setLoading(false); })
      .catch(() => { setResults([]); setLoading(false); });
  }, [debouncedQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
  }

  function handleSelect(url: string) {
    navigate(url);
    onClose?.();
    setQuery("");
    setResults([]);
  }

  const showDropdown = focused && (results.length > 0 || (loading && query.length >= 2));

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search programmes, news, staff..."
          className="w-full pl-9 pr-8 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          data-testid="search-bar-input"
          aria-label="Site search"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            data-testid="search-bar-clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-xl z-50 overflow-hidden"
          role="listbox"
          data-testid="search-dropdown"
        >
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">No results found for "{query}"</div>
          )}
          {results.slice(0, 7).map((r, i) => {
            const meta = TYPE_META[r.type] ?? { label: r.type, icon: FileText, colour: "#888" };
            const Icon = meta.icon;
            return (
              <button
                key={i}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors border-b last:border-b-0"
                onMouseDown={() => handleSelect(r.url)}
                role="option"
                data-testid={`search-result-${i}`}
              >
                <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: meta.colour + "18" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: meta.colour }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  {r.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{r.description}</p>}
                </div>
                <span className="text-xs font-medium shrink-0 mt-1" style={{ color: meta.colour }}>{meta.label}</span>
              </button>
            );
          })}
          {results.length > 0 && (
            <button
              className="w-full px-4 py-2.5 text-xs font-semibold text-primary hover:bg-muted text-center border-t transition-colors"
              onMouseDown={handleSubmit as never}
              data-testid="search-see-all"
            >
              See all results for "{query}" →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Modal overlay wrapper ──────────────────────────────────────────────────── */
interface SearchModalProps { open: boolean; onClose: () => void; }

export function SearchModal({ open, onClose }: SearchModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" data-testid="search-modal">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-background rounded-2xl shadow-2xl p-4 border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Search KAFU</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" data-testid="search-modal-close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SearchBar onClose={onClose} autoFocus />
      </div>
    </div>
  );
}
