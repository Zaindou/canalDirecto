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
                    <v-icon large :color="iconColor(1)">
                        mdi-face-recognition
                    </v-icon>
                </v-stepper-step>

                <v-divider />

                <v-stepper-step :complete="e1 > 2" step="2">
                    <v-icon large :color="iconColor(2)">
                        mdi-bank-outline
                    </v-icon>
                </v-stepper-step>

                <v-divider />
                <v-stepper-step :complete="e1 === 4" step="4">
                    <v-icon large :color="iconColor(4)">
                        mdi-tooltip-check-outline
                    </v-icon>
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
                    <v-text-field label="¿Tienes un código promocional?" v-model="promoCode" clearable outlined
                        @blur="validatePromoCode"></v-text-field>
                    <p v-if="promoMessage" :class="{ 'success-text': promoValid, 'error-text': !promoValid }">{{
            promoMessage }}</p>
                </div>
                <v-btn v-if="!isFree" block dark
                    style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                    class="buttonsteps" @click="openCheckout">
                    Pagar
                </v-btn>
                <v-btn v-else block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                    elevation="2" class="buttonsteps" @click="continueWithoutPayment">
                    Continuar
                </v-btn>
            </div>
            <div v-else>
                <v-container>
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-icon large :color="transactionIconColor">
                                {{ transactionIcon }}
                            </v-icon>
                            <v-alert v-if="transactionMessage" :type="transactionType" dismissible>
                                <p>{{ transactionMessage }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12">
                            <v-card>
                                <v-card-title>Detalles de tu transacción</v-card-title>
                                <v-card-text>
                                    <v-list dense>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>Referencia de la transacción</v-list-item-title>
                                                <v-list-item-subtitle>{{ transactionData.x_id_invoice
                                                    }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item
                                            v-if="transactionState == '1' || transactionState == '2' || transactionState == '3'">
                                            <v-list-item-content>
                                                <v-list-item-title>Monto</v-list-item-title>
                                                <v-list-item-subtitle>{{ transactionData.x_amount }} {{
            transactionData.x_currency_code
        }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item
                                            v-if="transactionState == '1' || transactionState == '2' || transactionState == '3'">
                                            <v-list-item-content>
                                                <v-list-item-title>Banco</v-list-item-title>
                                                <v-list-item-subtitle>{{ transactionData.x_bank_name
                                                    }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item
                                            v-if="transactionState == '1' || transactionState == '2' || transactionState == '3'">
                                            <v-list-item-content>
                                                <v-list-item-title>Fecha y hora transacción</v-list-item-title>
                                                <v-list-item-subtitle>{{ transactionData.x_fecha_transaccion
                                                    }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item
                                            v-if="transactionState == '1' || transactionState == '2' || transactionState == '3'">
                                            <v-list-item-content>
                                                <v-list-item-title>Estado</v-list-item-title>
                                                <v-list-item-subtitle>{{ transactionData.x_response
                                                    }}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item v-if="transactionState == '2'">
                                            <v-list-item-content>
                                                <v-list-item-title>Transacción Rechazada</v-list-item-title>
                                                <v-list-item-subtitle>Tu transacción ha sido rechazada. Serás redirigido
                                                    en 10 segundos.</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item v-if="transactionState == '3'">
                                            <v-list-item-content>
                                                <v-list-item-title>Transacción Pendiente</v-list-item-title>
                                                <v-list-item-subtitle>Tu transacción está pendiente. Por favor
                                                    espera...</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
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
            clientData: null,
            productos: [],
            transactionState: null,
            transactionData: {},
            discount: 0,
            discountType: null,
            isFree: false,
            amountToPay: 7000 // Default amount to pay
        }
    },
    methods: {
        onInput(value) {
            this.otp = value;
        },
        async validatePromoCode() {
            if (!this.promoCode) {
                this.promoMessage = '';
                this.promoValid = false;
                return;
            }

            try {
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
            }
        },
        applyDiscount(discount, type) {
            const configValue = 7000; // Valor del diagnóstico, puede ser dinámico si lo obtienes de otro lado
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
            await axios.post('diagnostico/register/financial', formData, config).then(async (response) => {
                if (response.status >= 200 && response.status < 301) {
                    this.$notifier.showMessage({ content: '¡Hemos cargado tus datos financieros correctamente ;)!', color: 'success' });
                    await this.fetchData();
                    this.showPayment = false; // Ocultar la sección de pago y mostrar diagnóstico financiero
                    this.$router.push('/inicio'); // Redirigir al flujo del diagnóstico
                }
                this.loading4 = false;
            }).catch((error) => {
                if (error.response.data.detail === "Error en el servidor [<class 'decimal.DivisionByZero'>], por favor comuniquese con el administrador") {
                    this.$notifier.showMessage({ content: "Un paso más, ya casi completamos tu diagnóstico!", color: 'success' });
                    this.$router.push('/ingresos-gastos');
                    this.loading4 = false;
                } else if (error.response.status >= 400 && error.response.status === 500) {
                    console.log(error.response.data.detail, "error");
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' });
                    this.loading4 = false;
                    this.$router.push('/ingresos-gastos');
                } else {
                    this.$notifier.showMessage({ content: `${error.response.data.detail}`, color: 'error' });
                    this.loading4 = false;
                }
            });
        },
        async fetchData() {
            let token, cedula;
            if (process.client) {
                token = localStorage.getItem('auth_token');
                cedula = localStorage.getItem('numero_identificacion');
            }

            const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            this.clientData = response.data.informacionCliente;
            this.productos = response.data.wazeQnt.all_products;
            this.productosAcuerdo = response.data.wazeQnt.products_with_agreement;
            this.productosOferta = response.data.wazeQnt.products_with_offer;
            this.otrosProductos = response.data.wazeQnt.other_products;

            const mainStore = useMainStore();
            mainStore.setClientData(this.clientData);
            mainStore.setProductos(this.productos);
        },
        iconColor(step) {
            let color;
            if (this.e1 === step) {
                color = '#00263C';
            } else if (this.e1 > step) {
                color = '#87BD29';
            } else if (this.e1 === 4) {
                color = '#87BD29';
            } else {
                color = '';
            }
            return color;
        },
        async openCheckout() {
            try {
                const response = await fetch('/diagnostico/pay/payment-config/');
                const config = await response.json();

                if (response.ok) {
                    var handler = ePayco.checkout.configure({
                        key: 'f50dd5b8e84f416926707d303540223b',
                        test: false
                    });

                    var data = {
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
                        email_billing: "",
                        methodsDisable: ""
                    };

                    handler.open(data);

                    // Verificar el estado del pago y redirigir
                    this.checkPaymentStatus(config.invoice_id, handler);
                } else {
                    console.error('Error fetching payment config:', config.error);
                }
            } catch (error) {
                console.error('Error fetching payment config:', error);
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
            const encryptedNumeroCelular = encodeURIComponent(encryptData(numeroCelular));

            const checkStatus = async () => {
                try {
                    const checkResponse = await axios.get(`/qnt/pay/check-payment-status/${invoice_id}/${encryptedNumeroIdentificacion}/${encryptedNumeroCelular}/`);
                    if (checkResponse.status === 200) {
                        this.transactionState = '1'; // Estado aceptado
                        this.transactionData = checkResponse.data;
                        handler.close(); // Cerrar el modal de ePayco
                        const formData = {
                            numero_identificacion: localStorage.getItem('numero_identificacion'),
                        };
                        await this.handleSubmit3(formData);
                    } else if (checkResponse.data.message === 'Transacción pendiente' && attempts < maxRetries) {
                        this.transactionState = '3'; // Estado pendiente
                        this.transactionData = checkResponse.data;
                        attempts++;
                        setTimeout(checkStatus, delay);
                    } else {
                        this.transactionState = '2'; // Estado rechazado
                        this.transactionData = checkResponse.data;
                        console.error('Error checking payment status:', checkResponse.data.message);
                    }
                } catch (error) {
                    if (attempts < maxRetries) {
                        attempts++;
                        setTimeout(checkStatus, delay);
                    } else {
                        this.transactionState = '2'; // Estado rechazado
                        this.transactionData = { message: error.message };
                        console.error('Error checking payment status:', error);
                    }
                }
            };

            setTimeout(checkStatus, delay);
        }
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
                    console.log('Transaction accepted')
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

<style>
/* Estilos del componente */
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

.info-container {
    margin-bottom: 1rem;
}

.info-text {
    color: #7d7d7d;
    font-size: 1.1rem;
    font-weight: 400;
    text-align: center;
    margin-bottom: 1rem;
}

.info-text .highlight {
    color: #87BD29;
}

.info-list {
    color: #7d7d7d;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1rem;
    padding-left: 20px;
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

.success-text {
    color: green;
}

.error-text {
    color: red;
}
</style>
