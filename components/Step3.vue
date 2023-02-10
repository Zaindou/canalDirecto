<template>
<v-container>
    <v-col class="d-flex" cols="13" sm="13">
        <v-text-field v-model="formattedValue" label="Ingresos mensuales" @input="formatValue" prepend-inner-icon="mdi-cash" required outlined />
    </v-col>
    <Ahorros/>
    <ObjetivoFinanciero/>
</v-container>
</template>
<script>
import Ahorros from './Ahorros.vue'
export default {
  components: { Ahorros },
    data() {
        return {
            formattedValue: ""
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