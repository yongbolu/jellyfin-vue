import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { union } from 'lodash';
import { BaseItemDto } from '~/api';

export enum PlaybackStatus {
  stopped,
  playing,
  paused,
  error
}

export interface PlaybackManagerState {
  status: PlaybackStatus;
  currentItemIndex: number | null;
  currentMediaSourceIndex: number | null;
  currentVideoStreamIndex: number | null;
  currentAudioStreamIndex: number | null;
  currentSubtitleStreamIndex: number | null;
  currentVolume: number;
  isFullscreen: boolean;
  queue: BaseItemDto[];
}

export const state = (): PlaybackManagerState => ({
  status: PlaybackStatus.stopped,
  currentItemIndex: null,
  currentMediaSourceIndex: null,
  currentVideoStreamIndex: null,
  currentAudioStreamIndex: null,
  currentSubtitleStreamIndex: null,
  currentVolume: 100,
  isFullscreen: false,
  queue: []
});

export const getters: GetterTree<PlaybackManagerState, PlaybackManagerState> = {
  getCurrentItem: (state) => {
    if (state.currentItemIndex !== null) {
      return state.queue[state.currentItemIndex];
    } else {
      return null;
    }
  },
  getMediaSource: (state) => {
    if (
      state.currentItemIndex !== null &&
      state.currentMediaSourceIndex !== null
    ) {
      return state.queue[state.currentItemIndex].MediaSources[
        state.currentMediaSourceIndex
      ];
    } else {
      return null;
    }
  }
};

interface QueueMutationPayload {
  queue: BaseItemDto[];
}

interface CurrentItemIndexMutationPayload {
  currentItemIndex: number;
}

export const mutations: MutationTree<PlaybackManagerState> = {
  SET_QUEUE(state: PlaybackManagerState, { queue }: QueueMutationPayload) {
    state.queue = queue;
  },
  ADD_TO_QUEUE(state: PlaybackManagerState, { queue }: QueueMutationPayload) {
    state.queue = union(state.queue, queue);
  },
  SET_CURRENT_ITEM_INDEX(
    state: PlaybackManagerState,
    { currentItemIndex }: CurrentItemIndexMutationPayload
  ) {
    state.currentItemIndex = currentItemIndex;
  },
  STOP_PLAYBACK(state: PlaybackManagerState) {
    state.currentItemIndex = null;
  }
};
