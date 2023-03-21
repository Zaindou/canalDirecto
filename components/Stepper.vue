<template>
    <v-stepper v-model="e1" class="stepper-full-width">

        <v-card>
            <v-img src="https://qnt.com.co/wp-content/uploads/2023/02/banner-canaldirecto.jpg" max-height="200"
                max-width="900" class="mb-8"></v-img>
        </v-card>

        <div>
            <template v-if="e1 === 1">
                <p class="titlediag">Bienvenid@ a tu diagnóstico financiero 100% gratuito.</p>
                <p class="subtitlediag">Conoce tu información reportada en centrales de riesgo sin costo.</p>
            </template>
        </div>

        <v-divider></v-divider>
        <v-stepper-header>
            <v-stepper-step icon="mdi-account" :complete="e1 > 1" step="1">
                <v-icon large color="darken-2">
                </v-icon>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 === 4" step="4">
            </v-stepper-step>

        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <Step1 ref="step1" @form-submitted="handleSubmit" />
                <v-col>
                    <div class="switch-container rounded-bg">
                        <label class="switch-label" outlined @click="openModal">Acepta los <a id="linkTerms">términos y
                                condiciones legales</a></label>
                        <v-switch v-model="terminosCondiciones" required inset></v-switch>
                    </div>
                    <Modal title="Términos y condiciones" :content="modalContent" ref="modal"></Modal>
                </v-col>
                <v-btn block color="primary" @click="submitForm" :disabled="!terminosCondiciones" :loading="loading4">
                    Siguiente paso
                    <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
            </v-stepper-content>


            <v-stepper-content step="2">
                <v-row>
                    <v-col cols="12">
                        <Otp @otp-entered="handleOtpEntered" />
                    </v-col>
                </v-row>
                <v-btn block color="primary" @click="verifyOtp" :loading="loading4">
                    Confirmar código OTP
                    <v-icon dark right>
                        mdi-message-processing
                    </v-icon>
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <Step3 />
                <!-- <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card> -->
                <v-btn block color="primary" @click="e1 = 4">
                    Solicitar mi diagnostico
                    <v-icon dark right>
                        <!-- mdi-checkbox-marked-circle -->
                        mdi-account-search
                    </v-icon>
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
                <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

                <!-- botón alineado al centro -->
                <v-btn block color="primary">
                    ¡Listo!
                    <v-icon dark right>
                        mdi-checkbox-marked-circle
                    </v-icon>
                </v-btn>

            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>
<script>
// import Datepicker from '~/components/Datepicker.vue'
import axios from 'axios'
import Alerts from '~/components/commons/Alerts.vue';
import Modal from '~/components/commons/Modal.vue';
import Otp from '~/components/Otp.vue';


export default {
    components: { Alerts, Modal, Otp },
    data() {
        return {
            head: {
                title: 'Diagnostico'
            },
            e1: 1,

            terminosCondiciones: false,

            modalContent: 'Mmm ¿Igual esto nadie lo lee? o Sí, pero no me importa.',

            loading4: false,

            otp: null,


        }
    },
    methods: {
        async handleSubmit(formData) {
            this.loading4 = true;
            await axios.post('diagnostico/Stepone/', formData).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    console.log('Este es el response', response.data)
                    this.$notifier.showMessage({ content: '¡Hemos enviado un código de verificación!', color: 'success' })
                    this.e1 = 2
                    this.loading4 = false;
                } else {
                    console.log(response.data)
                    this.$notifier.showMessage({ content: 'Error al enviar el OTP.', color: 'error' })
                    this.loading4 = false;
                    this.e1 = 1
                }
            }).catch(error => {
                if (error.response.data.message === 'Ya te encuentras en un proceso de diagnóstico.') {
                    this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' })
                    this.loading4 = false;
                    this.e1 = 1
                } else if (error.response.status >= 400 && error.response.status < 500) {
                    this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' })
                    this.loading4 = false;
                    this.e1 = 1
                } else {
                    this.$notifier.showMessage({ content: 'Error al enviar el OTP.', color: 'error' })
                    console.log(error.response.data)
                    this.loading4 = false;
                    this.e1 = 1
                }
            })
        },
        submitForm() {
            if (!this.terminosCondiciones) {
                this.$notifier.showMessage({ content: 'Acepta los términos y condiciones antes de continuar.', color: 'error' })
                return;
            } else if (this)
                this.$refs.step1.submitForm()
        },
        openModal() {
            this.$refs.modal.openModal()
        },
        handleOtpEntered(otp) {
            // console.log('Este es el otp', otp)
            this.otp = otp
        },
        async verifyOtp() {
            this.loading4 = true;
            console.log(`Código OTP ingresado: ${this.otp}`)
            console.log('Este es el numero de celular', this.$refs.step1.numeroCelular)
            await axios.post('diagnostico/otp/', { phone_number: this.$refs.step1.numeroCelular, otp: this.otp }).then(response => {

                if (response.status >= 200 && response.status < 300) {
                    this.$notifier.showMessage({ content: '¡Tu código de verificación es correcto ;)!', color: 'success' })
                    this.e1 = 3
                    this.loading4 = false;
                } else {
                    this.$notifier.showMessage({ content: 'Error al verificar el código de verificación.', color: 'error' })
                    this.e1 = 2
                    this.loading4 = false;
                }
            })
                .catch(error => {
                    if (error.response.status >= 400 && error.response.status < 500) {
                        this.$notifier.showMessage({ content: 'Tu código de verificación es incorrecto.', color: 'error' })
                        this.e1 = 2
                        this.loading4 = false;
                    } else {
                        this.$notifier.showMessage({ content: `Error inesperado: código de estatus ${error.response.status}`, color: 'error' })
                        this.e1 = 2
                        console.log(error.response.data)
                        this.loading4 = false;
                    }
                })
        },
    }
}
</script>

<style>
.v-stepper {
    width: 50%;
    margin: 0 auto;
}

@media (max-width: 767px) {
    .v-stepper {
        width: 100%;
    }

    .rounded-bg {
        background-color: #f2f2f2;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 10px;

    }

    .switch-container {
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .titlediag {
        font-size: 0.5rem !important;
        font-weight: bold;
        color: #747171;
        text-align: center;
        line-height: 1;

    }

    .subtitlediag {
        font-size: 1rem !important;
        color: #747171;
        text-align: center;
        line-height: 1;
        padding: 5px;
    }
}

.rounded-bg {
    background-color: #f2f2f2;
    border-radius: 10px;
    margin-bottom: 10px;

}

.switch-container {
    align-items: center;
    display: flex;
    justify-content: center;
}

.switch-label {
    font-weight: semibold;
    color: #9c9c9c;
}

.titlediag {
    font-size: 1.2rem !important;
    font-weight: bold;
    color: #7e7e7e;
    text-align: center;
    margin: 10px;
    /* line-height: 0; */
}

.subtitlediag {
    font-size: 1.1rem;
    font-weight: semibold;
    color: #747171;
    text-align: center;
    line-height: 1;
}
</style>