import { useState, useEffect } from "react";

export function useSignal<T>(signal: {
  value: T;
  subscribe: (cb: VoidFunction) => VoidFunction;
}): T {
  const [, setTrigger] = useState({});

  useEffect(() => {
    return signal.subscribe(() => setTrigger({}));
  }, [signal]);

  return signal.value;
}

export default useSignal;
