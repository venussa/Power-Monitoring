import Vue from 'vue'
import VueRouter from 'vue-router'
import pages from './pages'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    ...pages,
    {
      path: '*',
      redirect: '/',
    },
  ],
})

// Session Management
router.beforeEach((to, from, next) => {
  // if user not login
  if (to.matched.some(record => record.meta.auth)) {
    if (sessionStorage.getItem('token') === null) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
