import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { createPinia } from "pinia";
import echo from "@/services/echo";
import router from "./router/myRouter";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "emoji-mart";

window.Pusher = Pusher;

window.Echo = echo;

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);

app.mount("#app");
