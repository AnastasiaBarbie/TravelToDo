import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { useStore } from "./pinia/store";
import './assets/variables.scss'

loadFonts();

const pinia = createPinia();
createApp(App).use(pinia);
const mainStore = useStore();
mainStore.initializeStore();

createApp(App).use(router).use(vuetify).mount("#app");
