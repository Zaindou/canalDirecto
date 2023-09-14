<template>
    <div class="switch-container">
        <label class="switch-label">Aceptas los <a id="linkTerms" href="hola">términos y condiciones legales</a></label>
        <v-switch v-model="terminosCondiciones" required inset></v-switch>
    </div>
</template>

<script>
export default {
    data() {
        return {
            terminosCondiciones: false,
        };
    },
    methods: {
        change() {
            this.terminosCondiciones = !this.terminosCondiciones;
        },
    },
};
</script>


<style>
.switch-container {
    display: flex;
    align-items: center;
}

.switch-label {
    margin-right: 1em;
    text-align: center;
}


#linkTerms {
    /* color: #3f51b5; */
    text-decoration: none;
}


</style>
