<template>
    <v-form v-model="valid">
        <v-container>
            <v-row>
                <v-col class="d-flex" cols="12" sm="12">
                    <v-select :items="tipoDeIdentificacion" v-model="identificacionSelect"
                        label="Tipo de identificación" required outlined></v-select>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="numeroDeCedula" :rules="ccRules"
                        label="Número de identificación" required outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <Datepicker/>
                </v-col>

                <v-col cols="12" md="12">
                    <v-text-field v-model="firstname" :rules="nameRules" label="Nombre completo" required
                        outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field type="number" v-model="numeroDeCeluar" :rules="clRules"
                        label="Número de celular" required outlined></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="email" :rules="emailRules" label="Correo Elctrónico" required
                        outlined></v-text-field>
                </v-col>
                <v-col>
                    <Checkbox/>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
export default {
    data: () => ({
        valid: false,
        firstname: '',
        lastname: '',
        numeroDeCedula: '',
        identificacionSelect: 'CC',
        numeroDeCeluar: '',


        tipoDeIdentificacion: [
            { text: 'Cédula de ciudadanía', value: 'CC' },
            { text: 'Cédula de extranjería', value: 'CE' },],
        nameRules: [
            v => !!v || 'Tu nombre es necesario para continuar.',
            v => v.length >= 10 || 'Por favor ingresa tu nombre completo.',
        ],
        email: '',
        emailRules: [
            v => !!v || 'El correo electónico es requerido.',
            v => /.+@.+/.test(v) || 'Tu correo electrónico no es válido.',
        ],
        ccRules: [
            v => !!v || 'El número de identificación es requerido.',
            v => v.length >= 6 || 'El número de identificación debe tener al menos 6 dígitos.',
            v => v.length <= 10 || 'El número de identificación debe tener máximo 10 dígitos.',
        ],
        clRules : [
            v => !!v || 'El número de celular es requerido.',
            v => v.length >= 10 || 'El número de celular debe tener al menos 10 dígitos.',
            v => v.length <= 10 || 'El número de celular debe tener máximo 10 dígitos.',
        ],
    }),
}
</script>
<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>