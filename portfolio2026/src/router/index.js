import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import ProjectView from "../views/ProjectView.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/project/:id", component: ProjectView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
  const navigation = performance.getEntriesByType("navigation")[0]
  const isInitialReload = navigation?.type === "reload" && from.matched.length === 0

  if (isInitialReload) {
    const savedScroll = Number(sessionStorage.getItem("portfolio-scroll-position") || 0)
    return savedScroll > 0 ? { top: savedScroll, behavior: "auto" } : false
  }

  if (savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(savedPosition)
        setTimeout(() => {
          window.dispatchEvent(new Event('scroll'))
        }, 100)
      }, 300)
    })
  }
  return { top: 0 }
}
})

export default router