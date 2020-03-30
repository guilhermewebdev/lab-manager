<template>
  <div class="home">
    <register v-if="!isAuthenticated"></register>
  </div>
</template>

<script>
// @ is an alias to /src
import Register from '@/views/Register.vue'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    Register
  },
  computed: mapState([
    'isAuthenticated'
  ])
}
</script>
