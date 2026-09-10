import { createRouter, createWebHistory } from "vue-router";
import JoinRoomView from "../components/JoinRoomView.vue";
import Lobby from "../components/Lobby.vue";
import Login from "../components/Login.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      name: "join-room",
      component: JoinRoomView,
    },
    {
      // The :code syntax creates a dynamic parameter in the URL
      path: "/lobby/:code",
      name: "lobby",
      component: Lobby, // We'll set this dynamically in the beforeEnter guard
    },
  ],
});

export default router;
