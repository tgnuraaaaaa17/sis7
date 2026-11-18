import { useEffect, useState } from 'react';
import { getPlace, isValidPlaceId, PlaceNotFoundError } from '../services/service.js';
import { beginDetailRequest, isLatestDetailRequest } from '../utils/requestGuard.js';

const LOADING = { status: 'loading', place: null, error: '', loadedAt: '' };

/**
 * Loads one place by the id from the URL.
 *   status: loading | success | notfound | error
 *
 * - an invalid id (abc, 0, -5) never reaches the API: it is "notfound";
 * - when the id changes, the previous request is ignored (stale request);
 * - `patchPlace` merges an API response into the loaded place, using a
 *   functional update so it never works with an outdated state.
 */
export default function usePlace(id) {
  const [state, setState] = useState(LOADING);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!isValidPlaceId(id)) {
      setState({ status: 'notfound', place: null, error: '', loadedAt: '' });
      return undefined;
    }

    let cancelled = false;
    const requestId = beginDetailRequest();

    setState(LOADING);

    getPlace(id)
      .then((place) => {
        if (cancelled || !isLatestDetailRequest(requestId)) return;
        setState({ status: 'success', place, error: '', loadedAt: new Date().toISOString() });
      })
      .catch((error) => {
        if (cancelled || !isLatestDetailRequest(requestId)) return;

        if (error instanceof PlaceNotFoundError) {
          setState({ status: 'notfound', place: null, error: '', loadedAt: '' });
        } else {
          setState({
            status: 'error',
            place: null,
            error: error?.message || 'Unknown error',
            loadedAt: '',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  function patchPlace(changes) {
    setState((previous) =>
      previous.place && previous.place.id === changes.id
        ? { ...previous, place: { ...previous.place, ...changes } }
        : previous,
    );
  }

  return { ...state, patchPlace, reload: () => setReloadToken((token) => token + 1) };
}
