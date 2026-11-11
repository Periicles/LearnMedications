import { clsx } from "clsx";
import type { ClassValue } from "clsx";

export function mergeClasses(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
