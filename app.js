const app = Vue.createApp({
    data(){
        return {
            members:[...data.results[0].members]
        }
    },
    methods:{
    }
})

app.mount("#app")