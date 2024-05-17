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
  head() {
    return {
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js',
          defer: true
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/intro.js/7.2.0/intro.js',

          defer: true

        },
        {
          src: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js",
          defer: true
        }
      ],
    };
  },
  data() {
    return {

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

    }
  }
}
</script>

<style></style>
