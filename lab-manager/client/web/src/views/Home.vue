<template>
  <div class="home">
    <v-container
      fluid
    >
      <v-row>
        <v-col cols="4">
          <clients></clients>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import Clients from '@/components/Clients.vue';

export default {
  name: 'Home',
  components: {
    Clients
  },
  computed: mapState([
    'isAuthenticated'
  ])
}
</script>
