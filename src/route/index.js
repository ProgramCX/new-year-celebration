import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path:"/celebration/:id",
        name:"Celebration",
        component:()=>import('../View/CelebrationView.vue')
    },{
        path:'/home',
        name:'Home',
        component:()=>import('../View/Home.vue')
    },{
        path:'/firework',
        name:'Firework',
        component:()=>import('../components/FireWork.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
