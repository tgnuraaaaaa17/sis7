import { useEffect, useState } from 'react';
import { getAllPlaces } from '../services/service.js';

/** Loads every place once (for the Dashboard statistics). */
export default function useAllPlaces() {
  const [state, setState] = useState({ status: 'loading', places: [], error: '' });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState((previous) => ({ ...previous, status: 'loading', error: '' }));

    getAllPlaces()
      .then((places) => {
        if (cancelled) return;
        setState({ status: 'success', places, error: '' });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: 'error', places: [], error: error?.message || 'Unknown error' });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { ...state, reload: () => setReloadToken((token) => token + 1) };
}
