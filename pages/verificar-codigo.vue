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
                    Por favor ingresa el código de verificación enviado a tu correo y la nueva contraseña.
                </p>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field hide-details="auto" v-model="codigo" type="text" class="mt-6"
                        label="Código de Verificación" outlined prepend-inner-icon="mdi-shield-check"
                        :rules="[v => !!v || 'El código de verificación es requerido', v => /^\d{6}$/.test(v) || 'El código debe ser de 6 dígitos']"></v-text-field>
                    <v-text-field hide-details="auto" v-model="newPassword" :type="showPassword ? 'text' : 'password'"
                        class="mt-6" label="Nueva Contraseña" outlined prepend-inner-icon="mdi-lock"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :rules="[v => !!v || 'La contraseña es requerida', v => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres', v => /[A-Z]/.test(v) || 'La contraseña debe tener al menos una letra mayúscula', v => /[a-z]/.test(v) || 'La contraseña debe tener al menos una letra minúscula', v => /\d/.test(v) || 'La contraseña debe tener al menos un número', v => /[!@#$%^&*]/.test(v) || 'La contraseña debe tener al menos un carácter especial']"></v-text-field>
                    <v-text-field hide-details="auto" v-model="confirmPassword"
                        :type="showPassword ? 'text' : 'password'" class="mt-6 mb-6" label="Confirmar Nueva Contraseña"
                        outlined prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :rules="[v => !!v || 'La confirmación de la contraseña es requerida', v => v === newPassword || 'Las contraseñas no coinciden']"></v-text-field>
                </v-form>
            </div>
            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
                @click="cambiarContrasena">
                CAMBIAR CONTRASEÑA
            </v-btn>
        </div>
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
            valid: false,
            codigo: '',
            newPassword: '',
            confirmPassword: '',
            showPassword: false,
        };
    },
    methods: {
        async cambiarContrasena() {
            if (this.$refs.form.validate()) {
                this.loading = true;
                try {
                    const numeroIdentificacion = this.$cookies.get('numero_identificacion');
                    const response = await this.$axios.post('/diagnostico/reset-password/', {
                        numero_identificacion: numeroIdentificacion,
                        otp_value: this.codigo,
                        new_password: this.newPassword,
                    });
                    this.$notifier.showMessage({
                        content: 'Contraseña restablecida exitosamente',
                        color: 'success',
                    });
                    this.$router.push('/ingreso');
                } catch (error) {
                    this.$notifier.showMessage({
                        content: error.response.data.error,
                        color: 'error',
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
    },
};
</script>
