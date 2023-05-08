import { useRef, useEffect } from "react";

export const useWebsocket = (
  path: string,
  callback: (this: WebSocket, ev: MessageEvent<any>) => any
) => {
  const wsRef = useRef<WebSocket | undefined>(undefined);

  useEffect(() => {
    console.log("useWebsocket", path, callback);
    if (!wsRef.current || wsRef.current.CLOSED) {
      try {
        const ws = new WebSocket(path);
        ws.onmessage = callback;
        wsRef.current = ws;
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return wsRef;
};
