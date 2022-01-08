const { REACT_APP_SERVER_PORT: port, REACT_APP_BASE_URL } = process.env;
const app_env = process.env.REACT_APP_ENV;
export const baseURL = app_env === 'production' ? '/api/' : `${REACT_APP_BASE_URL}:${port}/api/`;
export const urls = {
  init: 'init',
  statusCheck: 'status-check',
  createRoom: 'create-room',
  showRooms: 'show-rooms',
  joinRoom: 'join-room',
  leaveRoom: 'leave-room',
  userInfo: 'user-info',
};
export const SOCKET_ENDPOINT = app_env === 'production' ? '/' : `${REACT_APP_BASE_URL}:${port}`;
