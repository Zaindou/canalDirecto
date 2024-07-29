<template>
  <v-form v-model="valid" style="margin-bottom: 0px !important;">
    <v-container>
      <v-row>
        <v-col class="d-flex mt-1" cols="12" sm="12">
          <v-select v-model="tipoIdentificacion" :items="tipoDeIdentificacion" label="Tipo de identificación"
            hide-details="auto" required outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="numeroIdentificacion" type="number" :rules="ccRules" label="Número de identificación"
            prepend-inner-icon="mdi-card-account-details" hide-details="auto" required outlined autocomplete />
        </v-col>

        <v-col cols="12" md="6">
          <div>
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
              min-width="auto" @show="openDatePicker">
              <template #activator="{ on, attrs }">
                <v-text-field v-model.lazy="formattedDate" v-mask="'##/##/####'" placeholder="DD/MM/AAAA"
                  label="Fecha de expedición" :rules="dateRules" prepend-inner-icon="mdi-calendar" readonly outlined
                  hide-details="auto" v-bind="attrs" @input="formatDate" v-on="on" />
              </template>
              <v-date-picker v-model="fechaExpedicion" :active-picker.sync="activePicker" :max="getMaxDate"
                min="1950-01-01" locale="es" @input="menu = false" @change="save" />
            </v-menu>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="primerNombre" :rules="nameRules" label="Primer nombre" hide-details="auto"
            prepend-inner-icon="mdi-account-box" required outlined />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="primerApellido" :rules="nameRules" label="Primer apellido" hide-details="auto"
            prepend-inner-icon="mdi-account-box" required outlined />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="numeroCelular" type="number" :rules="clRules" label="Número de celular"
            prepend-inner-icon="mdi-cellphone" required outlined hide-details="auto" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="correoElectronico" :rules="emailRules" label="Correo Electrónico"
            prepend-inner-icon="mdi-email" outlined placeholder="rebancarizandome@qnt.com.co" hide-details="auto" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" :rules="passwordRules"
            label="Contraseña" prepend-inner-icon="mdi-lock" append-icon="mdi-eye"
            @click:append="showPassword = !showPassword" hide-details="auto" required outlined />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
            :rules="confirmPasswordRules" label="Confirmar Contraseña" prepend-inner-icon="mdi-lock-check"
            append-icon="mdi-eye" @click:append="showConfirmPassword = !showConfirmPassword" hide-details="auto"
            required outlined />
        </v-col>

        <v-container class="info-container" style="margin-bottom: 0px !important;">
          <div class="p position-relative">
            Cuéntanos el objetivo financiero que quieres alcanzar
          </div>
        </v-container>

        <v-col cols="12" md="12" style="margin: 0px !important;">
          <v-select v-model="selectedOption" :items="options" label="Objetivo Financiero"
            style="margin-bottom: 0px !important;" prepend-inner-icon="mdi-coffee-outline" density="comfortable"
            :rules="[selectRule]" hide-details="auto" outlined />
        </v-col>
      </v-row>
    </v-container>
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
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    terminosCondiciones: true,

    showAlert: false,

    activePicker: '',
    date: null,
    menu: true,

    formattedDate: '',

    options: [
      'Solicitar tarjeta de crédito',
      'Solicitar crédito de libre inversión',
      'Solicitar crédito de educación',
      'Solicitar crédito de vivienda',
      'Solicitar crédito de vehículo',
      'Quiero salir de mis deudas'
    ],

    selectedOption: null,

    tipoDeIdentificacion: [
      { text: 'Cédula de ciudadanía', value: 'CC' },
      // { text: 'Cédula de extranjería', value: 'CE' }
    ],
    nameRules: [
      v => !!v || 'Tu nombre es necesario para continuar.',
      v => v.length >= 3 || 'Por favor ingresa tu primer nombre completo.'
    ],
    emailRules: [
      v => !!v || 'Tu correo electónico es necesario para continuar.',
      v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(v) || 'Tu correo electrónico no es válido.'
    ],
    ccRules: [
      v => !!v || 'El número de identificación es requerido.',
      v => v.length >= 6 || 'El número de identificación debe tener al menos 6 dígitos.',
      v => v.length <= 10 || 'El número de identificación debe tener máximo 10 dígitos.'
    ],
    clRules: [
      v => !!v || 'Tú número celular es necesario para continuar.',
      v => v.length >= 10 || 'El número de celular debe tener al menos 10 dígitos.',
      v => v.length <= 10 || 'El número de celular debe tener máximo 10 dígitos.',
      v => v.startsWith('3') || 'El número de celular debe iniciar con 3.'
    ],

    dateRules: [
      v => !!v || 'Tu fecha de expedición es necesaria para continuar.',
      v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'El formato de la fecha debe ser DD/MM/AAAA'
    ],
    selectRule: [
      v => !!v || 'El objetivo financiero es requerido',
    ],

    passwordRules: [
      v => !!v || 'La contraseña es requerida.',
      v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres.',
      v => /[A-Z]/.test(v) || 'La contraseña debe tener al menos una letra mayúscula.',
      v => /[!@#\$%\^\&*\)\(+=._-]+/.test(v) || 'La contraseña debe tener al menos un carácter especial.'
    ]
  }),

  computed: {
    confirmPasswordRules() {
      return [
        v => !!v || 'La confirmación de la contraseña es requerida.',
        v => v === this.password || 'Las contraseñas no coinciden.'
      ];
    },
    getMaxDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
    }
  },
  watch: {
    fechaExpedicion(newVal) {
      this.formattedDate = this.formatDate(newVal)
    }
  },

  mounted() {
    this.openDatePicker()
  },

  methods: {
    updateIdentificationNumber(value) {
      this.numeroIdentificacion = value.numeroIdentificacion
    },

    formatDate(date) {
      if (!date) { return '' }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    save(date) {
      this.fechaExpedicion = date
      this.formattedDate = this.formatDate(date)
    },
    openDatePicker() {
      this.activePicker = 'YEAR'
      this.menu = false
    },

    submitForm() {
      if (this.primerNombre === '' || this.primerApellido === '' || this.numeroIdentificacion === '' || this.fechaExpedicion === '' || this.numeroCelular === '' || this.correoElectronico === '' || this.password === '' || this.confirmPassword === '' || this.terminosCondiciones === false || this.selectedOption === null) {
        this.valid = false
        this.showAlert = true
        this.$notifier.showMessage({ content: "Por favor verifica tus datos diligenciados.", color: 'error' })
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
            password: this.password,
            password_confirm: this.confirmPassword,
            objetivo_financiero: this.selectedOption,
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

.v-application p {
  margin: 5 !important;
}
</style>
