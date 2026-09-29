"use client";

import { useRef, useState } from "react";
import { post } from "./auth";

// One submit at a time, with visible "busy" and error states, so a form never
// double-posts on a double click and never fails silently.
export function useSubmit(path: string, onDone: () => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const submit = async (data: Record<string, unknown>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    const res = await post(path, data);
    inFlight.current = false;
    setBusy(false);
    if (res.error) setError(res.error);
    else onDone();
  };

  return { busy, error, submit };
}
