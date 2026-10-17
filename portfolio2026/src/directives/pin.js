// v-pin: papier sa "pripne" na nástenku, keď sa pri scrollovaní objaví na obrazovke.
// Pridá triedu .is-pinned (animácia je v style.css pri .bi).
let observer

const getObserver = () => {
  if (observer) return observer

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add("is-pinned")
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" })

  return observer
}

export const pin = {
  mounted(el) {
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-pinned")
      return
    }
    getObserver().observe(el)
  },

  unmounted(el) {
    observer?.unobserve(el)
  }
}
