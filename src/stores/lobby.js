import { defineStore } from "pinia";
import { ref } from "vue";

export const useLobbyStore = defineStore(
  "lobby",
  () => {
    // 1. STATE (reactive variables)
    const lobbyCode = ref("");
    const currentParticipant = ref(null);
    const participants = ref([]);
    const messages = ref([]);
    const socket = ref(null);

    // 2. ACTIONS (methods to fetch data or modify state)
    function initializeLobby(apiResponseData) {
      lobbyCode.value = apiResponseData.code;

      console.log("initializing lobby");

      // Save the local player's details
      currentParticipant.value = {
        id: apiResponseData.id,
        sender: apiResponseData.in_game_name,
        lobby_status: apiResponseData.lobby_status,
        created_at: apiResponseData.created_at,
      };

      // Automatically add yourself to the live participants directory list
      if (!participants.value.some((p) => p.id === apiResponseData.id)) {
        participants.value.push({
          id: apiResponseData.id,
          sender: apiResponseData.in_game_name,
          lobby_status: apiResponseData.lobby_status,
          created_at: apiResponseData.created_at,
        });
        console.log("active participants: ", participants.value);
      }
    }

    // Optimistic UI update: add it locally instantly so the user doesn't feel lag

    // Return everything you want your components to see
    return {
      lobbyCode,
      currentParticipant,
      participants,
      messages,
      initializeLobby,
    };
  },
  {
    persist: true,
  },
);
