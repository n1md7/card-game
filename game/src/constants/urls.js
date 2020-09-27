const { REACT_APP_SERVER_PORT: port } = process.env;
export const baseURL = `http://localhost:${ port }/api/`;
export const urls = {
  init: "init",
  statusCheck: "status-check",
  createRoom: "create-room",
  showRooms: "show-rooms",
  joinRoom: "join-room",
  leaveRoom: "leave-room",
  userInfo: "user-info",
};
export const token = "token";
export const SOCKET_ENDPOINT = `http://localhost:${ port }`;
