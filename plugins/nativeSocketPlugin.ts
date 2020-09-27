import { Plugin } from '@nuxt/types';
import Vue from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Need to build a Type package for the module
// @ts-ignore
import VueNativeSock from 'vue-native-websocket';

const nativeSocketPlugin: Plugin = ({ store }) => {
  Vue.use(VueNativeSock, 'ws://localhost:8096', {
    connectManually: true,
    reconnection: true,
    reconnectionAttempts: 5,
    store
  });
};

export default nativeSocketPlugin;
