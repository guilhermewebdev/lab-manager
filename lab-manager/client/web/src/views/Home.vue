<template>
  <div class="home">
    <register></register>
  </div>
</template>

<script>
// @ is an alias to /src
import Register from '@/views/Register.vue'
export default {
  name: 'Home',
  components: {
    Register
  }
}
</script>
