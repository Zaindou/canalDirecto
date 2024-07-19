<template>
    <v-stepper v-model="e1" class="">
        <Loader v-if="loading4" />
        <div class="image-container">
            <v-img v-if="e1 != 4" src="../QNT-MOBILE.webp" max-width="1000" class="mobile-image" alt="QNT" />
            <v-img v-if="e1 != 4" src="../QNT_STEP1.jpg" max-width="1000" class="desktop-image" alt="QNT" />
            <v-img v-if="e1 == 4" src="../QNT_STEP4.jpg" max-width="1000" class="desktop-image" alt="QNT" />
        </div>
        <v-divider />
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1" aria-hidden="true">
                <v-icon large :color="iconColor(1)">
                    mdi-face-recognition
                </v-icon>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="e1 > 2" step="2">
                <v-icon large :color="iconColor(2)">
                    mdi-shield-lock-outline
                </v-icon>
            </v-stepper-step>

            <v-divider />
            <v-stepper-step :complete="e1 === 4" step="4">
                <v-icon large :color="iconColor(4)">
                    mdi-tooltip-check-outline
                </v-icon>
            </v-stepper-step>
        </v-stepper-header>
        <div class="pa-4">
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
                <v-text-field type="text" v-model="formattedIncome" label="Ingresos mensuales"
                    prepend-inner-icon="mdi-cash" required outlined @input="formatIncome" />
            </v-col>

            <v-col class="d-flex" cols="13" sm="13">
                <v-text-field type="text" v-model="formattedExpenses" label="Gastos mensuales"
                    prepend-inner-icon="mdi-cash" required outlined @input="formatExpenses" />
            </v-col>
            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                class="buttonsteps" @click="submitForm3">
                Solicitar diagnóstico
            </v-btn>
        </div>
    </v-stepper>
</template>

<script>
import axios from 'axios'
import Loader from '~/components/commons/LoaderForm.vue'

import { useMainStore } from '@/store/mainStore';

export default {
    middleware: 'otpandpay',
    components: {
        Loader
    },
    data() {
        return {

            valid: false,
            e1: 4,
            numeroIdentificacion: '',
            formattedIncome: '',
            formattedSavings: '',
            formattedExpenses: '',
            selectedOption: null,
            defaultFormattedSaving: 0,
            loading4: false,

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
        formatIncome() {
            let value = this.formattedIncome.replace(/\./g, ''); // Eliminar puntos
            value = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            if (!isNaN(value)) { // Validar que sea un número
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Formatear con puntos
                this.formattedIncome = value;
            }
        },
        formatExpenses() {
            let value = this.formattedExpenses.replace(/\./g, ''); // Eliminar puntos
            value = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            if (!isNaN(value)) { // Validar que sea un número
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Formatear con puntos
                this.formattedExpenses = value;
            }
        },
        formatSavings() {
            let value = this.formattedSavings.replace(/\D/g, '')
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            this.formattedSavings = value
        },
        async fetchData() {
            let token, cedula
            if (process.client) {
                token = localStorage.getItem('auth_token')
                cedula = localStorage.getItem('numero_identificacion')
            }

            const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })

            this.clientData = response.data.informacionCliente
            this.productos = response.data.wazeQnt.all_products
            this.productosAcuerdo = response.data.wazeQnt.products_with_agreement
            this.productosOferta = response.data.wazeQnt.products_with_offer
            this.otrosProductos = response.data.wazeQnt.other_products

            const mainStore = useMainStore();
            mainStore.setClientData(this.clientData);
            mainStore.setProductos(this.productos);

        },
        async handleSubmit3(formData) {
            const token = localStorage.getItem('auth_token')

            const config = {
                headers: {
                    Authorization: `Token ${token}`
                }
            }

            this.loading4 = true

            await axios.post('diagnostico/register/financial', formData, config).then(async (response) => {
                if (response.status >= 200 && response.status < 301) {
                    this.$notifier.showMessage({ content: '¡Hemos cargado tus datos financieros correctamente ;)!', color: 'success' })
                    await this.fetchData()
                    this.$router.push('/inicio')
                }
                this.loading4 = false
            }
            ).catch((error) => {
                if (error.response.status >= 400 && error.response.status < 500) {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' })
                    this.loading4 = false
                }
            })
        },

        submitForm3() {
            // const tieneAhorros = this.ahorros === 'NO' ? 'false' : 'true'
            // const ahorrosValue = this.ahorros === 'NO' ? '0' : this.formattedSavings

            const objetivo_financiero = localStorage.getItem('objetivo_financiero')


            // this.$emit('submit', {
            //     numero_identificacion: this.numeroIdentificacion,
            //     ingresos_mensuales: this.formattedIncome,
            //     gastos_mensuales: this.formattedExpenses,
            //     // tienes_ahorros: tieneAhorros,
            //     objetivo_financiero: objetivo_financiero,
            //     // valor_ahorros: ahorrosValue
            // })

            this.numeroIdentificacion = localStorage.getItem('numero_identificacion')
            this.handleSubmit3({
                numero_identificacion: this.numeroIdentificacion,
                ingresos_mensuales: this.formattedIncome,
                gastos_mensuales: this.formattedExpenses,
                // tienes_ahorros: tieneAhorros,
                objetivo_financiero: objetivo_financiero,
                // valor_ahorros: ahorrosValue
            })
        },
        iconColor(step) {
            let color
            if (this.e1 === step) {
                color = '#00263C'
            } else if (this.e1 > step) {
                color = '#87BD29'
            } else if (this.e1 === 4) {
                color = '#87BD29'
            } else {
                color = ''
            }
            return color
        },

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

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
