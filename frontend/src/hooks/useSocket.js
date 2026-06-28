import { useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '@/sockets/socket';

/**
 * Connects the shared socket on mount and disconnects on unmount.
 * Returns the socket instance so components can attach/remove listeners.
 *
 * Usage:
 *   const socket = useSocket();
 *   useEffect(() => {
 *     socket.on('task:created', handler);
 *     return () => socket.off('task:created', handler);
 *   }, [socket]);
 */
const useSocket = () => {
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return socket;
};

export default useSocket;
