<template>
    <v-stepper v-model="e1" class="">
        <Loader v-if="loading4" />
        <div class="image-container">
            <v-img v-if="e1 != 4" src="../QNT-MOBILE.webp" class="mobile-image" alt="QNT" />
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
                <p class="p1 mt-5">
                    Te hemos enviado un <b class="b-green">código de verificación.</b>
                    <br>Introduce el código que hemos enviado al número: <b>{{ numero_celular }}</b>
                </p>
                <v-text-field type="number" class="mt-6" label="" placeholder="Introducir código" :rules="[numberRules]"
                    outlined @input="onInput($event)">
                </v-text-field>
            </div>
            <v-container class="resendotp">
                <v-row class="align-center">
                    <v-col cols="auto" class="text-center col-step-otp">
                        <v-icon class="p-icon" size="30">
                            mdi-history
                        </v-icon>
                    </v-col>
                    <v-col>
                        <p v-if="showResendBtn" class="p2">
                            ¿No llegó el código temporal? Para reenviarlo por favor haz
                            <span>
                                <button class="btn" @click="resendOTP">
                                    <b>¡clic aquí!</b>
                                </button>
                            </span>
                        </p>
                        <p v-else class="p2">
                            Podrás reenviar tu código nuevamente en:
                            <b>{{ remainingTime }}</b> segundos.
                        </p>
                    </v-col>
                </v-row>

            </v-container>
            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                class="buttonsteps" @click="verifyOtp">
                Confirmar código
            </v-btn>
        </div>
    </v-stepper>
</template>

<script>
import axios from 'axios'
import Loader from '~/components/commons/LoaderForm.vue'
import { useMainStore } from '@/store/mainStore';
import { set } from 'vue';

export default {
    middleware: 'otpandpay',
    components: {
        Loader
    },
    data() {
        return {
            otp: '',
            showResendBtn: false,
            remainingTime: 180,
            timer: null,
            e1: 2,
            numero_celular: null,
            loading4: true,
            numberRules: [
                (v) => !!v || 'El código es requerido',
                (v) => (v && v.length === 5) || 'El código debe tener 5 dígitos'
            ]
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.remainingTime--
            if (this.remainingTime === 0) {
                clearInterval(this.timer)
                this.showResendBtn = true
            }
        }, 1000)
        if (localStorage.getItem('phone') != null) {
            setTimeout(() => {
                this.loading4 = false
            }, 5000)
        }
        this.numero_celular = localStorage.getItem('phone')

    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        onInput(value) {
            this.otp = value;
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
                if (error.response.data.detail === "Error en el servidor [<class 'decimal.DivisionByZero'>], por favor comuniquese con el administrador") {
                    this.$notifier.showMessage({ content: "Un paso más, ya casi completamos tu diagnóstico!", color: 'success' })
                    this.$router.push('/ingresos-gastos')
                    this.loading4 = false
                }
                else if (error.response.status >= 400 && error.response.status === 500) {
                    console.log(error.response.data.detail, "error")
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' })
                    this.loading4 = false
                    this.$router.push('/ingresos-gastos')
                } else {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' })
                    this.loading4 = false
                }
            })
        },
        async verifyOtp() {
            const data = {
                phone_number: localStorage.getItem('phone'),
                numero_identificacion: localStorage.getItem('numero_identificacion'),
                primer_apellido: localStorage.getItem('lastName'),
                objetivo_financiero: localStorage.getItem('objetivo_financiero'),
                otp: this.otp
            }

            this.loading4 = true;
            try {
                const response = await axios.post('diagnostico/otp/verify', data);
                this.loading4 = false;

                if (response.status === 200) {
                    this.$notifier.showMessage({ content: '¡Tu código de verificación es correcto!', color: 'success' });

                    if (response.data.STATUS_CODE === 'REDIRECT_TO_DIAGNOSTIC') {
                        const formData = {
                            numero_identificacion: localStorage.getItem('numero_identificacion'),
                        };
                        this.handleSubmit3(formData);
                    } else if (response.data.STATUS_CODE === 'PAY_DIAGNOSTIC') {
                        this.$router.push({ name: 'pay' });
                    } else {
                        this.e1 = 3;
                    }
                }
            } catch (error) {
                this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' });
                this.loading4 = false;
            }
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
            // console.log(mainStore.clientData, "*¨***CLIENTEDATA")
            // mainStore.setProductosAcuerdo(this.productosAcuerdo);
            // mainStore.setProductosOferta(this.productosOferta);
            // mainStore.setOtrosProductos(this.otrosProductos);

        },
        resendOTP() {
            const token = localStorage.getItem('auth_token')

            const config = {
                headers: {
                    Authorization: `Token ${token}`
                }
            }

            const data = {
                numero_identificacion: localStorage.getItem('numero_identificacion'),
                numero_celular: localStorage.getItem('phone'),
                // correo_electronico: localStorage.getItem('email'),
                primer_nombre: localStorage.getItem('firstName')
            }

            axios.post('diagnostico/otp/resend', data, config)
                .then((response) => {
                    this.$notifier.showMessage({ content: `${response.data.message}`, color: 'success' })
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        // Redirige al paso 1 en caso de recibir el error HTTP 409
                        this.$router.push({ name: 'Step1' })
                    } else {
                        this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' })
                    }
                })

            this.showResendBtn = false
            this.remainingTime = 10
            clearInterval(this.timer)
            this.timer = setInterval(() => {
                this.remainingTime--
                if (this.remainingTime === 0) {
                    clearInterval(this.timer)
                    this.showResendBtn = true
                }
            }, 1000)
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
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.v-otp-input {
    margin: 0 auto;
    width: 100%;
    max-width: 500px;
}

.p1 {
    color: #3b3b3b;
    font-size: 0.9rem !important;
    font-weight: 400;
    text-align: center;
}

.p2 {
    align-items: center;
    color: #115b7a;
    font-size: 1rem;
    font-weight: 400;
    padding: 15px 0px 0px 0px !important;

}

.b-green {
    color: #87BD29;
}

.resendotp {
    background-color: #E1F4FC;
    border-radius: 5px;
    margin-bottom: 2rem;
    margin-top: 30px;
    max-width: 500px;
    padding: 15px !important;
}

.buttonsteps {
    font-weight: bold;
    padding: 20px !important;
    color: white !important;
    border-radius: 5px !important;
}

.no-scroll input[type="number"]::-webkit-outer-spin-button,
.no-scroll input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-scroll input[type="number"] {
    -moz-appearance: textfield;
}
</style>
