import { Plugin } from '@nuxt/types';
import { stringify } from 'qs';

const userInitPlugin: Plugin = async (context) => {
  if (
    context.store.state.user.id &&
    context.store.state.user.serverUrl &&
    context.store.state.user.accessToken
  ) {
    context.$axios.setBaseURL(context.store.state.user.serverUrl);

    context.$auth.setUserToken(context.store.state.user.accessToken);

    const response = await context.$userApi.getUserById({
      userId: context.store.state.user.id
    });

    context.$auth.setUser(response.data);

    await context.$sessionApi.postFullCapabilities({
      clientCapabilities: {
        PlayableMediaTypes: ['Audio', 'Video'],
        SupportsMediaControl: true,
        SupportsPersistentIdentifier: false
      }
    });

    const socketParams = stringify({
      api_key: context.store.state.user.apiKey,
      deviceId: context.store.state.deviceProfile.deviceId
    });
    let socketUrl = `${this.$axios.defaults.baseURL}/socket${socketParams}`;
    socketUrl = socketUrl.replace('https:', 'wss:');
    socketUrl = socketUrl.replace('http:', 'ws:');
  }
};

export default userInitPlugin;
