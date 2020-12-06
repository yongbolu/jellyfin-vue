import { ActionTree, MutationTree } from 'vuex';

export interface SearchState {
  query: string;
}

export const state = (): SearchState => ({
  query: ''
});

interface SearchMutationPayload {
  query: string;
}

export const mutations: MutationTree<SearchState> = {
  SET_SEARCH_QUERY(state: SearchState, { query }: SearchMutationPayload) {
    state.query = query;
  }
};

export const actions: ActionTree<SearchState, SearchState> = {
  setSearchQuery({ commit }, { query }: SearchMutationPayload) {
    commit('SET_SEARCH_QUERY', { query });
  }
};
