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
                    Ingresa tu número de identificación para restablecer tu contraseña.
                </p>
                <v-text-field v-model="numeroIdentificacion" type="text" pattern="\d*" inputmode="numeric" class="mt-6"
                    label="Número de identificación" outlined prepend-inner-icon="mdi-account"
                    :rules="[v => !!v || 'El número de identificación es requerido']">
                </v-text-field>
            </div>
            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                @click="solicitarCambioContrasena">
                SOLICITAR RESTABLECIMIENTO
            </v-btn>
        </div>

        <!-- Modal para mostrar el mensaje de código enviado -->
        <v-dialog v-model="showModal" max-width="500px">
            <v-card>
                <v-card-title class="headline">Código enviado</v-card-title>
                <v-card-text>Código de verificación enviado a {{ maskedEmail }} y {{ maskedPhone }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                        elevation="2" @click="closeModal">Continuar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-stepper>
</template>

<script>
import Loader from '~/components/commons/LoaderForm.vue';
import { useMainStore } from '@/store/mainStore';

export default {
    components: { Loader },
    data() {
        return {
            e1: 1,
            loading: false,
            numeroIdentificacion: '',
            showModal: false,
            maskedEmail: '',
            maskedPhone: '',
        };
    },
    methods: {
        async solicitarCambioContrasena() {
            this.loading = true;
            try {
                const response = await this.$axios.post('/diagnostico/request-password-reset/', {
                    numero_identificacion: this.numeroIdentificacion,
                });
                const { email, phone, numero_identificacion } = response.data;

                // Enmascarar el correo electrónico y el número de teléfono
                this.maskedEmail = email.replace(/(.{2})(.*)(?=@)/,
                    (_, a, b) => a + '*'.repeat(b.length));
                this.maskedPhone = phone.replace(/(\d{2})(\d{4})(\d{2})/,
                    (_, a, b, c) => a + '*'.repeat(b.length) + c);

                // Guardar el número de identificación en una cookie
                this.$cookies.set('numero_identificacion', numero_identificacion, {
                    secure: true,
                    sameSite: 'Strict',
                });

                // Mostrar el modal
                this.showModal = true;
            } catch (error) {
                this.$notifier.showMessage({
                    content: error.response.data.error,
                    color: 'error',
                });
            } finally {
                this.loading = false;
            }
        },
        closeModal() {
            this.showModal = false;
            this.$router.push('/verificar-codigo');
        },
    },
};
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
    border: 1px solid #dbf1e9 !important;
}

.security-text {
    color: #1c4052;
    font-size: 14px;
}
</style>