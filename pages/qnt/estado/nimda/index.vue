<template>
    <div v-if="hasValidAccess">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                    <v-card class="elevation-12 rounded-lg pa-6">
                        <v-card-title class="text-h5 text-center mb-4">Bienvenido</v-card-title>
                        <v-card-text>
                            <p class="text-center mb-6">
                                Para ingresar, por favor ingresa un número de identificación.
                            </p>
                            <v-form ref="form" v-model="isFormValid">
                                <v-text-field v-model="identificacion" label="Número de identificación"
                                    prepend-inner-icon="mdi-account" type="text" pattern="\d*" inputmode="numeric"
                                    outlined
                                    :rules="[v => !!v || 'El número de identificación es requerido']"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn block color="primary" class="mb-2 py-6" :loading="loading" @click="continuar"
                                :disabled="!isFormValid" :style="{
        backgroundImage: 'linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)',
        color: 'white'
    }">
                                CONTINUAR
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { useMainStore } from '@/store/mainStore';
import axios from 'axios'

export default {
    head() {
        return {
            meta: [
                { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
                { hid: 'googlebot', name: 'googlebot', content: 'noindex, nofollow' }
            ]
        }
    },
    data() {
        return {
            loading: false,
            identificacion: '',
            isFormValid: false,
            hasValidAccess: false,
            token: null
        }
    },
    mounted() {
        this.checkAccess()
    },
    methods: {
        checkAccess() {
            const urlParams = new URLSearchParams(window.location.search);
            this.token = urlParams.get('token');

            if (this.token) {
                this.hasValidAccess = true;
            } else {
                this.$router.push('/');
            }
        },
        async fetchData(cedula) {
            const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                headers: {
                    Authorization: `Token ${this.token}`
                }
            })

            const mainStore = useMainStore();
            mainStore.setClientData(response.data.informacionCliente);
            mainStore.setProductos(response.data.wazeQnt.all_products);
            mainStore.setClientDataCookie(this.$nuxt);
        },
        async continuar() {
            if (this.$refs.form.validate()) {
                this.loading = true
                const mainStore = useMainStore();

                try {
                    if (this.token) {
                        localStorage.setItem('auth_token', this.token)
                        localStorage.setItem('numero_identificacion', this.identificacion)

                        mainStore.setTokenCookie(this.$nuxt, this.token);

                        this.$notifier.showMessage({ content: 'Identificación exitosa', color: 'success' })

                        await this.fetchData(this.identificacion)
                        this.$router.push('/inicio')
                    } else {
                        this.$notifier.showMessage({ content: 'Token no encontrado en la URL', color: 'error' })
                    }
                } catch (error) {
                    this.$notifier.showMessage({ content: error.response?.data?.error || 'Error desconocido', color: 'error' })
                } finally {
                    this.loading = false
                }
            }
        }
    }
}
</script>

<style scoped>
.v-text-field>>>input {
    -moz-appearance: textfield;
}

.v-text-field>>>input::-webkit-outer-spin-button,
.v-text-field>>>input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>