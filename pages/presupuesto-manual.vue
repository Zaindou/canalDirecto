<template>
    <v-container class="pa-7">
        <Header></Header>
        <div>
            <v-btn icon color="#0b2f44" @click="goBack" class="mb-1 ml-3">
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
                                <img :src="`/icons/${item.iconName}.svg`" class="mr-2 svg-icon" />
                                <span class="title">{{ item.title }}</span>
                            </div>
                            <span class="text">{{ item.value }}</span>
                        </v-card-title>

                        <!-- Sección para tooltip si es necesario -->
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import Header from '~/components/commons/Header.vue'
import { useMainStore } from '@/store/mainStore';

export default {
    components: {
        Header
    },
    data: () => ({
        localClientData: null,
        financialData: [
            {
                id: 1,
                iconName: 'promedioIngresos', // You will need to replace this with actual SVG data
                title: 'Promedio de ingresos:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
            {
                id: 2,
                iconName: 'ingresosNetos', // You will need to replace this with actual SVG data
                title: 'Ingresos netos:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
            {
                id: 3,
                iconName: 'pagosActuales', // You will need to replace this with actual SVG data
                title: 'Pagos de tus productos actuales:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
            {
                id: 4,
                iconName: 'gastosBasicos', // You will need to replace this with actual SVG data
                title: 'Recomendación gastos básicos:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
            {
                id: 5,
                iconName: 'recomendacionAhorro', // You will need to replace this with actual SVG data
                title: 'Recomendación ahorro:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
            {
                id: 6,
                iconName: 'disponibleAhorro', // You will need to replace this with actual SVG data
                title: 'Disponible ahorro / pago de deudas:',
                value: 0,
                tooltipText: 'This is the average income.' // Replace with your tooltip text
            },
        ]
    }),

    computed: {
        mainStore() {
            return useMainStore();
        },

    },
    methods: {
        goBack() {
            this.$router.push('/inicio');
        },
        formatCurrency(value) {
            const numericValue = typeof value === 'number' ? value : Number(value);
            const roundedValue = Math.round(numericValue);
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(roundedValue);
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.localClientData = newValue;
                    this.financialData[0].value = newValue ? this.formatCurrency(newValue.ingresos_mensuales) : 0;
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
    width: 50px;
    height: 50px;
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
</style>