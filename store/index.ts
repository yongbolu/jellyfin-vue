import { MutationTree } from 'vuex';

export const state = () => ({
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false
  }
});

export const mutations: MutationTree<typeof state> = {
  SOCKET_ONOPEN(state, event) {},
  SOCKET_ONCLOSE(state, event) {},
  SOCKET_ONERROR(state, event) {},
  SOCKET_ONMESSAGE(state, message) {
    console.warn('Received a websocket message');
    console.dir(message);
  },
  SOCKET_RECONNECT(state, count) {},
  SOCKET_RECONNECT_ERROR(state) {}
};

export const actions = {
  sendMessage: function (context, message) {
    this.app.$socket.send(message);
  }
};
