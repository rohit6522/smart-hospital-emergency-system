import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onAmbulanceUpdate, onStatusChange) => {
  const wsUrl = `${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`;
  const socket = new SockJS(wsUrl);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ WebSocket connected");
      if (onStatusChange) onStatusChange(true);
      stompClient.subscribe("/topic/ambulance-updates", (message) => {
        const updatedAmbulance = JSON.parse(message.body);
        onAmbulanceUpdate(updatedAmbulance);
      });
    },
    onDisconnect: () => {
      console.log("🔴 WebSocket disconnected");
      if (onStatusChange) onStatusChange(false);
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
      if (onStatusChange) onStatusChange(false);
    },
    onWebSocketClose: () => {
      if (onStatusChange) onStatusChange(false);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};