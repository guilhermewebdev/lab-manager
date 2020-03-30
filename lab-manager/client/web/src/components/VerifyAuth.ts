import Vue from 'vue';
import gql from 'graphql-tag'

export default Vue.extend({
    apollo: {
        $client: 'b',
        isAuthenticated: gql`
            query {
                isAuthenticated
            }
        `
    },
    methods: {
        refreshToken(){
            if(this.isAuthenticated){
                this.$apollo.mutate({
                    mutation: gql`
                        mutation Verify($token:String!){
                            verifyToken(token:$token){
                                payload
                            }
                        }
                    `,
                    variables: {
                        token: sessionStorage.getItem('FAS_CRI') || localStorage.getItem('FAS_CRI')
                    }
                })
                    .then(response => {
                        if(sessionStorage.getItem('FAS_CRI')){
                            sessionStorage.setItem('FAS_CRI', response.data.tokenAuth.token)
                        }else{
                            localStorage.setItem('FAS_CRI', response.data.tokenAuth.token)
                        }
                    })
            }else{
                this.$apollo.mutate({
                    mutation: gql`
                        mutation Refresh($token:String!){
                            refreshToken(token:$token){
                                payload
                                token
                            }
                        }
                    `,
                    variables: {
                        token: sessionStorage.getItem('FAS_CRI') || localStorage.getItem('FAS_CRI')
                    }
                })
                    .then(response => {
                        if(sessionStorage.getItem('FAS_CRI')){
                            sessionStorage.setItem('FAS_CRI', response.data.tokenAuth.token)
                        }else{
                            localStorage.setItem('FAS_CRI', response.data.tokenAuth.token)
                        }
                    })
            }
        },
        delta(){
            setTimeout(() => {
                this.refreshToken()
                requestAnimationFrame(this.delta)
            }, 4.5*60*1000)
        }
    },
    mounted(){
        if(this.isAuthenticated) this.delta()
        else{
            this.refreshToken()
            this.delta()
        }
    },
    watch: {
        isAuthenticated(newValue){
            this.$store.commit('setAuth', newValue)
        }
    }
})