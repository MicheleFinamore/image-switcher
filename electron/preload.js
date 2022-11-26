// const { CONTEXT_NAME, PERFORM_ACTION } = require("../shared/Configuration");
const { ipcRenderer, contextBridge } = require("electron");
// console.log("Sto eseguendo preload.js")

const WINDOW_API = {
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
  //   perform_action: (payload) => ipcRenderer.send(PERFORM_ACTION, payload),
  receive: (channel, func) => {
    // Deliberately strip event as it includes `sender`
    const subscription = (event, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  receiveOnce: (channel, func) => {
    // Deliberately strip event as it includes `sender`
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  removeAllListeners: (channel, func) => {
    ipcRenderer.removeAllListeners(channel);
  },
};

contextBridge.exposeInMainWorld("ipc_renderer", WINDOW_API);
