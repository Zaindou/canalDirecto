<template>
    <v-select v-model="selectedOption" :items="options" label="Objetivo Financiero" prepend-inner-icon="mdi-airplane" outlined></v-select>
</template>

<script>
export default {
    data() {
        return {
            selectedOption: null,
            options: [
                'Solicitar tarjeta de crédito',
                'Solicitar crédito de libre inversión',
                'Solicitar crédito educativo',
                'Solicitar crédito de vivienda',
                'Solicitar crédito de vehículo'
            ]
        }
    }
}
</script>