import { Plugin } from '@nuxt/types';
import { AxiosInstance } from 'axios';
import { SessionApi } from '~/api/api';
import { Configuration } from '~/api/configuration';

declare module '@nuxt/types' {
  interface Context {
    $sessionApi: SessionApi;
  }

  interface NuxtAppOptions {
    $sessionApi: SessionApi;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $sessionApi: SessionApi;
  }
}

const sessionApiPlugin: Plugin = (context, inject) => {
  const config = new Configuration();

  const sessionApi = new SessionApi(
    config,
    '',
    context.$axios as AxiosInstance
  );
  inject('sessionApi', sessionApi);
};

export default sessionApiPlugin;
