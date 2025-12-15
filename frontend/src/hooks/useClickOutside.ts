import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent) => {
      if (
        !ref.current?.contains(event.target) &&
        !document.getElementById("modal")?.contains(event.target)
      ) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler, enabled]);
}
