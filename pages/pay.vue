<template>
    <div>
        <Loader v-if="loading4" />
        <v-stepper v-model="e1">
            <div class="image-container">
                <v-img v-if="e1 != 4" src="../QNT-MOBILE.webp" class="mobile-image" alt="QNT" />
                <v-img v-if="e1 != 4" src="../QNT_STEP1.jpg" max-width="1000" class="desktop-image" alt="QNT" />
                <v-img v-if="e1 == 4" src="../QNT_STEP4.jpg" max-width="1000" class="desktop-image" alt="QNT" />
            </div>
            <v-divider />
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1" aria-hidden="true">
                    <v-icon large :color="iconColor(1)">mdi-face-recognition</v-icon>
                </v-stepper-step>
                <v-divider />
                <v-stepper-step :complete="e1 > 2" step="2">
                    <v-icon large :color="iconColor(2)">mdi-bank-outline</v-icon>
                </v-stepper-step>
                <v-divider />
                <v-stepper-step :complete="e1 === 4" step="4">
                    <v-icon large :color="iconColor(4)">mdi-tooltip-check-outline</v-icon>
                </v-stepper-step>
            </v-stepper-header>
            <div v-if="showPayment" class="pa-4">
                <div class="info-container">
                    <p class="info-text">
                        Para acceder a tu diagnóstico financiero personalizado, tan solo tienes que invertir <strong
                            class="highlight">$7.000</strong> pesos.
                    </p>
                    <ul class="info-list">
                        <li>Puntaje de crédito</li>
                        <li>Cantidad de productos en centrales de riesgo</li>
                        <li>Presupuesto financiero personalizado</li>
                        <li>Simulador de unificación de deudas</li>
                        <li>Simulador de en cuanto tiempo mejoras el puntaje de crédito</li>
                        <li>Centro de soluciones para saldar tus deudas con tu acreedor</li>
                        <li>Recomendaciones personalizadas para mejorar tu puntaje de crédito</li>
                    </ul>
                    <v-card class="coupon-card" outlined>
                        <v-card-text>
                            <v-row align="center">
                                <v-col cols="12" sm="8">
                                    <v-text-field v-model="promoCode" label="Código promocional" outlined dense
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <v-btn block dark
                                        style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                                        elevation="2" block @click="validatePromoCode" :loading="loading4">
                                        Aplicar
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-alert v-if="promoMessage" :type="promoValid ? 'success' : 'error'" dense class="mt-2">
                                {{ promoMessage }}
                            </v-alert>
                        </v-card-text>
                    </v-card>
                    <v-card class="price-card mt-4" outlined>
                        <v-card-text>
                            <v-row justify="space-between">
                                <v-col cols="6">
                                    <span class="subtitle-1">Precio original:</span>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <span class="subtitle-1" :class="{ 'text-decoration-line-through': discount > 0 }">
                                        $7,000
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row v-if="discount > 0" justify="space-between">
                                <v-col cols="6">
                                    <span class="subtitle-1">Descuento:</span>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <span class="subtitle-1 success--text">
                                        -{{ discountType === 'percentage' ? `${discount}%` : `$${discount}` }}
                                    </span>
                                </v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row justify="space-between">
                                <v-col cols="6">
                                    <span class="subtitle-1 font-weight-bold">Total a pagar:</span>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <span class="subtitle-1 font-weight-bold primary--text">${{
            amountToPay.toLocaleString() }}</span>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>
                <v-btn block color="primary" class="mt-4" :loading="loading4" @click="handlePaymentClick">
                    {{ isFree ? 'Continuar con diagnóstico gratuito' : `Pagar $${amountToPay.toLocaleString()}` }}
                </v-btn>
            </div>
        </v-stepper>
    </div>
</template>

<script>
import axios from 'axios';
import Loader from '~/components/commons/LoaderForm.vue';
import { useMainStore } from '@/store/mainStore';
import { encryptData } from '~/utils/encryption';

export default {
    middleware: 'otpandpay',
    components: {
        Loader
    },
    data() {
        return {
            promoCode: '',
            promoValid: false,
            promoMessage: '',
            loading4: false,
            e1: 2,
            showPayment: true,
            discount: 0,
            discountType: null,
            isFree: false,
            amountToPay: 7000
        }
    },
    methods: {
        async validatePromoCode() {
            if (!this.promoCode) {
                this.promoMessage = '';
                this.promoValid = false;
                return;
            }

            try {
                this.loading4 = true;
                const response = await axios.post('/diagnostico/validate-promo-code/', { promo_code: this.promoCode });
                if (response.data.valid) {
                    this.promoMessage = 'Código promocional aplicado con éxito.';
                    this.promoValid = true;
                    this.discount = response.data.discount;
                    this.discountType = response.data.type;
                    this.applyDiscount(response.data.discount, response.data.type);
                } else {
                    this.promoMessage = response.data.message;
                    this.promoValid = false;
                }
            } catch (error) {
                this.promoMessage = 'Código promocional no válido o expirado.';
                this.promoValid = false;
            } finally {
                this.loading4 = false;
            }
        },
        applyDiscount(discount, type) {
            const configValue = 7000;
            let discountValue = 0;

            if (type === 'percentage') {
                discountValue = configValue * (discount / 100);
            } else if (type === 'amount') {
                discountValue = discount;
            }

            this.amountToPay = Math.max(configValue - discountValue, 0);
            this.isFree = this.amountToPay === 0;
        },
        async handleSubmit3(formData) {
            const token = localStorage.getItem('auth_token');
            const config = {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
            this.loading4 = true;
            try {
                const response = await axios.post('diagnostico/register/financial', formData, config);
                if (response.status >= 200 && response.status < 301) {
                    this.$notifier.showMessage({ content: '¡Hemos cargado tus datos financieros correctamente ;)!', color: 'success' });
                    this.showPayment = false;
                    this.$router.push('/inicio');
                }
            } catch (error) {
                if (error.response.data.detail === "Error en el servidor [<class 'decimal.DivisionByZero'>], por favor comuniquese con el administrador") {
                    this.$notifier.showMessage({ content: "Un paso más, ya casi completamos tu diagnóstico!", color: 'success' });
                    this.$router.push('/ingresos-gastos');
                } else {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' });
                    this.$router.push('/ingresos-gastos');
                }
            } finally {
                this.loading4 = false;
            }
        },
        iconColor(step) {
            if (this.e1 === step) return '#00263C';
            if (this.e1 > step || this.e1 === 4) return '#87BD29';
            return '';
        },
        handlePaymentClick() {
            if (this.isFree) {
                this.continueWithoutPayment();
            } else {
                this.openCheckout();
            }
        },

        async openCheckout() {
            try {
                this.loading4 = true;
                const response = await fetch('/diagnostico/pay/payment-config/');
                const config = await response.json();

                if (response.ok) {
                    const handler = window.ePayco.checkout.configure({
                        key: 'f50dd5b8e84f416926707d303540223b',
                        test: false
                    });

                    const data = {
                        name: config.name,
                        description: config.description,
                        invoice: config.invoice_id,
                        currency: "cop",
                        amount: this.amountToPay,
                        tax_base: this.amountToPay - config.tax,
                        tax: config.tax,
                        tax_ico: config.tax,
                        country: "co",
                        lang: "es",
                        external: "false",
                        extra1: config.invoice_id,
                        extra2: this.amountToPay,
                        extra3: "extra3",
                        confirmation: "https://civil-first-elk.ngrok-free.app/diagnostico/pay/confirmation/",
                        response: "https://test.dahouse.co/pay",
                        name_billing: "",
                        address_billing: "",
                        type_doc_billing: "cc",
                        mobilephone_billing: "",
                        number_doc_billing: "",
                        email_billing: ""
                    };

                    handler.open(data);
                    this.checkPaymentStatus(config.invoice_id, handler);
                } else {
                    console.error('Error fetching payment config:', config.error);
                    this.$notifier.showMessage({ content: 'Error al cargar la configuración de pago', color: 'error' });
                }
            } catch (error) {
                console.error('Error fetching payment config:', error);
                this.$notifier.showMessage({ content: 'Error al iniciar el proceso de pago', color: 'error' });
            } finally {
                this.loading4 = false;
            }
        },
        async continueWithoutPayment() {
            const formData = {
                numero_identificacion: localStorage.getItem('numero_identificacion'),
            };
            await this.handleSubmit3(formData);
        },
        async checkPaymentStatus(invoice_id, handler) {
            const maxRetries = 20;
            const delay = 6000;
            let attempts = 0;

            let numeroIdentificacion = localStorage.getItem('numero_identificacion')
            let numeroCelular = localStorage.getItem('phone')

            const encryptedNumeroIdentificacion = encodeURIComponent(encryptData(numeroIdentificacion));
            // const encryptedNumeroCelular = encodeURIComponent(encryptData(numeroCelular));

            const checkStatus = async () => {
                try {
                    const checkResponse = await axios.get(`/diagnostico/pay/check-payment-status/${invoice_id}/${encryptedNumeroIdentificacion}/`);
                    if (checkResponse.status === 200) {
                        handler.close();
                        const formData = {
                            numero_identificacion: localStorage.getItem('numero_identificacion'),
                        };
                        await this.handleSubmit3(formData);
                    } else if (checkResponse.data.message === 'Transacción pendiente' && attempts < maxRetries) {
                        attempts++;
                        setTimeout(checkStatus, delay);
                    } else {
                        console.error('Error checking payment status:', checkResponse.data.message);
                    }
                } catch (error) {
                    if (attempts < maxRetries) {
                        attempts++;
                        setTimeout(checkStatus, delay);
                    } else {
                        console.error('Error checking payment status:', error);
                    }
                }
            };

            setTimeout(checkStatus, delay);
        },

    },
    async mounted() {
        const ref_payco = this.$route.query.ref_payco;
        if (ref_payco) {
            try {
                const response = await axios.get(`https://secure.epayco.co/validation/v1/reference/${ref_payco}`);
                this.transactionData = response.data.data;
                this.transactionState = this.transactionData.x_cod_transaction_state;

                if (this.transactionState == '1') {
                    this.loading4 = true;
                    const formData = {
                        numero_identificacion: localStorage.getItem('numero_identificacion'),
                    };
                    await this.handleSubmit3(formData);
                    this.loading4 = false;
                } else if (this.transactionState == '3') {
                    this.loading4 = true;
                    this.showPayment = false;
                    setTimeout(() => {
                        location.reload();
                    }, 20000);

                } else {
                    this.loading4 = true;
                    this.showPayment = false;
                    console.log('Transaction rejected')
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 10000);
                    this.loading4 = false;
                }
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        }
    }
};
</script>

<style scoped>
.info-container {
    max-width: 500px;
    margin: 0 auto;
}

.info-text {
    color: #7d7d7d;
    font-size: 1.1rem;
    text-align: center;
    margin-bottom: 1rem;
}

.info-text .highlight {
    color: #87BD29;
}

.info-list {
    color: #7d7d7d;
    font-size: 1rem;
    margin-bottom: 1rem;
    padding-left: 20px;
}

.coupon-card {
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
}

.price-card {
    background-color: #f5f5f5;
}
</style>