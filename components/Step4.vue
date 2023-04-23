<template>
        <v-container class="box-step-4">
                <v-row class="align-center">
                        <v-col>
                                <p class="p2-step-4">
                                        <b>¡Felicitaciones!</b> <br><br>Has generado con éxito la solicitud de tu diagnóstico
                                        financiero,
                                        nuestro equipo consultará tu información en las centrales de riesgo para que
                                        identifiques tu situación actual y posibles soluciones a tu situación financiera.
                                        <br><br>
                                        El diagnóstico se enviará a tu correo electrónico registrado durante la solicitud:
                                        <br><br>
                                        <b>{{ correoElectronico }}</b>
                                </p>
                        </v-col>
                </v-row>
        </v-container>
</template>


<script>
export default {
        computed: {
                correoElectronico() {
                        if (process.client) {
                                return localStorage.getItem("email");
                        }
                        return "";
                },
        },
};
</script>


<style>
@media (max-width: 767px) {
        .p2-step-4 {
                font-size: 1rem;
                font-weight: 500;
                color: #27b0eb;
                padding: 10px !important;
                text-align: center;
        }

        .box-step-4 {
                background-color: #E1F4FC;
                border-radius: 10px;
                margin-bottom: 1.5rem !important;
                max-width: 500px;
        }
}

.p2-step-4 {
        font-size: 0.8rem;
        font-weight: 400;
        color: #27b0eb;
        padding: 10px;
        text-align: center;
}


.box-step-4 {
        background-color: #E1F4FC;
        border-radius: 5px;
        margin-bottom: 1.5rem;
        max-width: 500px;
}
</style>