import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onAmbulanceUpdate) => {
  const socket = new SockJS(`${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ WebSocket connected");
      stompClient.subscribe("/topic/ambulance-updates", (message) => {
        const updatedAmbulance = JSON.parse(message.body);
        onAmbulanceUpdate(updatedAmbulance);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};