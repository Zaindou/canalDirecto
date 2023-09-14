<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <!-- <v-col><span class="compartir-informacion">Compartenos la siguiente información, por favor:</span></v-col> -->
        <v-col class="d-flex mt-1" cols="12" sm="12">
          <v-select
            v-model="tipoIdentificacion"
            :items="tipoDeIdentificacion"
            label="Tipo de identificación"
            hide-details
            required
            outlined
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="numeroIdentificacion"
            type="number"
            :rules="ccRules"
            label="Número de identificación"
            prepend-inner-icon="mdi-card-account-details"
            hide-details
            required
            outlined
            autocomplete
          />
        </v-col>

        <v-col cols="12" md="6">
          <div>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
              @show="openDatePicker"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model.lazy="formattedDate"
                  v-mask="'##/##/####'"
                  placeholder="DD/MM/AAAA"
                  label="Fecha de expedición"
                  :rules="dateRules"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  hide-details
                  v-bind="attrs"
                  @input="formatDate"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="fechaExpedicion"
                :active-picker.sync="activePicker"
                :max="getMaxDate"
                min="1950-01-01"
                locale="es"
                @input="menu = false"
                @change="save"
              />
            </v-menu>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="primerNombre"
            :rules="nameRules"
            label="Primer nombre"
            hide-details
            prepend-inner-icon="mdi-account-box"
            required
            outlined
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="primerApellido"
            :rules="nameRules"
            label="Primer apellido"
            hide-details
            prepend-inner-icon="mdi-account-box"
            required
            outlined
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="numeroCelular"
            type="number"
            :rules="clRules"
            label="Número de celular"
            prepend-inner-icon="mdi-cellphone"
            required
            outlined
            hide-details
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="correoElectronico"
            :rules="emailRules"
            label="Correo Electrónico"
            prepend-inner-icon="mdi-email"
            outlined
            placeholder="rebancarizandome@qnt.com.co"
            hide-details
          />
        </v-col>
      </v-row>
    </v-container>
    <Alerts v-if="showAlert" :message="'Por favor completa todos los campos.'" type="error" />
  </v-form>
</template>

<script>
import Alerts from '~/components/commons/Alerts.vue'

export default {
  components: {
    Alerts
  },

  data: () => ({
    valid: false,
    tipoIdentificacion: 'CC',
    numeroIdentificacion: '',
    fechaExpedicion: '',
    primerNombre: '',
    primerApellido: '',
    numeroCelular: '',
    correoElectronico: '',
    terminosCondiciones: true,

    showAlert: false,

    activePicker: '',
    date: null,
    menu: true,

    formattedDate: '',

    tipoDeIdentificacion: [
      { text: 'Cédula de ciudadanía', value: 'CC' },
      { text: 'Cédula de extranjería', value: 'CE' }],
    nameRules: [
      v => !!v || 'Tu nombre es necesario para continuar.',
      v => v.length >= 3 || 'Por favor ingresa tu nombre completo.'
    ],
    emailRules: [
      v => !!v || 'El correo electónico es requerido.',
      v => /.+@.+/.test(v) || 'Tu correo electrónico no es válido.'
    ],
    ccRules: [
      v => !!v || 'El número de identificación es requerido.',
      v => v.length >= 6 || 'El número de identificación debe tener al menos 6 dígitos.',
      v => v.length <= 10 || 'El número de identificación debe tener máximo 10 dígitos.'
    ],
    clRules: [
      v => !!v || 'El número de celular es requerido.',
      v => v.length >= 10 || 'El número de celular debe tener al menos 10 dígitos.',
      v => v.length <= 10 || 'El número de celular debe tener máximo 10 dígitos.'
    ],

    dateRules: [
      v => !!v || 'La fecha es requerida',
      v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'El formato de la fecha debe ser DD/MM/AAAA'
    ]
  }),

  computed: {
    getMaxDate () {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
    }
  },

  watch: {
    fechaExpedicion (newVal) {
      this.formattedDate = this.formatDate(newVal)
    }
  },

  mounted () {
    this.openDatePicker()
  },

  methods: {
    updateIdentificationNumber (value) {
      this.numeroIdentificacion = value.numeroIdentificacion
    },

    formatDate (date) {
      if (!date) { return '' }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    save (date) {
      this.fechaExpedicion = date
      this.formattedDate = this.formatDate(date)
    },
    openDatePicker () {
      this.activePicker = 'YEAR'
      this.menu = false
    },

    submitForm () {
      if (this.primerNombre === '' || this.primerApellido === '' || this.numeroIdentificacion === '' || this.fechaExpedicion === '' || this.numeroCelular === '' || this.correoElectronico === '' || this.terminosCondiciones === false) {
        this.valid = false
        this.showAlert = true
      } else {
        this.valid = true
      }
      if (this.valid === true) {
        this.$emit('form-submitted',
          {
            primer_nombre: this.primerNombre,
            primer_apellido: this.primerApellido,
            numero_identificacion: this.numeroIdentificacion,
            fecha_expedicion: this.formattedDate,
            tipo_identificacion: this.tipoIdentificacion,
            numero_celular: this.numeroCelular,
            correo_electronico: this.correoElectronico,
            terminos_condiciones: this.terminosCondiciones
          })
      }
    }
  }

}
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.v-text-field,
.v-select {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.custom-text-field.v-text-field.v-text-field--enclosed .v-input__slot {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
