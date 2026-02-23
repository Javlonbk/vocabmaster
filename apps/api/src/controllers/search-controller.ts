import type { CefrLevel } from '@vocabmaster/shared';

import { getSearchFilterOptions, searchWords, type SearchFilters, type SearchResultWord, type SearchSort, type SearchStateFilter } from '../services/search-service';
import type { MasteryLabel } from '../utils/search-utils';

export type SearchController = {
  searchWords: (userId: string, filters: SearchFilters) => Promise<{ results: SearchResultWord[]; total: number; page: number; count: number; hasMore: boolean }>;
  getSearchFilterOptions: () => {
    levels: CefrLevel[];
    topics: string[];
    partsOfSpeech: string[];
    states: SearchStateFilter[];
    mastery: MasteryLabel[];
    sortOptions: SearchSort[];
  };
};

export function createSearchController(controller: Partial<SearchController> = {}): SearchController {
  return {
    searchWords: controller.searchWords ?? searchWords,
    getSearchFilterOptions: controller.getSearchFilterOptions ?? getSearchFilterOptions
  };
}
