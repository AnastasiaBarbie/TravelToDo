import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "NotesTravels",
    path: "/",
    component: () => import("../components/NotesTravels.vue"),
  },
  {
    name: "TouristGuide",
    path: "/",
    component: () => import("../components/TouristGuide.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
