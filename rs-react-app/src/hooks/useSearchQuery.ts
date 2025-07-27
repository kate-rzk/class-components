import { useState, useEffect } from 'react';

interface UseSearchQueryReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
}

const SEARCH_QUERY_KEY = 'pokemon_search_query';
const IS_SEARCHING_KEY = 'pokemon_is_searching';

export default function useSearchQuery(): UseSearchQueryReturn {
  const [searchQuery, setSearchQueryState] = useState<string>(() => {
    try {
      return localStorage.getItem(SEARCH_QUERY_KEY) || '';
    } catch (error) {
      console.warn('Не удалось прочитать searchQuery из localStorage:', error);
      return '';
    }
  });
  const [isSearching, setIsSearchingState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(IS_SEARCHING_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.warn('Не удалось прочитать isSearching из localStorage:', error);
      return false;
    }
  });
  useEffect(() => {
    try {
      if (searchQuery) {
        localStorage.setItem(SEARCH_QUERY_KEY, searchQuery);
      } else {
        localStorage.removeItem(SEARCH_QUERY_KEY);
      }
    } catch (error) {
      console.warn('Не удалось сохранить searchQuery в localStorage:', error);
    }
  }, [searchQuery]);
  useEffect(() => {
    try {
      if (isSearching) {
        localStorage.setItem(IS_SEARCHING_KEY, JSON.stringify(isSearching));
      } else {
        localStorage.removeItem(IS_SEARCHING_KEY);
      }
    } catch (error) {
      console.warn('Не удалось сохранить isSearching в localStorage:', error);
    }
  }, [isSearching]);

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query.trim());
  };
  const setIsSearching = (searching: boolean) => {
    setIsSearchingState(searching);
  };
  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
  };
}
