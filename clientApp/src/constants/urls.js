const { REACT_APP_SERVER_PORT: port, REACT_APP_BASE_URL } = process.env;
export const baseURL = `${REACT_APP_BASE_URL}:${port}/api/`;
export const urls = {
  init: 'init',
  statusCheck: 'status-check',
  createRoom: 'create-room',
  showRooms: 'show-rooms',
  joinRoom: 'join-room',
  leaveRoom: 'leave-room',
  userInfo: 'user-info',
};
export const token = 'token';
export const SOCKET_ENDPOINT = `${REACT_APP_BASE_URL}:${port}`;
