import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

export default {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
    app.provide("socket", socket);
  },
};

export { socket };
