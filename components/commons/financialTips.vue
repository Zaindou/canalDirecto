<template>
    <v-container>
        <!-- Carrusel de Tips con v-slide-group -->
        <v-slide-group v-model="slide">
            <v-slide-item v-for="tip in tips" :key="tip.id" class="tip-card">
                <v-card class="ma-2 pa-1 elevation-4 tip-card-content">
                    <v-card-title class="headline title">{{ tip.title }}</v-card-title>
                    <v-card-text class="text">{{ tip.message }}</v-card-text>
                </v-card>
            </v-slide-item>
        </v-slide-group>
    </v-container>
</template>

<script>
import { useMainStore } from '@/store/mainStore';
export default {
    data: () => ({
        slide: 0,
        localClientData: null,
        tips: [
            {
                id: 1,
                title: 'Promedio ingresos',
                message: 'Optimiza tus gastos diarios y considera estrategias de ahorro y saldar tus deudas para mejorar tu estabilidad financiera.',
                range: '0 - 1.500.000',
            },
            {
                id: 2,
                title: 'Promedio ingresos',
                message: 'Tus ingresos están en línea con el promedio nacional. Busca opciones de crédito responsables y planifica metas financieras',
                range: '1.500.000 - 2.500.000',
            },
            {
                id: 3,
                title: 'Promedio ingresos',
                message: 'Con tus ingresos actuales, puedes acceder a multiples ofertas de crédito. Asegúrate de mantener un buen historial crediticio para mejores oportunidades, no te sobre endeudes.',
                range: '2.500.001 - 4.500.000',
            },
            {
                id: 4,
                title: 'Promedio ingresos',
                message: 'Tus ingresos te ofrecen acceso a una variedad de opciones financieras. Considera estrategias de ahorro, inversiones a largo plazo ¡No te sobre endeudes!',
                range: '4.500.001 - 8.000.000',
            },
            {
                id: 5,
                title: 'Promedio ingresos',
                message: 'Estás en una posición financiera sólida. Explora inversiones, diversifica tus activos y considera estrategias para maximizar tu crecimiento financiero',
                range: '8.000.001 - 15.000.000',
            },
            {
                id: 6,
                title: 'Promedio ingresos',
                message: 'Tus ingresos te brindan amplias oportunidades. Busca asesoramiento financiero para optimizar inversiones y gestionar tu patrimonio de manera efectiva',
                range: '15.000.001 - 30.000.000',
            },
        ],
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    methods: {
        filteredTips() {
            const { ingresos } = this.localClientData.ingresos_mensuales;
            if (ingresos <= 1500000) {
                return this.tips[0].message;
            }
            if (ingresos > 1500000 && ingresos <= 2500000) {
                return this.tips[1].message;
            }
            if (ingresos > 2500000 && ingresos <= 4500000) {
                return this.tips[2].message;
            }
            if (ingresos > 4500000 && ingresos <= 8000000) {
                return this.tips[3].message;
            }
            if (ingresos > 8000000 && ingresos <= 15000000) {
                return this.tips[4].message;
            }
            if (ingresos > 15000000 && ingresos <= 30000000) {
                return this.tips[5].message;
            }
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.localClientData = newValue;
                }
            },
        },
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();
        console.log('mainStore.clientData', mainStore.clientData);
    },
};

</script>

<style scoped>
.tip-card {
    max-width: 270px;
    /* Establece un ancho máximo para las tarjetas */
}

.tip-card-content {
    border-radius: 8px;
    /* Para bordes redondeados en el card */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Sombreado suave para el card */
}

.title {
    color: #0b2f44;
    font-size: 1rem !important;
    font-weight: 600;
    line-height: normal;
    word-wrap: break-word !important;
}

.text {
    color: #666666;
    line-height: normal;
    word-wrap: break-word;
}
</style>

