import { useEffect, useEffectEvent } from "react";

/** Calls the handler with the pressed key while the component is mounted. */
export function useKeyPress(handler: (pressedKey: string) => void): void {
  const onKey = useEffectEvent(handler);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey(event.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}
