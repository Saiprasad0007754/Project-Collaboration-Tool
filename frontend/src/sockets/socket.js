import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * A single shared Socket.IO client instance for the whole app.
 * `autoConnect: false` so we control exactly when the connection opens
 * (e.g. after the user is authenticated, in a later phase).
 */
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
});

/** Opens the socket connection. */
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/** Closes the socket connection. */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/** Joins a room scoped to a board/project so events stay targeted. */
export const joinRoom = (roomId) => {
  if (roomId) socket.emit('join_room', { roomId });
};

/** Leaves a previously joined room. */
export const leaveRoom = (roomId) => {
  if (roomId) socket.emit('leave_room', { roomId });
};
