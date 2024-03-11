<template>
    <v-container class="pa-7 main-container">
        <Header></Header>
        <div>
            <v-btn icon color="#0b2f44" @click="navigateTo('inicio')" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;"> Conoce el presupuesto recomendado por QNT para que conozcas
                como
                mejorar tu perfil
                crediticio ante las centrales de riesgo; Recuerda que esta información se obtiene a partir de los reportes
                de prestaciones sociales
                realizados por tu empleador.
            </p>
        </div>
        <div>
            <v-row>
                <v-col v-for="item in financialData" :key="item.id" cols="12" md="4">
                    <v-card>
                        <v-card-title class="d-flex justify-space-between align-center">
                            <div class="d-flex align-center">
                                <!-- Usamos img con src apuntando a la carpeta static -->
                                <img :src="`/icons/${item.iconName}.svg`" class="mr-1 svg-icon" />
                                <span class="title">{{ item.title }}</span>
                            </div>
                            <span class="text">{{ item.value }}</span>
                        </v-card-title>

                        <!-- Sección para tooltip si es necesario -->
                        <!-- <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-card-actions v-bind="attrs" v-on="on">
                                    <v-icon>mdi-information</v-icon>
                                </v-card-actions>
                            </template>
                            <span>{{ item.tooltipText }}</span>
                        </v-tooltip> -->
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <div class="mt-7">
            <span class="title-tools">Recomendaciones QNT</span>
            <FinancialTips />
        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6" @click="navigateTo('inicio')">
            VOLVER AL INICIO
        </v-btn>
    </v-container>
</template>

<script>
import Header from '/components/commons/Header.vue';
import FinancialTips from '/components/commons/tipsFinancial.vue'
import { useMainStore } from '@/store/mainStore';

export default {
    components: {
        Header, FinancialTips
    },
    data: () => ({
        localClientData: null,
        financialData: [
            {
                id: 1,
                iconName: 'promedioIngresos',
                title: 'Promedio de ingresos',
                value: 0,
                tooltipText: 'This is the average income.'
            },
            // {
            //     id: 2,
            //     iconName: 'cambioIngresos',
            //     title: 'Cambio en tus ingresos',
            //     value: 0,
            //     tooltipText: 'This is the average income.'
            // },
            // {
            //     id: 2,
            //     iconName: 'antiguedadMaxima',
            //     title: 'Antiguedad máxima',
            //     value: 0,
            //     tooltipText: 'This is the average income.'
            // },
            {
                id: 2,
                iconName: 'ingresosNetos',
                title: 'Ingresos netos',
                value: 0,
                tooltipText: 'This is the average income.'
            },
            {
                id: 3,
                iconName: 'pagosActuales',
                title: 'Pagos de tus productos actuales',
                value: 0,
                tooltipText: 'This is the average income.'
            },
            {
                id: 4,
                iconName: 'gastosBasicos',
                title: 'Gastos básicos',
                value: 0,
                tooltipText: 'This is the average income.'
            },
            {
                id: 5,
                iconName: 'recomendacionAhorro',
                title: 'Recomendación ahorro',
                value: 0,
                tooltipText: 'This is the average income.'
            },
            {
                id: 6,
                iconName: 'disponibleAhorro',
                title: 'Disponible ahorro',
                value: 0,
                tooltipText: 'This is the average income.'
            },
        ]
    }),

    computed: {
        mainStore() {
            return useMainStore();
        },

    },
    methods: {
        formatCurrency(value) {
            const numericValue = typeof value === 'number' ? value : Number(value);
            const roundedValue = Math.round(numericValue);
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(roundedValue);
        },
        navigateTo(route) {
            this.$router.push(route);
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.localClientData = newValue;
                    this.financialData[0].value = newValue ? this.formatCurrency(newValue.ingresos_mensuales) : 0;
                    // this.financialData[1].value = newValue ? this.formatCurrency(newValue.antiguedad_maxima) : 'Sin información';
                    this.financialData[1].value = newValue ? this.formatCurrency(newValue.ingresos_sin_prestaciones) : 0;
                    this.financialData[2].value = newValue ? this.formatCurrency(newValue.pagos_promedio_mes) : 0;
                    this.financialData[3].value = newValue ? this.formatCurrency(newValue.recomendacion_gastos_basicos) : 0;
                    this.financialData[4].value = newValue ? this.formatCurrency(newValue.recomendacion_pago_deudas) : 0;
                    this.financialData[5].value = newValue ? this.formatCurrency(newValue.disponible_saldar_deudas) : 0;
                }
            },
        },
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();

    },
};

</script>

<style scoped>
.svg-icon {
    height: 65px;
    width: 65px;
}

.title {
    font-size: 0.85rem !important;
    font-weight: 800;
    color: #0b2f44;
    word-wrap: break-word;
}

.text {
    font-size: 0.8rem;
    font-weight: 400;
    color: #0b2f44;
    word-wrap: break-word;
}

.title-tools {
    font-size: 1rem;
    font-weight: 600;
    color: #0b2f44;
    word-wrap: break-word;
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