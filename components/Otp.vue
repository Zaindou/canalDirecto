1<template>
    <div>
        <div class="ma-auto position-relative" style="max-width: 500px">
            <p class="p1">Hemos enviado un <b class="b-green">código de verificación</b> a tu correo y/o celular, para validar tu identidad.</p>
            <v-otp-input length="5" type="number" @input="$emit('otp-entered', $event)" placeholder="0"></v-otp-input>
        </div>
        <v-container class="resendotp">
            <p v-if="showResendBtn" class="p2">¿No has recibido el código de verificación? </p>
            <button v-if="showResendBtn" class="btn" @click="resendOTP"><b>¡Clic aquí!</b></button>
            <p v-else class="p2">Podrás reenviar tu código nuevamente en: <b>{{ remainingTime }}</b> segundos.</p>
        </v-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            otp: '',
            showResendBtn: false,
            remainingTime: 10,
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
            // Send request to resend OTP here
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
    font-size: 1rem;
    font-weight: 400;
    text-align: center; 
    /* line-height: 1.5; */
    color: #747171;
}

.p2 {
    font-size: 1rem;
    font-weight: 400;
    align-items: center;
    text-align: center;
    color: #ffffff;}

.b-green {
    color: #19b921;
}

.resendotp {
    background-color: rgba(37, 146, 219, 0.7);
    border-radius: 5px;
    margin-bottom: 1rem;
    margin-top: 30px;
    max-width: 500px;
    padding: 0.8rem;
}

.btn {
    /* background-color: rgba(red, green, blue, 0.5); */
    border-radius: 5px;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    font-size: 1rem;
    font-weight: 400;
    line-height: 0.5;
    margin: 0 auto;
    max-width: 500px;
    padding: 0.5rem;
    text-align: center;
    text-decoration: none;
    width: 100%;
}


</style>