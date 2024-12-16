import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./router.js";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

app.use(router);

app.mount("#app");
