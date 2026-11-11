import type { Page } from "@playwright/test";

export interface TestUser {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface ContentIndex {
  /** Substance name by brand name. */
  nameByBrand: Map<string, string>;
  /** Brand names by substance name. */
  brandsByName: Map<string, string[]>;
  /** Family name by substance name. */
  familyByName: Map<string, string>;
  /** Main indication by substance name. */
  hintByName: Map<string, string>;
}

export interface PlayOptions {
  /** Number of multiple-choice questions to answer wrongly on purpose. */
  mistakes?: number;
}

export interface AppFixtures {
  /** The visible page content; previous routes may stay mounted but hidden. */
  content: ReturnType<Page["locator"]>;
  /** Signed-in user dedicated to the current browser project. */
  member: TestUser;
}

export interface StoredUsers {
  [projectName: string]: TestUser;
}
