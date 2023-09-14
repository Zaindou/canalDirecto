<template>
    <div>
        <div class="ma-auto position-relative" style="max-width: 500px">
            <p class="p1">Hemos enviado un <b class="b-green">código de verificación</b> a tu correo y/o celular, para
                validar tu identidad.</p>
            <v-otp-input length="5" type="number" @input="$emit('otp-entered', $event)" placeholder="0"></v-otp-input>
        </div>
        <v-container class="resendotp">
            <v-row class="align-center">
                <v-col cols="auto" class="text-center col-step-otp">
                    <v-icon class="p-icon" size="30">mdi-history</v-icon>
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
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            otp: '',
            showResendBtn: false,
            remainingTime: 180,
            timer: null,
        }
    },
    methods: {
        onInput(value) {
            this.otp = value
        },
        onComplete(value) {
            this.$emit('otp-entered', this.otp)
        },


        resendOTP() {

            const token = localStorage.getItem("auth_token");

            const config = {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }

            const data = {
                numero_celular: localStorage.getItem('phone'),
                correo_electronico: localStorage.getItem('email'),
                primer_nombre: localStorage.getItem('firstName'),
            };

            axios.post('diagnostico/otp/resend', data, config)
                .then(response => {
                    this.$notifier.showMessage({ content: `${response.data.message}`, color: 'success' })
                })
                .catch(error => {
                    if (error.response.status === 409) {
                        // Redirige al paso 1 en caso de recibir el error HTTP 409
                        this.$router.push({ name: 'Step1' });
                    } else {
                        this.$notifier.showMessage({ content: `${error.response.data.message}`, color: 'error' })
                    }
                });

            this.showResendBtn = false;
            this.remainingTime = 180;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.remainingTime--;
                if (this.remainingTime === 0) {
                    clearInterval(this.timer);
                    this.showResendBtn = true;
                }
            }, 1000);
        },
    },
    mounted() {
        this.timer = setInterval(() => {
            this.remainingTime--
            if (this.remainingTime === 0) {
                clearInterval(this.timer)
                this.showResendBtn = true
            }
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>

<style>
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

/* .col {
    padding: 10px !important;
} */
</style>