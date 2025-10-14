import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '@/views/Welcome.vue'
import Home from '@/views/Home.vue'
import Articles from '@/views/Articles.vue'
import About from '@/views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
      meta: { requiresVisitor: true }
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/articles',
      name: 'articles',
      component: Articles
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

// 访客记录中间件
router.beforeEach((to, from, next) => {
  if (to.meta.requiresVisitor) {
    const visitorName = localStorage.getItem('visitorName')
    if (!visitorName) {
      next()
    } else {
      next('/home')
    }
  } else {
    const visitorName = localStorage.getItem('visitorName')
    if (!visitorName && to.path !== '/') {
      next('/')
    } else {
      next()
    }
  }
})

export default router