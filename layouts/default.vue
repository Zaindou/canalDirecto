<template>
  <v-app>
    <v-main>
      <Snackbar />
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'

export default {
  name: 'DefaultLayout',
  components: { Snackbar },
  data () {
    return {
      clipped: false,
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Diagnostico Stepper TEST'
    }
  }
}
</script>

<style></style>
