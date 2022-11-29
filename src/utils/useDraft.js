import { useMemo, useState, useCallback } from "react";

export default function useDraft(initial) {
  const [altered, setAltered] = useState({});

  const updateDraft = useCallback(
    (data) => {
      let _data = {};
      let current = { ...initial, ...altered, ...data };
      const keys = Object.keys(current);

      if (!data || keys.length === 0) return;

      for (let index = 0; index < keys.length; index++) {
        let key = keys[index];

        if (initial[key] !== current[key]) {
          _data[key] = current[key];
        }
      }

      setAltered(_data);
      return _data;
    },

    [altered, setAltered, initial]
  );

  const dirty = useMemo(() => Object.keys(altered).length > 0, [altered]);

  const resetDraft = useCallback(() => {
    setAltered({});
  }, [setAltered]);

  const draft = useMemo(
    () => ({
      ...initial,
      ...altered,
    }),
    [initial, altered]
  );

  return {
    updateDraft,
    resetDraft,
    changed: altered,
    dirty,
    draft,
  };
}
