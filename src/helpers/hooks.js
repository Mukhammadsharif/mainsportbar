import {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import baseAxios, {domain} from './request';
import {GlobalContext} from '../components/GlobalContext';
import {uniqBy} from './array';

export function usePostRequest(options = {}) {
  return useRequest({method: 'POST', ...options});
}

export function usePutRequest(options = {}) {
  return useRequest({method: 'PUT', ...options});
}

export function useGetRequest(options = {}) {
  return useRequest({method: 'GET', ...options});
}

export function useDeleteRequest(options = {}) {
  return useRequest({method: 'DELETE', ...options});
}

export function useRequest(options = {}) {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const {signOut, lang} = useContext(GlobalContext);

  async function request(overrideOptions = {}, sync = false) {
    setLoading(true);
    try {
      const {data} = await baseAxios({
        headers: {
          // Authorization: `Token ${token || ''}`,
          'Accept-Language': lang,
        },
        ...options,
        ...overrideOptions,
      });
      if (!sync) {
        setResponse(data);
      }
      return {response: data, success: true};
    } catch (e) {
      setError(e.response || {});
      if (e.response === undefined) {
      } else if (e.response.status >= 500) {
      } else if (e.response.status === 401 && e.response.data.detail) {
        typeof signOut === 'function'
          ? signOut(overrideOptions.navigation)
          : null;
      }

      return {error: e.response, success: false};
    } finally {
      if (!sync) {
        setLoading(false);
      }
    }
  }

  return {loading, request, error, response, setResponse, setError, setLoading};
}

export function useLoad(options, dependencies = []) {
  const navigation = useNavigation();
  const route = useRoute();

  const request = useRequest({
    method: 'GET',
    ...options,
  });

  useEffect(() => {
    // setNavigationRoute({navigation, route});
    request.request({navigation});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return request;
}

export function useImageRequest(options) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const {token} = useContext(GlobalContext);

  async function request({data}) {
    try {
      setLoading(true);
      axios.defaults.headers = {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      };
      const res = await axios.put(`${domain}/api/v1/${options.url}`, data);
      return {response: res.data, success: true};
    } catch (e) {
      setError(e);
      return {error: e};
    } finally {
      setLoading(false);
    }
  }

  return {request, response, setResponse, error, setError, loading, setLoading};
}

export function useInfiniteScroll(options, dependencies = []) {
  const [page, setPage] = useState(1);
  const items = useGetRequest({...options, params: {...options.params, page}});
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...dependencies]);

  async function loadItems() {
    const {response} = await items.request();
    const oldItems = items.response ? items.response.results : [];
    const newItems = response ? response.results : [];

    if (!response) {
      return;
    }

    items.setResponse({
      ...response,
      count: response ? response.count : 0,
      results: uniqBy([...oldItems, ...newItems], 'id'),
    });
    setHasMore(oldItems.length + newItems.length !== response.count);
  }

  function reset() {
    items.setResponse({count: 0, results: []});
    setPage(1);
  }

  async function reload() {
    reset();
    await items.request({params: {...options.params, page: 1}});
  }

  function onPageEnd() {
    if (items.loading) {
      return;
    }

    if (hasMore) {
      setPage(page + 1);
    }
  }

  return {onPageEnd, ...items, hasMore, reload, reset};
}
