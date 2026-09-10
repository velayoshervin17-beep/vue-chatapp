import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import api from "../services/api";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const loading = ref(true);

    async function login(credentials) {
      // Get Sanctum's CSRF cookie first
      const csrf = await api.get("/sanctum/csrf-cookie");

      console.log("CSRF response:", csrf.status);

      // Login
      const response = await api.post("/login", credentials);

      user.value = response.data.user;

      return response.data;
    }

    async function fetchUser() {
      const response = await api.get("/api/user");

      user.value = response.data;

      return user.value;
    }

    async function logout() {
      await api.post("/api/logout");

      user.value = null;
    }

    return {
      user,
      login,
      fetchUser,
      logout,
    };
  },
  {
    persist: true,
  },
);
