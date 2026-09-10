import { ref, onUnmounted } from "vue";
import echo from "@/services/echo";
import { useAuthStore } from "@/stores/auth";

// 1. Remove the broken 'user' parameter from the main function arguments
export function useTyping(lobbyCode) {
  const typingUsers = ref(new Map());
  const timers = new Map();
  const channel = echo.private(`client-event-typing.${lobbyCode.value}`);
  const auth = useAuthStore();

  function sendTyping() {
    const currentUser = auth.user;

    if (!currentUser?.id) {
      return;
    }

    channel.whisper("client-typing", {
      userId: currentUser.id,
      name: currentUser.name,
    });
  }

  function listenForTyping() {
    channel.listenForWhisper("client-typing", (data) => {
      // 2. 👇 FIX: Safely check against the authenticated user from the store
      if (data.userId === auth.user?.id) {
        return;
      }

      typingUsers.value.set(data.userId, data.name);

      clearTimeout(timers.get(data.userId));

      const timer = setTimeout(() => {
        typingUsers.value.delete(data.userId);
        timers.delete(data.userId);
      }, 1500);

      timers.set(data.userId, timer);
    });
  }

  function stop() {
    echo.leave(`client-event-typing.${lobbyCode.value}`);
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  }

  listenForTyping();
  onUnmounted(stop);

  return {
    typingUsers,
    sendTyping,
  };
}
