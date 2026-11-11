export interface BdpmData {
  /** Normalised specialty name by CIS code. */
  specialties: Map<string, string>;
  /** Normalised substance denominations by CIS code. */
  compositions: Map<string, string[]>;
}

export interface BdpmFinding {
  substanceSlug: string;
  message: string;
}
