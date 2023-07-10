import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import nftSlug from "../pages/nft/_.vue"
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/nft/:slug",
    name: "NFT",
    component: nftSlug
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router