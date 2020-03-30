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
    watch: {
        isAuthenticated(newValue, oldValue){
            this.$store.commit('setAuth', newValue)
        }
    }
})