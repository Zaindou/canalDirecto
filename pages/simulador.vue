<template>
    <v-container class="pa-4">
        <Header> </Header>
        <div>
            <v-btn icon color="#0b2f44" @click="goBack" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;"> En esta sección podrás simular como seria el comportamiento de
                tu perfil crediticio.
            </p>
        </div>
        <div class="mb-6 mt-6">
            <v-card color="#c8e6c9">
                <v-row>
                    <v-col cols="2" class="d-flex justify-center align-center">
                        <img src="/alert-icon.svg" alt="Alert Icon" />
                    </v-col>
                    <v-col cols="10">
                        <v-card-text style="color: #00263C !important;">
                            Para realizar una simulación debes seleccionar la cantidad de cuotas
                            que consideres poder pagar tus obligaciones y desde la fecha que
                            comenzarás a pagar. Recuerda que la única manera para mejorar tu
                            puntaje crediticio es limpiando tus obligaciones en mora.
                        </v-card-text>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <div>
            <!-- Iteramos sobre cada producto para crear una tarjeta independiente -->
            <v-card v-for="(product, index) in products" :key="index" class="mb-3">
                <v-row no-gutters align="center" class="pa-4">

                    <!-- Primera columna para el checkbox del producto -->
                    <!-- <v-col cols="1" class="d-flex">
                        <v-checkbox v-model="product.selected" @change="showAlert(product.selected, index)"></v-checkbox>
                    </v-col> -->


                    <!-- Segunda columna para la información del producto y opciones -->
                    <v-col cols="12" class="">
                        <v-row>
                            <v-col><v-checkbox class="justify-start" v-model="product.selected"
                                    @change="showAlert(product.selected, index)"></v-checkbox>
                                <div class="product-title">{{ product.name }}</div>
                                <div class="text-product">Saldo reportado: <span class="text-normal">${{ product.balance
                                }}</span></div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6" class="d-flex ">
                                <span class="mr-2 text-product">Cantidad cuotas:</span>
                                <v-select v-model="product.selectedQuota" :items="quotas" dense hide-details
                                    outlined></v-select>
                            </v-col>
                            <v-col cols="6" class="d-flex align-center">
                                <span class="mr-2 text-product">Desde:</span>
                                <v-select v-model="product.selectedDate" :items="dates" dense hide-details
                                    outlined></v-select>
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- Tercera columna para el botón -->
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <v-btn color="#62ac21" class="button-text" dark>
                            <template v-if="$vuetify.breakpoint.xsOnly">
                                Solucionar deuda <!-- Texto más corto para móviles -->
                            </template>
                            <template v-else>
                                Cómo solucionar deuda <!-- Texto completo -->
                            </template>
                        </v-btn>
                    </v-col>

                </v-row>
                <v-alert v-if="showAlerts[index]" type="warning" text>
                    Si tienes obligaciones en mora, afectará tus posibilidades de acceder a créditos, incluso con un
                    buen puntaje. Considera simularlas para obtener un diagnóstico más completo.
                </v-alert>
            </v-card>
        </div>
        <Chart class="d-flex justify-center align-center chart"> </Chart>
    </v-container>
</template>
<script>
import { useMainStore } from '@/store/mainStore';
import Header from '/components/commons/Header.vue';
import Chart from '/components/commons/Chart.vue';


export default {
    components: {
        Header, Chart
    },
    data: () => ({
        products: [
            {
                name: 'BANCO DAVIVIENDA S.A',
                balance: '10.000.000',
                selected: false,
                selectedQuota: 1,
                selectedDate: null
            },
            {
                name: 'BANCO UNIÓN',
                balance: '8.654.222',
                selected: false,
                selectedQuota: 1,
                selectedDate: null
            },
            {
                name: 'BANCOLOMBIA',
                balance: '12.645.200',
                selected: false,
                selectedQuota: 1,
                selectedDate: null
            }
        ],
        quotas: [1, 2, 3, 4, 5, 6],
        dates: [
            'Ene-24',
            'Feb-24',
            'Mar-24'
        ],
        showAlerts: [],
    }),
    created() {
        this.products = this.products.map(product => ({ ...product, selected: true }));
        this.showAlerts = this.products.map(() => false);
    },
    methods: {
        showAlert(selected, index) {
            this.$set(this.showAlerts, index, !selected);
        }
    }
};
</script>

<style scoped>
.product-title {
    color: #0b2f44;
    font-weight: 600;
    font-size: 1rem !important;
}

.text-product {
    color: #666666;
    font-weight: 500;
    font-size: 0.9rem !important;
}

.text-normal {
    font-weight: 400;
    font-size: 0.9rem !important;
}

.button-text {
    white-space: nowrap;
}

.col {
    padding: 8px !important;
}

.v-text-field fieldset,
.v-text-field .v-input__control,
.v-text-field .v-input__slot {
    border-radius: 10px !important;
}

.chart {
    padding: 0 0 0 0 !important;
}

/* Estilos específicos para móviles */
@media (max-width: 599px) {
    .button-text-mobile {
        font-size: 0.62rem;
        max-width: 160px;
        /* Limita el ancho máximo del botón */
        padding: 0.5rem 0.5rem;
    }
}
</style>