<template><!-- contenedor que tenga dos secciones en una ira una imagen y otra el stepper -->
    <v-container>
        <img class="mx-auto">
        <Stepper />
    </v-container>
</template>

<style>
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
    margin-bottom: 40px;
}
</style>