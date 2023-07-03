<template>
    <v-stepper v-model="e1" class="stepper-full-width">
        <Loader v-if="loading4"></Loader>
        <div class="image-container">
            <v-img v-if="e1 != 4" src="../QNT-MOBILE.webp" max-width="900" class="mb-1 mobile-image" alt="QNT"></v-img>
            <v-img v-if="e1 != 4" src="../QNT_PC.webp" max-width="900" class="mb-1 desktop-image" alt="QNT"></v-img>
            <v-img v-if="e1 == 4" src="../QNT_4.webp" max-width="900" class="desktop-image" alt="QNT"></v-img>

        </div>

        <v-divider></v-divider>
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1" aria-hidden="true">
                <v-icon large :color="iconColor(1)">mdi-face-recognition</v-icon>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
                <v-icon large :color="iconColor(2)">mdi-shield-lock-outline</v-icon>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">
                <v-icon large :color="iconColor(3)">mdi-piggy-bank-outline</v-icon>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 === 4" step="4">
                <v-icon large :color="iconColor(4)">mdi-tooltip-check-outline</v-icon>
            </v-stepper-step>

        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <Step1 ref="step1" @form-submitted="handleSubmit" />
                <v-col>
                    <div class="switch-container rounded-bg">
                        <label class="switch-label" outlined @click="TermsAndConditionsRedirect">Acepta los <a
                                id="linkTerms">términos y
                                condiciones legales</a></label>
                        <v-switch v-model="terminosCondiciones" required inset></v-switch>
                    </div>
                    <Modal title="Términos y condiciones" :content="modalContent" ref="modal"></Modal>
                </v-col>
                <v-btn block color="primary" @click="submitForm" :disabled="!terminosCondiciones" class="buttonsteps">
                    Siguiente
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
                <v-row>
                    <v-col cols="12">
                        <Otp @otp-entered="handleOtpEntered" />
                    </v-col>
                </v-row>
                <v-btn block color="primary" @click="verifyOtp" class="buttonsteps">
                    Validar código OTP
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <Step3 ref="step3" @submit="handleSubmit3" :numero-identificacion="numero_identificacion" />
                <v-btn block color="primary" @click="submitForm3" class="buttonsteps">
                    Solicitar diagnóstico
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
                <Step4 :clientData="clientData" :productos="productos"></Step4>
                <v-btn block color="primary" class="buttonsteps" @click="finalizeAndRedirect">
                    ¡Finalizar!
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
import Loader from '~/components/commons/Loader.vue';
import Otp from '~/components/Otp.vue';
import Step3 from '~/components/Step3.vue';
import Step4 from '~/components/Step4.vue';


export default {
    components: { Alerts, Modal, Otp, Step3, Step4, Loader },
    data() {
        return {
            head: {
                title: 'Diagnostico'
            },

            e1: 1,

            terminosCondiciones: false,

            modalContent: 'Términos y condiciones',

            loading4: false,

            otp: null,

            numero_identificacion: null,

        }
    },
    methods: {
        async handleSubmit(formData) {
            try {
                this.loading4 = true;
                this.numero_identificacion = formData.numero_identificacion
                const response = await axios.post('diagnostico/register', formData);

                console.log(formData)

                if (response.status >= 200 && response.status < 300) {
                    console.log('Este es el response', response.data)
                    localStorage.setItem("auth_token", response.data.token);
                    localStorage.setItem("numero_identificacion", formData.numero_identificacion);
                    this.$axios.setToken(response.data.token, "Token");

                    if (response.data.status_code === "NEW_DIAGNOSTIC") {
                        this.$notifier.showMessage({ content: '¡Hemos enviado un código de verificación!', color: 'success' })
                        this.e1 = 2;
                    } else if (response.data.status_code === "REDIRECT_TO_DIAGNOSTIC") {
                        this.$notifier.showMessage({ content: '¡Bienvenido de nuevo, te redirigimos a tu diagnóstico!', color: 'success' })

                        this.e1 = 4;
                        await this.fetchData();

                    }
                } else {
                    this.$notifier.showMessage({ content: 'Error al enviar el OTP.', color: 'error' });
                    this.e1 = 1;
                }
            } catch (error) {
                this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' });
                this.e1 = 1;
            } finally {
                this.loading4 = false;
            }
        },
        async handleSubmit3(formData) {
            const token = localStorage.getItem("auth_token");

            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }

            this.loading4 = true;
            await axios.post('diagnostico/register/financial', formData, config).then(async response => {
                if (response.status >= 200 && response.status < 301) {
                    this.$notifier.showMessage({ content: '¡Hemos cargado tus datos financieros correctamente ;)!', color: 'success' })
                    await this.fetchData();
                    this.e1 = 4
                }
                this.loading4 = false;
            }
            ).catch(error => {
                if (error.response.status >= 400 && error.response.status < 500) {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' })
                    this.loading4 = false;
                    this.e1 = 3
                } else {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' })
                    this.loading4 = false;
                    this.e1 = 3
                }
            })
        },
        submitForm3() {
            this.$refs.step3.submitForm3()
        },

        async fetchData() {
            let token, cedula;
            if (process.client) {
                token = localStorage.getItem("auth_token");
                cedula = localStorage.getItem("numero_identificacion");
            }

            const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            this.clientData = response.data.informacionCliente;
            this.productos = response.data.wazeQnt;
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
            this.otp = otp
        },
        async verifyOtp() {
            const data = {
                phone_number: this.$refs.step1.numeroCelular,
                numero_identificacion: this.numero_identificacion,
                primer_apellido: this.$refs.step1.primerApellido,
                otp: this.otp
            }

            this.loading4 = true;
            await axios.post('diagnostico/otp/verify', data).then(response => {
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
                        // console.log(error.response.data)
                        this.loading4 = false;
                    }
                })
        },

        iconColor(step) {
            let color;
            if (this.e1 === step) {
                color = '#2B81D6';
            } else if (this.e1 > step) {
                color = '#87BD29';
            } else if (this.e1 === 4) {
                color = '#87BD29';
            } else {
                color = '';
            }
            return color;
        },
        saveStepToLocalStorage() {
            localStorage.setItem('step', this.e1);
            localStorage.setItem('numero_identificacion', this.numero_identificacion);
            localStorage.setItem('email', this.$refs.step1.correoElectronico);
            localStorage.setItem('phone', this.$refs.step1.numeroCelular);
            localStorage.setItem('firstName', this.$refs.step1.primerNombre);
        },

        getStepFromLocalStorage() {
            const step = localStorage.getItem('step');
            const stepMap = {
                '1': 1,
                '2': 2,
                '3': 3,
                '4': 4
            }

            if (step && stepMap.hasOwnProperty(step)) {
                this.e1 = stepMap[step];
            }
        },

        getIdentificationFromLocalStorage() {
            const identification = localStorage.getItem('numero_identificacion');

            if (identification) {
                this.numero_identificacion = identification;
            }
        },

        getEmailPhoneAndNameFromLocalStorage() {
            const email = localStorage.getItem('email');
            const phone = localStorage.getItem('phone');
            const firstName = localStorage.getItem('firstName');

            if (email) {
                this.$refs.step1.correoElectronico = email;
            }

            if (phone) {
                this.$refs.step1.numeroCelular = phone;
            }

            if (firstName) {
                this.$refs.step1.primerNombre = firstName;
            }
        },
        TermsAndConditionsRedirect() {
            window.open('https://www.qnt.com.co/terminos-y-condiciones/', '_blank');
        },

        finalizeAndRedirect() {
            localStorage.clear();
            window.location.href = "https://www.qnt.com.co";
        },

        showTimeoutWarning() {
            this.$notifier.showMessage({ content: 'Tu sesión está a punto de expirar, por favor completa el formulario.', color: 'warning', icon: 'mdi-alert-circle' })
        },

        showCloseWarning() {
            this.$notifier.showMessage({ content: 'Tu sesión ha expirado, por favor completa el formulario.', color: 'error', icon: 'mdi-alert-circle' })
        }

    },
    mounted() {
        this.getStepFromLocalStorage();
        this.getIdentificationFromLocalStorage();
        this.getEmailPhoneAndNameFromLocalStorage();

        setTimeout(() => {
            this.showTimeoutWarning();
        }, 10 * 60 * 1000); // 10 minutes

        setTimeout(() => {
            // localStorage.clear();
            // location.reload()
            this.showCloseWarning();
        }, 15 * 60 * 1000); // 15 minutes
    },

    beforeDestroy() {
        this.saveStepToLocalStorage();
    },

    watch: {
        e1() {
            this.saveStepToLocalStorage();
        },
    },


}
</script>

<style>
.v-stepper {
    width: 50%;
    margin: 0 auto;
    padding: 0 !important;
}


@media (max-width: 767px) {
    .v-stepper {
        width: 100%;
        margin: 0 auto;
        padding: 0 !important;
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

    .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
        display: flex !important;
    }

    .buttonsteps {
        font-weight: bold;
        border-radius: 5px;
        padding: 20px !important;
    }

    .mobile-image {
        display: block !important;
    }

    .desktop-image {
        display: none !important;
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

.v-stepper:not(.v-stepper--vertical) .v-stepper__step__step {
    display: none;
}

.buttonsteps {
    font-weight: bold;
    border-radius: 5px;
    padding: 20px !important;
}

.image-container {
    position: relative;
}

.mobile-image {
    display: none !important;
}

.desktop-image {
    display: block !important;
}
</style>


