<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col class="d-flex" cols="12" sm="12">
                    <v-select :items="tipoDeIdentificacion" v-model="identificacionSelect" label="Tipo de identificación"
                        hide-details required outlined></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="numeroDeCedula" :rules="ccRules" label="Número de identificación"
                        prepend-inner-icon="mdi-card-account-details" hide-details required outlined
                        autocomplete></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-mask="'##/##/####'" placeholder="DD/MM/AAAA" v-model.lazy="fechaExpedicion"
                        label="Fecha de expedición" @input="formatDate" :rules="dateRules" prepend-inner-icon="mdi-calendar"
                        outlined hide-details></v-text-field>
                    <!-- <Datepicker /> -->
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="primerNombre" :rules="nameRules" label="Primer nombre" hide-details
                        prepend-inner-icon="mdi-account-box" required outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="primerApellido" :rules="nameRules" label="Primer apellido" hide-details
                        prepend-inner-icon="mdi-account-box" required outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="numeroDeCelular" :rules="clRules" label="Número de celular"
                        prepend-inner-icon="mdi-cellphone" required outlined hide-details></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="email" :rules="emailRules" label="Correo Electrónico"
                        prepend-inner-icon="mdi-email" outlined placeholder="rebancarizandome@qnt.com.co"
                        hide-details></v-text-field>
                </v-col>
            </v-row>
        </v-container>
        <Alerts v-if="showAlert" :message="'Por favor completa todos los campos.'" type="error" />

</v-form>
</template>

<script>
import Checkbox from './Checkbox.vue';
import Alerts from '~/components/commons/Alerts.vue';



export default {
    components: {
        Checkbox, Alerts
    },

    data: () => ({
        valid: false,
        identificacionSelect: 'CC',
        numeroDeCedula: '',
        fechaExpedicion: '',
        primerNombre: '',
        primerApellido: '',
        numeroDeCelular: '',
        email: '',
        terminosCondiciones: true,

        showAlert: false,

        tipoDeIdentificacion: [
            { text: 'Cédula de ciudadanía', value: 'CC' },
            { text: 'Cédula de extranjería', value: 'CE' },],
        nameRules: [
            v => !!v || 'Tu nombre es necesario para continuar.',
            v => v.length >= 3 || 'Por favor ingresa tu nombre completo.',
        ],
        emailRules: [
            v => !!v || 'El correo electónico es requerido.',
            v => /.+@.+/.test(v) || 'Tu correo electrónico no es válido.',
        ],
        ccRules: [
            v => !!v || 'El número de identificación es requerido.',
            v => v.length >= 6 || 'El número de identificación debe tener al menos 6 dígitos.',
            v => v.length <= 10 || 'El número de identificación debe tener máximo 10 dígitos.',
        ],
        clRules: [
            v => !!v || 'El número de celular es requerido.',
            v => v.length >= 10 || 'El número de celular debe tener al menos 10 dígitos.',
            v => v.length <= 10 || 'El número de celular debe tener máximo 10 dígitos.',
        ],
    }),
    methods: {
        submitForm() {
            if (this.primerNombre == '' || this.primerApellido == '' || this.numeroDeCedula == '' || this.fechaExpedicion == '' || this.numeroDeCelular == '' || this.email == '' || this.terminosCondiciones === false) {
                this.valid = false;
                this.showAlert = true;
            } else {
                this.valid = true;
            }
            if (this.valid === true) {
                this.$emit('form-submitted',
                    {
                        primerNombre: this.primerNombre,
                        primerApellido: this.primerApellido,
                        numeroDeCedula: this.numeroDeCedula,
                        fechaExpedicion: this.fechaExpedicion,
                        identificacionSelect: this.identificacionSelect,
                        numeroDeCelular: this.numeroDeCelular,
                        email: this.email,
                        terminosCondiciones: this.terminosCondiciones,
                    });
            }
        },
        formatDate() {
            const inputDate = this.fechaExpedicion
            const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

            if (regex.test(inputDate)) {
                const [_, day, month, year] = inputDate.match(regex)
                this.fechaExpedicion = `${day}/${month}/${year}`
            }
        }
    },
    computed: {
        dateRules() {
            return [
                (v) =>
                    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(v) ||
                    'Debe ingresar una fecha en formato dd/mm/aaaa',
                v => !!v || 'La fecha es requerida.',
                v => v.length >= 10 || 'La fecha debe tener el formato dd/mm/aaaa.',
                v => v.length <= 10 || 'La fecha debe tener el formato dd/mm/aaaa.',
            ]
        }
    }
}
</script>

<style>
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