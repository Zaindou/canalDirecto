<template>
  <v-snackbar v-model="show" prepend-inner-icon="mdi-account-box" :color="color">
    {{ message }}
    <!-- <v-btn text @click="show = false">
            <v-icon>mdi-close</v-icon>
        </v-btn> -->
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
    }
  },

  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  }
}
</script>
<style>
</style>
