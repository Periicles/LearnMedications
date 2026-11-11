export interface LibraryEntry {
  slug: string;
  name: string;
  brands: string[];
  className: string;
  areaName: string;
  areaIcon: string;
  hint: string;
  /** Lower-cased, accent-free text used for searching. */
  searchText: string;
  strength: number | null;
}

export interface LibraryBrowserProps {
  entries: LibraryEntry[];
}

export interface LibraryItemProps {
  entry: LibraryEntry;
}
