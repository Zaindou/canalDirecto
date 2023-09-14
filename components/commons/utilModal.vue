<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ content }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="close">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
