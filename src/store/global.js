import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const global = new Vuex.Store({
    state: {
        breadcrumb: [
            
        ]
    },
    mutations: {
        setBreadcrumb(state, data) {
            let arr = []
            data.map((item) => {
                let obj = item
                obj.path = item.path.split('_')[0]
                arr.push(obj)
            })
            state.breadcrumb = arr
        }
    },
    actions: {


    }
})
export default global