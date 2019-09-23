import Vue from 'vue'
import Router from 'vue-router'
import Container from '@/pages/Container'
import Category from '@/pages/Category'
import Goods from '@/pages/Goods'
import PageMessage from '@/pages/PageMessage'
import frPreferential from '@/pages/frPreferential'
import registered from '@/pages/registered'
import Medicalindicators from '@/pages/Medicalindicators'
import systemParameters from '@/pages/systemParameters'
import centShop from '@/pages/centShop'
import roleManagement from '@/pages/roleManagement'
import userManagement from '@/pages/userManagement'
import Order from '@/pages/orderManagement/index.vue'
import recipesMaking from '@/pages/Recipes/recipesMaking.vue'
import recipesMakingEdit from '@/pages/Recipes/recipesMakingEdit.vue'
import configurationMeal from '@/pages/Recipes/configurationMeal.vue'
import configurationMealEdit from '@/pages/Recipes/configurationMealEdit.vue'
import Kitchen from '@/pages/Kitchen'
import consulting from '@/pages/consulting'
import chat from '@/pages/consulting/chat.vue'
import nutrients from '@/pages/Recipes/nutrients.vue'

Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path:'/registered',
      name: 'registered',
      component: registered,
    },
    {
      path: '/home',
      name: 'Container',
      component: Container,
      redirect: "/home/category",
      children:[
        {
          path:'/home/goods',
          name: 'Goods',
          component: Goods,
        },{
          path:'/home/category',
          name: 'Category',
          component: Category,
        },{
          path:'/home/pagemessage',
          name: 'PageMessage',
          component: PageMessage
        },{
          path:'/home/frPreferential',
          name: 'frPreferential',
          component: frPreferential
        },{
          path:'/home/medicalindicators',
          name: 'Medicalindicators',
          component: Medicalindicators
        },{
          path:'/home/systemParameters',
          name: 'systemParameters',
          component: systemParameters
        },{
          path:'/home/centShop',
          name: 'centShop',
          component: centShop
        },{
          path: '/home/roleManagement',
          name: 'roleManagement',
          component: roleManagement
        },{
          path: '/home/userManagement',
          name: 'userManagement',
          component: userManagement
        },{
          path: '/home/orderManagement',
          name: 'Order',
          component: Order
        },{
          path: '/home/recipesMaking',
          name: 'recipesMaking',
          component: recipesMaking
        },{
          path: '/home/recipesMakingEdit',
          name: 'recipesMakingEdit',
          component: recipesMakingEdit
        },{
          path: '/home/nutrients',
          name: 'nutrients',
          component: nutrients
        },{
          path: '/home/configurationMeal',
          name: 'configurationMeal',
          component: configurationMeal
        },{
          path: '/home/configurationMealEdit',
          name: 'configurationMealEdit',
          component: configurationMealEdit
        },{
          path: '/home/Kitchen',
          name: 'Kitchen',
          component: Kitchen
        },{
          path: '/home/consulting',
          name: 'consulting',
          component: consulting
        },{
          path: '/home/chat',
          name: 'chat',
          component: chat
        }
      ]
    }
  ]
})
