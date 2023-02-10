<template>
    <v-row>
        <v-col class="d-flex" cols="12" sm="12">
            <v-select v-model="ahorros" :items="ahorrosOpciones" label="¿Tienes ahorros?" hide-details outlined
                required></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="12" v-if="ahorros === 'SI'">
            <v-text-field v-model="formattedValue" label="Valor de tus ahorros" @input="formatValue" @blur="formatValue"
                prepend-inner-icon="mdi-piggy-bank-outline" outlined required />
        </v-col>

        <v-container>
            <p class="p">Para terminar, por favor, indícanos tu <b>objetivo.</b> <br>Una vez no tengas reportes
                negativos en centrales de riesgo. </p>
            <p class="p">¿Cuál seria tu <b>meta financiera</b>?</p>

        </v-container>


    </v-row>
</template>
<script>
export default {
    data() {
        return {
            ahorros: "",
            formattedValue: "",
            ahorrosOpciones: ["SI", "NO"]
        }
    },
    methods: {
        formatValue() {
            let value = this.formattedValue.replace(/\D/g, '')
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            this.formattedValue = value
        }
    }
}
</script>

<style>
.p {
    font-size: 16px;
    font-weight: semibold;
    color: #8d8a8a;
    /* padding-bottom: 20px; */
    text-align: center;
}

</style>