<template>
    <v-container>
        <!-- Carrusel de Tips con v-slide-group -->
        <v-slide-group v-model="slide">
            <v-slide-item v-for="tip in filteredTips" :key="tip.id" class="tip-card">
                <v-card class="ma-2 pa-1 elevation-4 tip-card-content">
                    <v-card-title class="headline title">{{ tip.title }}</v-card-title>
                    <v-card-text class="text">{{ tip.message }}</v-card-text>
                </v-card>
            </v-slide-item>
        </v-slide-group>
        <div class="custom-bullets">
            <div v-for="(tip, index) in filteredTips" :key="tip.id" :class="{ 'active': slide === index }" class="bullet"
                @click="slide = index">

            </div>
        </div>
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
                type: 'ingresos',
                range: '0 - 1500000',
            },
            {
                id: 2,
                title: 'Promedio ingresos',
                message: 'Tus ingresos están en línea con el promedio nacional. Busca opciones de crédito responsables y planifica metas financieras',
                type: 'ingresos',
                range: '1500000 - 2500000',
            },
            {
                id: 3,
                title: 'Promedio ingresos',
                message: 'Con tus ingresos actuales, puedes acceder a multiples ofertas de crédito. Asegúrate de mantener un buen historial crediticio para mejores oportunidades, no te sobre endeudes.',
                type: 'ingresos',
                range: '2500001 - 4500000',
            },
            {
                id: 4,
                title: 'Promedio ingresos',
                message: 'Tus ingresos te ofrecen acceso a una variedad de opciones financieras. Considera estrategias de ahorro, inversiones a largo plazo ¡No te sobre endeudes!',
                type: 'ingresos',
                range: '4500001 - 8000000',
            },
            {
                id: 5,
                title: 'Promedio ingresos',
                message: 'Estás en una posición financiera sólida. Explora inversiones, diversifica tus activos y considera estrategias para maximizar tu crecimiento financiero',
                type: 'ingresos',
                range: '8000001 - 15000000',
            },
            {
                id: 6,
                title: 'Promedio ingresos',
                message: 'Tus ingresos te brindan amplias oportunidades. Busca asesoramiento financiero para optimizar inversiones y gestionar tu patrimonio de manera efectiva',
                range: '15000001 - 30000000',
            },
            {
                id: 7,
                title: 'Gastos básicos',
                message: 'Prioriza tus necesidades básicas. Comparte gastos con tu familia para maximizar recursos y considera la posibilidad de crear un presupuesto conjunto.',
                type: 'gastos_basicos',
                range: '0 - 1500000',
            },
            {
                id: 8,
                title: 'Gastos básicos',
                message: 'Ajusta tus gastos esenciales con sensatez. Explora opciones de transporte compartido y planifica compras familiares para maximizar el presupuesto.',
                type: 'gastos_basicos',
                range: '1500001 - 2500000',

            },
            {
                id: 9,
                title: 'Gastos básicos',
                message: 'Mantén un equilibrio entre calidad y costo. Busca eficiencias en tus gastos básicos y considera formas de optimizar tus compras cotidianas.',
                type: 'gastos_basicos',
                range: '2500001 - 4500000',
            },
            {
                id: 10,
                title: 'Gastos básicos',
                message: 'Optimiza tus gastos básicos. Examina opciones de vivienda y transporte que ofrezcan valor a largo plazo, y mantén un control efectivo de tus finanzas. Crea portafolios de ahorro',
                type: 'gastos_basicos',
                range: '4500001 - 8000000',
            },
            {
                id: 11,
                title: 'Gastos básicos',
                message: 'Prioriza la eficiencia y calidad en tus gastos básicos. Considera inversiones a largo plazo, como la vivienda propia, y sigue optimizando tu presupuesto.',
                type: 'gastos_basicos',
                range: '8000001 - 15000000',
            },
            {
                id: 12,
                title: 'Gastos básicos',
                message: 'Enfócate en la calidad de vida. Busca eficiencias en tus gastos básicos y aprovecha oportunidades de inversión para aumentar tu patrimonio',
                type: 'gastos_basicos',
                range: '15000001 - 30000000',
            },


        ],
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
        filteredTips() {
            if (!this.localClientData) {
                return [];
            }
            const ingresos = this.localClientData.ingresos_mensuales;
            const gastosBasicos = this.localClientData.recomendacion_gastos_basicos;
            const productosActivos = this.localClientData.productos_activos;
            const productosMora = this.localClientData.productos_mora;
            const sumaCuotasPromedio = this.localClientData.pagos_promedio_mes ? this.localClientData.pagos_promedio_mes : 0;
            const disponibleAhorro = this.localClientData.disponible_saldar_deudas;



            const tipsByType = this.tips.reduce((acc, tip) => {
                if (!acc[tip.type]) {
                    acc[tip.type] = [];
                }
                acc[tip.type].push(tip);
                return acc;
            }, {});

            const tipsCondiciones = Object.values(tipsByType).map(tips => {
                return tips.find(tip => {
                    const [min, max] = tip.range.split(' - ').map(Number);
                    if (tip.type === 'ingresos') {
                        return ingresos >= min && ingresos <= max;
                    } else if (tip.type === 'gastos_basicos') {
                        return gastosBasicos >= min && gastosBasicos <= max;
                    }
                    return false;
                });
            }).filter(tip => tip !== undefined);

            if (productosActivos > 0) {
                let mensajeProductosActuales;
                if (productosMora > 0 && productosActivos > productosMora) {
                    mensajeProductosActuales = `Tienes ${productosActivos - productosMora} obligaciones que tienes al día, debes continuar los pagos de estas y enfocarte en ${productosMora} obligaciones que presentan mora, para mejorar tu perfil de crédito.`;
                }
                else if (productosMora > 0) {
                    mensajeProductosActuales = `Tienes ${productosMora} obligaciones en mora, las cuales debes poner al día para mejorar tu puntaje de crédito. Estamos aquí para asesorarte.`;
                } else {
                    mensajeProductosActuales = `Tienes ${productosActivos} obligaciones al día, en la cual estás pagando $${sumaCuotasPromedio} en promedio. Recuerda las fechas de corte de tus productos para no incurrir en moras.`;
                }
                const tipProductoActual = {
                    id: 'productos_actuales',
                    title: 'Pago de productos actuales',
                    message: mensajeProductosActuales,
                    type: 'productos_actuales',
                };
                tipsCondiciones.push(tipProductoActual);
            }

            if (productosMora === 0) {
                const tipsDisponible = {
                    id: 'disponible',
                    title: 'Disponible',
                    message: `Te sugerimos invertir $${disponibleAhorro} para crear tu futuro. Sé el arquitecto de tu éxito financiero. ¡Haz que cada peso cuente!`,
                    type: 'disponible',
                };
                tipsCondiciones.push(tipsDisponible);
            } else if (productosMora > 0) {
                const tipsDisponible = {
                    id: 'disponible',
                    title: 'Disponible',
                    message: `Te sugerimos destinar $${disponibleAhorro} para saldar tus deudas y despertar tu libertad financiera. Cada pago es un paso hacia tu bienestar. ¡Estamos para asesorarte!`,
                    type: 'disponible',
                };
                tipsCondiciones.push(tipsDisponible);
            } else if (productosMora === 0 && disponibleAhorro < 0) {
                const tipsDisponible = {
                    id: 'disponible',
                    title: 'Disponible',
                    message: `Tienes un desbalance entre tus ingresos, evalua disminuir tus deudas o ampliar los plazos de las mismas, para reducir las cuotas.`,
                    type: 'disponible',
                };
                tipsCondiciones.push(tipsDisponible);
            } else if (productosMora > 0 && disponibleAhorro < 0) {
                const tipsDisponible = {
                    id: 'disponible',
                    title: 'Disponible',
                    message: `Tienes un desbalance entre tus ingresos y tus deudas, te recomendamos reestructurarlas y para eso estamos para asesorarte.`,
                    type: 'disponible',
                };
                tipsCondiciones.push(tipsDisponible);
            }

            return tipsCondiciones;
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.custom-bullets {
    display: flex;
    justify-content: center;
    margin: 10px 0;
}

.bullet {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background-color: #D9D9D9;
    margin: 0 4px;
    cursor: pointer;
}

.bullet.active {
    background-color: #00A2E4;
}
</style>

