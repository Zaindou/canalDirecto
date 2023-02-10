<template>
    <div class="switch-container">
        <label class="switch-label">Aceptas los <a id="linkTerms" href="hola">términos y condiciones legales</a></label>
        <v-switch v-model="switch1" required inset></v-switch>
    </div>
</template>

<script>
export default {
    data() {
        return {
            switch1: false,
        };
    },
    methods: {
        change() {
            this.switch1 = !this.switch1;
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
