import { useEffect, useRef } from "react";

export default function usePrevious<T>(value: T): T | null {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (ref.current !== value) ref.current = value;
  }, [value]);
  return ref.current;
}
