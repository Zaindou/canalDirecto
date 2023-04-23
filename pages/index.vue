<template >
    <v-container>
        <img class="mx-auto">
        <Stepper />
    </v-container>
</template>

<style>
@media screen and (max-width: 959px) {

    /* Estilos para dispositivos móviles (xs y sm) */
    .container {
        padding: 0 !important;
    }

    /* center img */
    img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 0px;
    }
}

/* center img */
img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
}

.v-main__wrap {
    background-color: whitesmoke !important;
}
</style>