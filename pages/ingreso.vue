<template>
    <v-stepper v-model="e1" class="desktop-stepper">
        <Loader v-if="loading" />
        <div class="image-container">
            <v-img src="../QNT_STEP1.jpg" max-width="1000" class="desktop-image" alt="QNT" />
        </div>
        <v-divider />
        <div class="pa-4">
            <div class="ma-auto position-relative" style="max-width: 500px">
                <p class="p1 mt-5 text-center">
                    Para volver a ingresar ingresa tu número de identificación y la contraseña que creaste inicialmente.
                </p>
                <v-text-field v-model="identificacion" type="text" pattern="\d*" inputmode="numeric" class="mt-6"
                    label="Número de identificación" placeholder="Ingresa tu número de identificación" outlined
                    prepend-inner-icon="mdi-account">
                </v-text-field>
                <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña"
                    placeholder="Ingresa tu contraseña" outlined prepend-inner-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword">
                </v-text-field>
                <!-- Nuevo card de seguridad -->
                <v-card class="security-card mb-4" outlined>
                    <v-card-text class="pa-3">
                        <v-icon color="#00a650" small class="mr-2">mdi-shield-check</v-icon>
                        <span class="security-text">Por seguridad, verificaremos tus datos a través de un código
                            temporal que te enviaremos por mensaje de texto.</span>
                    </v-card-text>
                </v-card>
                <div class="text-right mb-4">
                    <v-btn text color="primary" class="text-none" @click="olvidoContrasena">
                        ¿Olvidaste tu contraseña?
                    </v-btn>
                </div>

            </div>
            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                @click="continuar">
                CONTINUAR
            </v-btn>
        </div>
    </v-stepper>
</template>
<script>
import Loader from '~/components/commons/LoaderForm.vue'
import { useMainStore } from '@/store/mainStore';
import axios from 'axios'

export default {
    components: { Loader },
    data() {
        return {
            e1: 1,
            loading: false,
            identificacion: '',
            password: '',
            showPassword: false,
        }
    },
    methods: {
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
            mainStore.setClientDataCookie(this.$nuxt);
            // mainStore.setProductosAcuerdo(this.productosAcuerdo);
            // mainStore.setProductosOferta(this.productosOferta);
            // mainStore.setOtrosProductos(this.otrosProductos);

        },
        async continuar() {
            this.loading = true
            const mainStore = useMainStore();

            try {
                const response = await this.$axios.post('/diagnostico/login/', {
                    username: this.identificacion,
                    password: this.password
                })
                const { token, status_code } = response.data
                localStorage.setItem('auth_token', token)
                localStorage.setItem('numero_identificacion', this.identificacion)
                localStorage.setItem('objetivo_financiero', response.data.objetivo_financiero)
                mainStore.setTokenCookie(this.$nuxt, response.data.token);

                this.$notifier.showMessage({ content: 'Inicio de sesión exitoso', color: 'success' })

                if (status_code === 'REDIRECT_TO_DIAGNOSTIC') {
                    await this.fetchData()
                    this.$router.push('/inicio')

                } else if (status_code === 'PAY_DIAGNOSTIC') {
                    this.$router.push('/pay')
                } else if (status_code === 'NEW_DIAGNOSTIC') {
                    await this.fetchData()
                    this.$router.push('/otp')
                } else {
                    this.$router.push('/registro')
                }
            } catch (error) {
                this.$notifier.showMessage({ content: error.response.data.error, color: 'error' })
            } finally {
                this.loading = false
            }
        },
        olvidoContrasena() {
            this.$router.push('/restablecer-contrasena')
        }
    }
}
</script>

<style scoped>
.no-scroll input[type="number"]::-webkit-outer-spin-button,
.no-scroll input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-scroll input[type="number"] {
    -moz-appearance: textfield;
}

.no-spinner /deep/ input[type=number]::-webkit-inner-spin-button,
.no-spinner /deep/ input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-spinner /deep/ input[type=number] {
    -moz-appearance: textfield;
}

.security-card {
    background-color: #dbf1e9 !important;
    /* Color verde claro similar al de la imagen */
    border: 1px solid #dbf1e9 !important;
}

.security-text {
    color: #1c4052;
    font-size: 14px;
}
</style>
