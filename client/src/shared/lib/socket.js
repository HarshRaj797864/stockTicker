import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

let socket;
function getSocket() {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}

export function useLivePrice(symbol) {
  const [live, setLive] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const s = getSocket();
    const onPrice = (payload) => {
      if (payload.symbol === symbol) setLive(payload);
    };
    s.emit("subscribe", { symbol });
    s.on("price", onPrice);
    return () => {
      s.emit("unsubscribe", { symbol });
      s.off("price", onPrice);
    };
  }, [symbol]);

  return live;
}
