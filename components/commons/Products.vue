<template>
    <v-expansion-panels v-model="panel" accordion hover-focus class="mb-5">
        <v-expansion-panel v-for="producto in sortedProducts" :key="producto.id">
            <v-expansion-panel-header
                :class="{ 'border-green': producto.estado === 'Al día', 'border-red': producto.estado !== 'Al día' }">
                <div>
                    <span id="entityname">{{ producto.entidad }}</span>
                    <br>Número de producto: {{ producto.producto }}
                    <br>Estado de producto: {{ producto.estado }}
                    <br>Saldo reportado: {{
        formatCurrency(getMaxSaldo(producto)) }}
                </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
                <div>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <strong class="product__titles">Producto:</strong>
                            <span class="product__content">{{ producto.tipo_producto }}</span>
                            <br><strong class="product__titles">Hace cuanto tienes el producto:</strong>
                            <span class="product__content">{{ daysToMonth(producto.antiguedad) }} meses</span>
                            <br><strong class="product__titles">Meses en mora:</strong>
                            <span class="product__content">{{ daysToMonth(producto.dias_en_mora) }} meses</span>
                            <br><strong class="product__titles">Cuota promedio:</strong>
                            <span class="product__content">{{ formatCurrency(producto.cuota) }}</span>
                            <br><strong class="product__titles">% del saldo de tus productos:</strong>
                            <span class="product__content">{{ producto.participacion_al_dia }}%</span>
                            <br><strong class="product__titles">% del saldo en mora:</strong>
                            <span class="product__content">{{ producto.participacion_mora }}%</span>
                        </v-col>
                    </v-row>
                </div>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import { useMainStore } from '@/store/mainStore';

export default {
    data: () => ({
        panel: 0, // Null allows all panels to be closed at once if you click the open panel
        sortedProducts: [
        ],
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    methods: {
        sortProducts(products) {
            const priorityMapping = {
                // Primer Nivel
                'CARTERA AHORRO Y VIVIENDA': 1,
                'VIVIENDA NO VIS': 1,
                'VIVIENDA PRIORITARIA': 1,
                'VIVIENDA VIS': 1,
                'CARTERA COMPANIAS DE LEASING': 1,
                'LEASING HABITACIONAL NO VIS': 1,
                'LEASING HABITACIONAL VIS': 1,
                'LEASING INMOBILIARIO': 1,

                // Segundo Nivel
                'COLECTIVA': 2,
                'FIDUCIARIA': 2,
                'LINEA VERDE - SOSTENIBLE': 2,
                'FIDEICOMISO': 2,
                'FINANCIACION MONEDA EXTRANJERA': 2,
                'OFICIAL': 2,
                'CART. COOP DE AHORRO Y CREDITO': 2,
                'CARTERA CORPORAC. FINANCIERAS': 2,
                'FOMENTO MUNICIPAL': 2,
                'FOMENTO DEPARTAMENTAL': 2,
                'FINAGRO': 2,
                'LEASING APALANCADO': 2,
                'LEASING FINANCIERO': 2,
                'LEASING OPERATIVO': 2,
                'ESTATAL': 2,
                'CARTERA C/IAS. FINANC. CIAL.': 2,
                'REDESCUENTO': 2,
                'FACTORING': 2,
                'ORDINARIO': 2,

                // Tercer Nivel
                'CARTERA MOTOS': 3,
                'CARTERA MOTOR DIGITAL': 3,
                'CARTERA VEHICULO': 3,
                'CARTERA VEHICULO DIGITAL': 3,
                'LEASING VEHICULAR': 3,
                'CARTERA AUTOMOTRIZ': 3,
                'MANTENIMIENTO Y REPARACIÓN DE VEHÍCULOS AUTOMOTORES': 3,
                'COMERCIO DE PARTES, PIEZAS (AUTOPARTES) Y ACCESORIOS (LUJOS) PARA VEHÍCULOS AUTOMOTORES': 3,
                'COMERCIO DE MOTOCICLETAS Y DE SUS PARTES, PIEZAS Y ACCESORIOS': 3,
                'COMPAÑIAS LLANTERAS': 3,

                // Cuarto Nivel
                'CARTERA BANCARIA': 4,
                'CARTERA BANCARIA DIGITAL': 4,
                'FINTECH': 4,
                'CARTERA LIBRANZA': 4,
                'CARTERA LIBRANZA DIGITAL': 4,
                'LIBRANZA EMPLEADOS': 4,
                'LIBRANZA PENSIONADOS': 4,
                'LIBRANZA ROTATIVA': 4,
                'LIBRANZA COMPRA CARTERA': 4,
                'CREDITOS DE CONSUMO': 4,

                // Quinto Nivel
                'CARTERA SOBREGIRO': 5,
                'TARJETAS DE CRÉDITO': 5,
                'TARJETAS DE CRÉDITO DIGITAL': 5,
                'CARTERA BANCARIA ROTATIVA': 5,
                'CARTERA BANCARIA ROTATIVA DIGITAL': 5,
            };
            // Ordenar primero por estado y luego por antigüedad de la mora de mayor a menor
            return products.sort((a, b) => {
                // Colocar productos con saldo negativo al final, independientemente del estado
                if (a.saldo_total < 0 && b.saldo_total >= 0) return 1;
                if (b.saldo_total < 0 && a.saldo_total >= 0) return -1;

                // Colocar productos no 'Al día' por encima de los 'Al día'
                if (a.estado !== 'Al día' && b.estado === 'Al día') return -1;
                if (a.estado === 'Al día' && b.estado !== 'Al día') return 1;

                // Si ambos productos no están 'Al día', utilizar prioridad y luego saldo
                if (a.estado !== 'Al día' && b.estado !== 'Al día') {
                    if (priorityMapping[a.tipo_producto] !== priorityMapping[b.tipo_producto]) {
                        return priorityMapping[a.tipo_producto] - priorityMapping[b.tipo_producto];
                    }
                    if (a.dias_en_mora !== b.dias_en_mora) {
                        return b.dias_en_mora - a.dias_en_mora;
                    }
                    return b.saldo_total - a.saldo_total;
                }

                // Para productos 'Al día', ordenar solo por saldo total
                return b.saldo_total - a.saldo_total;
            });
        },

        getMaxSaldo(producto) {
            // Retorna el mayor valor entre saldo_total y valor_total_sf
            return Math.max(producto.saldo_total || 0, producto.valor_total_sf || 0);
        },

        compareSaldo(saldoA, saldoB) {
            // Considera los saldos negativos como menores que los positivos
            if (saldoA < 0 && saldoB >= 0) return 1;
            if (saldoB < 0 && saldoA >= 0) return -1;
            return saldoB - saldoA; // De lo contrario, ordena de mayor a menor saldo
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(value);
        },
        daysToMonth(days) {
            if (days === 0) return 'Tu producto está al día';
            return Math.round(days / 30);
        }
    },
    // created() {
    //     this.sortedProducts = this.sortProducts(this.sortedProducts);
    // },
    watch: {
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.sortedProducts = newValue ? this.sortProducts(newValue) : [];

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
.border-green {
    border-left: 5px solid #62ac21;
}

.border-red {
    border-left: 5px solid #ff1f53;
}

#entityname {
    font-weight: bold;
    color: #0b2f44;
}

.product__titles {
    color: #6e7173;
    font-weight: 500;

}

.product__content {
    color: #6e7173;
    font-weight: 400;
}
</style>
