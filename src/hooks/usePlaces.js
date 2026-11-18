import { useEffect, useState } from 'react';
import { getPlaces } from '../services/service.js';
import { beginListRequest, isLatestListRequest } from '../utils/requestGuard.js';

const INITIAL_STATE = {
  status: 'loading', // loading | success | empty | error
  places: [],
  total: 0,
  totalPages: 1,
  page: 1,
  requestedPage: 1, // the page number that was asked for (may differ from `page` if it was out of range)
  facets: { categories: [], regions: [] },
  error: '',
};

/**
 * Loads one page of the places list. The effect restarts whenever a filter,
 * the sort order, the page or the reload token changes. Only primitive values
 * are used as dependencies.
 *
 * Stale responses are ignored twice: by the `cancelled` flag of the cleanup
 * function and by the request counter from utils/requestGuard.js.
 */
export default function usePlaces({ search, category, region, status, sort, page }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const requestId = beginListRequest();

    setState((previous) => ({ ...previous, status: 'loading', error: '' }));

    getPlaces({ search, category, region, status, sort, page })
      .then((result) => {
        if (cancelled || !isLatestListRequest(requestId)) return;

        setState({
          status: result.total > 0 ? 'success' : 'empty',
          places: result.data,
          total: result.total,
          totalPages: result.totalPages,
          page: result.page,
          requestedPage: page,
          facets: result.facets,
          error: '',
        });
      })
      .catch((error) => {
        if (cancelled || !isLatestListRequest(requestId)) return;

        setState((previous) => ({
          ...previous,
          status: 'error',
          places: [],
          total: 0,
          error: error?.message || 'Unknown error',
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, region, status, sort, page, reloadToken]);

  return { ...state, reload: () => setReloadToken((token) => token + 1) };
}
