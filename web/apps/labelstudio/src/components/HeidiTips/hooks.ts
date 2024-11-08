import { useCallback, useEffect, useState } from "react";
import { dismissTip, getRandomTip } from "./utils";
import type { Tip, TipsCollection } from "./types";

export const useRandomTip = (collection: keyof TipsCollection) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const dismiss = useCallback(() => {
    dismissTip(collection);
    setTip(null);
  }, []);

  useEffect(() => {
    getRandomTip(collection).then(setTip);
  }, [collection]);

  return [tip, dismiss] as const;
};
