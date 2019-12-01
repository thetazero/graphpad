import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: lazzyLoader('Create')
  },
  {
    path: '/node/:id',
    name: 'node',
    props: true,
    component: lazzyLoader('Node')
  }
]

function lazzyLoader(name) {
  return () => import(`../views/${name}.vue`)
}

const router = new VueRouter({
  routes
})

export default router
