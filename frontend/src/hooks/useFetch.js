import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../utils";

// Generic loader: calls an API function on mount and exposes { data, loading, error, reload }.
export function useFetch(fetcher, initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    return fetcher()
      .then((result) => { setData(result); setError(""); })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload };
}
