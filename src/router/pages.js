export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/node',
    name: 'node',
    meta: { auth: true },
    component: () => import('@/views/node.vue'),
  },
  {
    path: '/node/:n_id/sensor/:s_id',
    name: 'detail',
    meta: { auth: true },
    component: () => import('@/views/detail.vue'),
  },
  {
    path: '/node/:n_id/sensor/:s_id/setting',
    name: 'setting',
    meta: { auth: true },
    component: () => import('@/views/setting.vue'),
  },
]
