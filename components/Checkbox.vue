<template>
    <v-sheet class="pa-1">
        <v-switch v-model="switch1" label="" inset></v-switch>
    </v-sheet>
</template>

<script>
export default {
    data() {

        return {
            switch1: true,
        }
    },

    methods: {
        change() {
            this.switch1 = !this.switch1
        }
    }


}
</script>

<style>
/* Qué le texto del checkbox este a la  izquierda */
.v-input--selection-controls__ripple {
    left: 0;
    right: auto;
}
</style>