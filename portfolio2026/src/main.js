import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "./style.css"
import { pin } from "./directives/pin"

import AOS from 'aos';
import 'aos/dist/aos.css';

createApp(App).use(router).directive("pin", pin).mount("#app")

AOS.init({
  duration: 800, // animation duration
  once: true,    // animate only once
});


