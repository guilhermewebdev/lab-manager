<template>
  <div class="home">
    <v-container
      fluid
      px-0
      py-0
      class="h-100"
    >
      <v-row px-0 py-0 class="h-100">
        <v-col cols="3" class="pr-0 py-0 h-100">
          <Clients class="h-100"></Clients>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import Clients from '@/components/Clients/List.vue';

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
