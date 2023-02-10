<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <v-stepper-step icon="mdi-account" :complete="e1 > 1" step="1">
                <v-icon large color="darken-2">
                </v-icon>
            </v-stepper-step>
            <v-divider></v-divider>

            <!-- Otro paso pero en lugar de número colocar un icono -->

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
                <BannerStep1 />
                <Step1 />
                <!-- <v-card class="mb-12" color="grey lighten-1" height="400px"></v-card> -->

                <v-btn block class="ma-4" color="primary" @click="e1 = 2">
                    Siguiente paso
                    <v-icon dark right>
                        mdi-checkbox-marked-circle
                    </v-icon>
                </v-btn>


            </v-stepper-content>

            <v-stepper-content step="2">
                <v-card class="mb-12" color="grey lighten-1" height="50px"></v-card>
                <Otp />
                <v-card class="mb-12" color="grey lighten-1" height="50px"></v-card>
                <v-btn block class="ma-4" color="primary" @click="e1 = 3">
                    Confirmar código OTP
                    <v-icon dark right>
                        mdi-message-processing
                    </v-icon>
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <Step3 />
                <!-- <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card> -->
                <v-btn block class="ma-4" color="primary" @click="e1 = 4">
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
                <v-btn block class="ma-4" color="primary">
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
import Datepicker from '~/components/Datepicker.vue'
export default {
    components: { Datepicker },
    data() {
        return {
            head: {
                title: 'Diagnostico'
            },
            e1: 1
        }
    }
}
</script>

<style>
.v-stepper {
    width: 55%;
    margin: 0 auto;
    margin-top: 10px;
}

@media (max-width: 720px) {
    .v-stepper {
        width: 100%;
        margin-top: 10px;
    }
}
</style>