<template>
  <v-form v-model="valid">
    <v-container>
      <div class="ma-auto position-relative" style="max-width: 500px">
        <v-container class="info-container2">
          <div class="p ma-auto position-relative">
            <p>
              Ya casi terminas, por favor diligencia <br>la siguiente información para generar <br>tu
              diagnóstico.
            </p>
          </div>
        </v-container>
      </div>
      <v-col class="d-flex" cols="13" sm="13">
        <v-text-field
          v-model="formattedIncome"
          label="Ingresos mensuales"
          prepend-inner-icon="mdi-cash"
          required
          outlined
          @input="formatIncome"
        />
      </v-col>

      <v-col class="d-flex" cols="13" sm="13">
        <v-text-field
          v-model="formattedExpenses"
          label="Gastos mensuales"
          prepend-inner-icon="mdi-cash"
          required
          outlined
          @input="formatExpenses"
        />
      </v-col>
      <!-- Ahorros -->

      <v-row>
        <v-col class="d-flex" cols="12" sm="12">
          <v-select
            v-model="ahorros"
            :items="ahorrosOpciones.map(option => option.text)"
            label="¿Tienes ahorros?"
            hide-details
            outlined
            required
          />
        </v-col>
        <v-col v-if="ahorros === 'SI'" class="d-flex" cols="12" sm="12">
          <v-text-field
            v-model="formattedSavings"
            label="Valor de tus ahorros"
            prepend-inner-icon="mdi-piggy-bank-outline"
            hide-details
            outlined
            required
            @input="formatSavings"
            @blur="formatSavings"
          />
        </v-col>
      </v-row>

      <v-container class="info-container">
        <div class="p position-relative">
          <p>
            Para terminar, por favor, indícanos <br>tu <b>objetivo.</b> <br>Una vez no tengas reportes
            negativos <br>en centrales de riesgo. <br>¿Cuál seria tu <b>meta financiera</b>?
          </p>
        </div>
      </v-container>

      <!-- Obetivo financiero -->
      <v-select
        v-model="selectedOption"
        :items="options"
        label="Objetivo Financiero"
        prepend-inner-icon="mdi-coffee-outline"
        outlined
      />
    </v-container>
  </v-form>
</template>

<script>

export default {
  components: {
  },

  props: {
    numeroIdentificacion: {
      type: String,
      default: ''
    }
  },

  data () {
    return {

      valid: false,

      formattedIncome: '',
      formattedSavings: '',
      formattedExpenses: '',
      selectedOption: null,
      defaultFormattedSaving: 0,

      options: [
        'Solicitar tarjeta de crédito',
        'Solicitar crédito de libre inversión',
        'Solicitar crédito de educación',
        'Solicitar crédito de vivienda',
        'Solicitar crédito de vehículo',
        'Quiero salir de mis deudas'
      ],

      ahorros: 'SI',
      ahorrosOpciones: [
        { text: 'SI', value: true },
        { text: 'NO', value: false }]
    }
  },

  methods: {
    formatIncome () {
      let value = this.formattedIncome.replace(/\D/g, '')
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      this.formattedIncome = value
    },
    formatExpenses () {
      let value = this.formattedExpenses.replace(/\D/g, '')
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      this.formattedExpenses = value
    },
    formatSavings () {
      let value = this.formattedSavings.replace(/\D/g, '')
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      this.formattedSavings = value
    },

    submitForm3 () {
      // const ahorrosOption = this.ahorrosOpciones.find(option => option.text === this.ahorros);

      const tieneAhorros = this.ahorros === 'NO' ? 'false' : 'true'

      const ahorrosValue = this.ahorros === 'NO' ? '0' : this.formattedSavings

      this.$emit('submit', {
        numero_identificacion: this.numeroIdentificacion,
        ingresos_mensuales: this.formattedIncome,
        gastos_mensuales: this.formattedExpenses,
        tienes_ahorros: tieneAhorros,
        objetivo_financiero: this.selectedOption,
        valor_ahorros: ahorrosValue
      })
    }

  }
}
</script>

<style>
.p {
  color: #747171;
  font-size: 17px;
  font-weight: 400;
  text-align: center;

}

.p1 {
  font-size: 1.8rem;
  font-weight: 500;
  color: #7e7e7e;
  margin-top: 0px;
  margin-bottom: 10px !important;
}

.info-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.info-container2 {
  color: blue;
}
</style>
