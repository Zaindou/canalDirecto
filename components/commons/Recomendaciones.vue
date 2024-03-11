<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
                <v-card class="mx-auto recommendation-card">
                    <v-card-title class="justify-space-between title-box">
                        Recomendación QNT
                        <!-- <v-icon>mdi-information-outline</v-icon> -->
                    </v-card-title>
                    <v-card-text style="line-height: normal;">
                        {{ recomendacion ? recomendacion : '¡Estamos cargando un par de recomendaciones para ti!' }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useMainStore } from '@/store/mainStore';

export default {
    name: 'Recomendaciones',
    data: () => ({
        recomendacion: '',
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.recomendacion = newValue.recomendacion || 'Cargando...';
                }
            },
        },
    },
    mounted() {
        this.mainStore.loadFromLocalStorage();
    },
};
</script>

<style scoped>
.recommendation-card {
    border-radius: 5px;
    /* Bordes redondeados como en la imagen */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Sombra ligera para la tarjeta */
}

.v-card-title {
    background-color: #F5F5F5;
    /* Fondo gris claro para el título */
    padding: 16px;
    /* Espaciado interno para el título */
    font-weight: bold;
    /* Negrita para el texto del título */
}

.v-card-text {
    padding: 16px;
    /* Espaciado interno para el contenido de la tarjeta */
}

.title-box {
    color: #0b2f44;
}
</style>
