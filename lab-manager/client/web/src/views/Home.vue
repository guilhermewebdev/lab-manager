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
        <v-col cols="3" class="px-0 py-0 h-100">
          <Patients class="h-100"></Patients>
        </v-col>
        <v-col cols="6" class="px-0 py-0 h-100">
          <Jobs class="h-100"></Jobs>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import Clients from '@/components/Clients/List.vue';
import Patients from '@/components/Patients/List.vue';
import Jobs from '@/components/Jobs/List.vue';
export default {
  name: 'Home',
  components: {
    Clients,
    Patients,
    Jobs,
  },
  computed: mapState([
    'isAuthenticated'
  ])
}
</script>
