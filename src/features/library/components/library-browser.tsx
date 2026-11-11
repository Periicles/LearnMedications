"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LibraryBrowserProps } from "@/types/library";
import { filterEntries, LIBRARY_PAGE_SIZE } from "../lib/entries";
import { LibraryItem } from "./library-item";

export function LibraryBrowser({ entries }: LibraryBrowserProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(LIBRARY_PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const matches = filterEntries(entries, deferredQuery);

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(LIBRARY_PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="relative block">
        <span className="sr-only">Rechercher une molécule, une marque ou une famille</span>
        <Search
          className="text-ink-soft pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Doliprane, bisoprolol, IEC…"
          className="border-line bg-surface focus:border-brand min-h-12 w-full rounded-2xl border-2 pr-4 pl-12 text-base font-semibold"
        />
      </label>
      <p className="text-ink-soft text-sm font-bold" role="status">
        {matches.length} {matches.length > 1 ? "molécules" : "molécule"}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {matches.slice(0, visibleCount).map((entry) => (
          <LibraryItem key={entry.slug} entry={entry} />
        ))}
      </ul>
      {matches.length > visibleCount ? (
        <Button
          variant="secondary"
          onClick={() => setVisibleCount((count) => count + LIBRARY_PAGE_SIZE)}
        >
          Afficher plus
        </Button>
      ) : null}
    </div>
  );
}
