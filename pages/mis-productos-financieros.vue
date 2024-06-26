<template>
    <v-container class="pa-7- main-container">
        <Header></Header>
        <div>
            <v-btn icon color="#0b2f44" @click="navigateTo('inicio')" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;">Conoce los productos que tienes vigentes reportados en las
                centrales de riesgo del día <b>{{ fechaDiagnostico }}</b>.
                Los organizamos de manera tal que puedas ver cual es el que te ayuda más a mejorar tu perfil crediticio.
            </p>
        </div>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="6">
                <v-card class="mb-1 step-1">
                    <v-row no-gutters class="pa-1">
                        <v-col cols="2" class="d-flex justify-start align-center">
                            <IconoCredito class="icono-svg" />
                        </v-col>
                        <v-col cols="10" class="d-flex flex-column justify-center">
                            <span class="title">Saldo de mis créditos</span>
                            <span class="subtitle-1" style="color: #0b2f44;">{{
                formatCurrency(saldoProductos) }}</span>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- Tarjeta para el saldo en mora -->
            <v-col cols="12" sm="6" md="6">
                <v-card class="step-2">
                    <v-row no-gutters class="pa-1">
                        <v-col cols="2" class="d-flex justify-start align-center">
                            <IconoMora class="icono-svg" />
                        </v-col>
                        <v-col cols="10" class="d-flex flex-column justify-center">
                            <span class="title">Saldo en mora</span>
                            <span class="subtitle-1" style="color: #0b2f44;">{{ formatCurrency(saldoMora)
                                }}</span>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <div class="mt-8">
            <span class="title-tools">Detalle de tus productos (Vigentes)</span>
            <Productos class="step-3" />
        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6 step-4" @click="navigateTo('simulador')">
            CONTINUAR
        </v-btn>
    </v-container>
</template>

<script>
// Importar los componentes SVG
import IconoCredito from '/components/icons/IconoCredito.vue';
import IconoMora from '/components/icons/IconoMora.vue';
import Header from '/components/commons/Header.vue';
import Productos from '/components/commons/Products.vue';
import { useMainStore } from '@/store/mainStore';


export default {
    components: {
        IconoCredito,
        IconoMora,
        Productos,
        Header,
    },
    data: () => ({
        localClientData: null,
        saldoProductos: 0,
        saldoMoraProductos: null,
        fechaDiagnostico: null,
        sortedProducts: [],
        saldoMora: null,
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(value);
        },
        formattedDate() {
            if (this.localClientData && this.localClientData.fecha_diagnostico) {
                const date = new Date(this.localClientData.fecha_diagnostico);
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'Diciembre'];

                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();

                return `${day} de ${month} de ${year}`;
            }
            return 'Hoy es un buen día...';
        },
        navigateTo(route) {
            this.$router.push(route);
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                this.localClientData = newValue;
                // this.saldoProductos = newValue ? newValue.saldo_total_productos : 0;
                this.saldoMoraProductos = newValue ? newValue.saldo_total_productos_mora : 'No tienes saldo en mora.';
                this.fechaDiagnostico = newValue ? this.formattedDate() : null;
            }
        },
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.sortedProducts = newValue;

                    this.saldoMora = this.sortedProducts.reduce((total, producto) => {
                        if (producto.estado !== "Al día") {
                            return total + producto.saldo_total;
                        }
                        return total;
                    }, 0);

                    this.saldoProductos = this.sortedProducts.reduce((total, producto) => {
                        return total + producto.saldo_total;
                    }, 0);
                }
            }
        }


    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();

        if (!localStorage.getItem('tourFinances')) {
            introJs().setOptions({
                steps: [
                    {
                        intro: 'En esta sección podrás ver el saldo de tus créditos y el saldo en mora de tus productos financieros.',
                        title: "Bienvenido a tus productos financieros!",
                    },
                    {
                        element: document.querySelector('.step-3'),
                        title: "Detalle de tus productos financieros",
                        intro: 'Aquí podrás ver el detalle de tus productos financieros.',
                    },
                    {
                        element: document.querySelector('.step-4'),
                        title: "Continuar",
                        intro: 'Haz clic en el botón para continuar.',
                    },
                ],
                nextLabel: 'Siguiente',
                prevLabel: 'Anterior',
                doneLabel: 'Listo',
                // showProgress: true,
                dontShowAgain: false,
                dontShowAgainLabel: 'No volver a mostrar',
                showBullets: false,
                disableInteraction: true,
                overlayOpacity: 0.7,
                exitOnEsc: false,
                exitOnOverlayClick: false,
                showButtons: true,

            }).start();
        }

        localStorage.setItem('tourFinances', 'true');
    },
};
</script>

<style scoped>
.icono-svg {
    height: 65px;
    width: 65px;
}

.title {
    font-size: 1rem;
    font-weight: 600;
    color: #0b2f44;
    margin-bottom: 4px;
    text-align: center;
    /* Ajusta esto para controlar el espacio entre el título y el subtítulo */
}

.subtitle-1 {
    font-size: 1rem;
    color: #424242;
    text-align: center;
}

.title-tools {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0b2f44;
    margin-bottom: 4px;
    text-align: center;
    /* Ajusta esto para controlar el espacio entre el título y el subtítulo */
}

@media (min-width: 960px) {
    .main-container {
        max-width: 1200px;
        /* Ajusta el ancho máximo del contenedor */
        margin: auto;
        /* Centra el contenedor */
    }
}
</style>
