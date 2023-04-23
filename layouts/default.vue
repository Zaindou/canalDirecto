<template>
  <v-app>
    <!-- <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar> -->

    <v-main>
      <v-container>
        <Snackbar></Snackbar>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- <footer><Footer /></footer> -->

  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'

export default {
  components: { Snackbar },
  name: 'DefaultLayout',
  data() {
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
      title: 'QNT'
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 959px) {
  /* Estilos para dispositivos móviles (xs y sm) */

  .v-container {
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  /* center img */

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
  }

}

@media screen and (min-width: 960px) {
  /* Estilos para computadoras de escritorio (md, lg y xl) */

  .v-container {
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  /* center img */

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
  }




}
</style>
