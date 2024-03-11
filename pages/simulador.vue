<template>
    <v-container class="pa-4 main-container">
        <Header> </Header>
        <div>
            <v-btn icon color="#0b2f44" @click="navigateTo('inicio')" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;"> En esta sección podrás simular como seria el comportamiento de
                tu perfil crediticio.
            </p>
        </div>
        <div>
            <v-card v-for="(product, index) in products" :key="index" class="mb-3 step-1">
                <v-row no-gutters align="center" class="pa-4">

                    <v-row align="center">

                        <v-col cols="1">
                            <v-checkbox v-model="product.selected"
                                @change="showAlert(product.selected, index)"></v-checkbox>
                        </v-col>

                        <v-col class="product-title">{{ product.name }}</v-col>

                    </v-row>

                    <v-col cols="12" class="">
                        <v-row>
                            <v-col>
                                <div class="text-product">Saldo reportado: <span class="text-normal">${{ product.balance
                                }}</span></div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6" class="d-flex ">
                                <span class="mr-2 step-2">Cantidad cuotas:</span>
                                <v-select class="cuota-step" v-model="product.selectedQuota" :items="quotas" dense
                                    hide-details outlined></v-select>
                            </v-col>
                            <v-col cols="6" class="d-flex align-center">
                                <span class="mr-2 text-product">Desde:</span>
                                <v-select class="step-3" v-model="product.selectedDate" :items="dates" dense hide-details
                                    outlined></v-select>
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- Tercera columna para el botón -->
                    <v-col cols="12" class="d-flex justify-center align-center mt-3 como-solucionar-step">
                        <nuxt-link :to="`/productos/${product.id_producto}`" class="button-text">
                            <v-btn color="#62ac21" dark>
                                ¿Cómo solucionar deuda?
                            </v-btn>
                        </nuxt-link>
                    </v-col>

                </v-row>
                <v-alert v-if="showAlerts[index]" type="warning" text>
                    Si tienes obligaciones en mora, afectará tus posibilidades de acceder a créditos, incluso con un
                    buen puntaje. Considera simularlas para obtener un diagnóstico más completo.
                </v-alert>
            </v-card>
        </div>
        <div class="d-flex justify-center align-center step-4">
            <v-card class="mx-auto mt-1"
                :style="{ background: 'linear-gradient(to bottom, #00263C 0%, #005a7d 0%, #00A2E4 49%)' }">
                <!-- <v-card-title class="text-h5" style="color: white;">
                    Mi Gráfico
                </v-card-title> -->
                <v-card-text>
                    <p class="mt-2"
                        style="color: white; font-size: 1.2em; font-weight: 400; text-align: center; line-break:auto;">
                        Conoce la proyección de
                        tu puntaje de
                        crédito una vez
                        comiences a pagar tus
                        obligaciones. </p>
                    <!-- <p style="color: white; font-size: 1.2em; font-weight: 400; text-align: center; line-break:auto;">
                        Puntaje actual: {{ this.score }} Puntaje meta: {{ this.goalScore }}</p> -->
                    <div class="chart-container" style="position: relative; height:45vh; width:85vw">
                        <canvas ref="creditScoreChart"></canvas>
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <div class="mt-7">
            <span class="title-tools">Recomendaciones QNT</span>
            <FinancialTips />
        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6 step-5" @click="navigateTo('presupuesto')">
            CONTINUAR
        </v-btn>
    </v-container>
</template>
<script>
import { useMainStore } from '@/store/mainStore';
import Header from '/components/commons/Header.vue';
import FinancialTips from '/components/commons/tipsFinancial.vue'

export default {
    components: {
        Header, FinancialTips
    },
    data: () => ({
        productos: null,
        products: [],
        quotas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        dates: [],
        showAlerts: [],
        score: null,
        goalScore: null,
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    created() {
        this.loadAndFilterProducts();
        this.initializeWatchers();
        this.setNext24Months();
    },
    methods: {
        loadAndFilterProducts() {
            const storedProducts = this.productos || [];

            const filteredProducts = storedProducts.filter(product => product.estado !== 'Al día').map(product => ({
                ...product,
                name: product.entidad,
                balance: product.saldo_total.toLocaleString(),
                selected: true,
                selectedQuota: 1, // Valor inicial para la cuota seleccionada
                selectedDate: null, // Valor inicial para la fecha seleccionada
                puntaje_por_cuota: product.puntaje_por_cuota
            }));
            filteredProducts.sort((a, b) => b.saldo_total - a.saldo_total);

            this.products = filteredProducts;

            this.showAlerts = new Array(filteredProducts.length).fill(false);

            this.calculateTotalScore();

        },
        setNext24Months() {
            const storedProducts = this.productos;
            const fechaDiagnostico = storedProducts && storedProducts.fecha_diagnostico
                ? new Date(storedProducts.fecha_diagnostico)
                : new Date();

            fechaDiagnostico.setDate(1); // Esto evita problemas al final del mes
            fechaDiagnostico.setHours(0, 0, 0, 0); // Establece la hora al comienzo del día

            this.dates = Array.from({ length: 24 }).map((_, i) => {
                const futureDate = new Date(fechaDiagnostico);
                futureDate.setMonth(fechaDiagnostico.getMonth() + i);

                const month = futureDate.toLocaleString('es', { month: 'short' }).replace(/\./g, '');
                const year = futureDate.toLocaleString('es', { year: 'numeric' }).slice(-2);

                return month.charAt(0).toUpperCase() + month.slice(1) + '/' + year;
            });

            this.products.forEach((product) => {
                product.selectedDate = this.dates[0];
            });
        },
        showAlert(selected, index) {
            this.$set(this.showAlerts, index, !selected);
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        calculateScoreForQuota(puntajePorCuota, selectedQuota) {
            return puntajePorCuota / selectedQuota;

        },
        calculateTotalScore() {
            const totalScore = this.products
                .filter(product => product.selected) // Asegúrate de que el producto esté seleccionado
                .reduce((total, product) => {
                    return total + this.calculateScoreForQuota(product.puntaje_por_cuota, product.selectedQuota);
                }, 0);


            return totalScore;
        },
        initializeWatchers() {
            for (let i = 0; i < this.products.length; i++) {
                this.$watch(
                    () => this.products[i].selectedQuota,
                    (newVal, oldVal) => {
                        if (newVal !== oldVal) {
                            this.calculateTotalScore();
                        }
                    }
                );
            }
        },
        findIntersection() {
            const scoreData = this.calculateScoreData();
            const goalData = Array(this.dates.length).fill(this.goalScore);
            for (let i = 0; i < scoreData.length; i++) {
                if (scoreData[i] >= this.goalScore) {
                    return { x: this.dates[i], y: this.goalScore };
                }
            }
            return null;
        },
        setupChart() {
            const ctx = this.$refs.creditScoreChart.getContext('2d');
            const intersection = this.findIntersection();
            const intersectionDataset = intersection ? [{
                label: 'Objetivo Alcanzado',
                data: [intersection],
                borderColor: '#47cc31',
                backgroundColor: '#ffffff',
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false,
                pointBorderColor: '#39a327',
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                showLine: false,
            }] : [];
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.generateMonthLabels(), // Asegura que esto genera las etiquetas correctas
                    datasets: [{
                        label: 'Puntaje Meta',
                        // Usa un array lleno del valor de goalScore para la longitud de this.dates
                        data: Array(this.dates.length).fill(this.goalScore),
                        borderColor: '#FF0000',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderWidth: 5,
                        borderDash: [8, 8],
                        pointRadius: 0,
                        fill: false,
                        color: '#FFFFFF',
                    }, {
                        label: 'Proyección simulada',
                        data: this.calculateScoreData(),
                        borderColor: '#00B3FF',
                        pointRadius: function (context) {
                            var index = context.dataIndex;
                            var count = context.dataset.data.length - 1;
                            return index === 0 || index === count ? 5 : 0;
                        },
                        borderWidth: 8,
                        pointBackgroundColor: '#FFFFFF',
                        pointBorderColor: '#00B3FF',
                        pointBorderWidth: 5,
                        fill: false,
                    },
                    ].concat(intersectionDataset),
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: 900,
                                suggestedMax: 900,
                                stepSize: 100, // El tamaño del paso entre los rangos de puntajes
                                fontColor: '#FFFFFF',
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.2)',
                            }
                        }],
                        xAxes: [{
                            type: 'category',
                            labels: this.dates, // Usar las fechas calculadas como etiquetas
                            stepSize: 1,
                            ticks: {
                                fontColor: '#FFFFFF',
                            },
                            gridLines: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                            beginAtZero: true,
                        }],
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            fontColor: '#FFFFFF',
                            fontSize: 15,
                            padding: 10,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 10
                        }
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += tooltipItem.yLabel;
                                return label;
                            }
                        },
                        fontColor: '#00263C',
                        backgroundColor: '#00263C',
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    chartArea: {
                        // backgroundColor: '#00263C',

                    },
                },


            });

            Chart.plugins.register({
                beforeDraw: function (chart) {
                    if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                        var ctx = chart.chart.ctx;
                        var chartArea = chart.chartArea;

                        ctx.save();
                        ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                        ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                        ctx.restore();
                    }
                },

            });

        },
        updateChart() {
            if (this.chart) {
                const scoreData = this.calculateScoreData();
                const intersection = this.findIntersection(scoreData);

                // Actualizar los datos de las proyecciones simuladas.
                this.chart.data.datasets[1].data = scoreData;

                // Actualizar el conjunto de datos de la intersección si existe una.
                if (intersection) {
                    if (this.chart.data.datasets.length > 2) {
                        this.chart.data.datasets[2].data = [intersection];
                    } else {
                        // Si el conjunto de datos de intersección no existe, lo agregamos.
                        this.chart.data.datasets.push({
                            label: 'Objetivo Alcanzado',
                            data: [intersection],
                            borderColor: '#FF0000',
                            backgroundColor: '#FFFF00',
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            fill: false,
                            pointBorderColor: '#FFFF00',
                            pointBackgroundColor: '#FFFF00',
                            pointBorderWidth: 2,
                            pointHoverBorderWidth: 2,
                            showLine: false,
                        });
                    }
                } else if (this.chart.data.datasets.length > 2) {
                    // Si no hay intersección y el conjunto de datos existe, lo eliminamos.
                    this.chart.data.datasets.pop();
                }

                // Reflejar los cambios en el gráfico.
                this.chart.update();
            }
        },
        // calculateScoreData() {
        //     let initialScore = this.score
        //     let monthlyScores = new Array(this.dates.length).fill(initialScore);

        //     this.products.forEach(product => {
        //         if (product.selected) {
        //             let startMonthIndex = this.dates.indexOf(product.selectedDate);
        //             let endMonthIndex = startMonthIndex + product.selectedQuota;

        //             for (let i = startMonthIndex; i < endMonthIndex && i < this.dates.length; i++) {
        //                 monthlyScores[i] += this.calculateScoreForQuota(product.puntaje_por_cuota, product.selectedQuota);
        //             }
        //         }
        //     });

        //     for (let i = 1; i < monthlyScores.length; i++) {
        //         monthlyScores[i] = monthlyScores[i - 1] + (monthlyScores[i] - initialScore);
        //     }

        //     //Redondear sin decimales
        //     monthlyScores = monthlyScores.map(score => Math.round(score));

        //     return monthlyScores;
        // },
        calculateScoreData() {
            let initialScore = this.score;
            let monthlyScores = new Array(this.dates.length).fill(initialScore);

            this.products.forEach(product => {
                if (product.selected) {
                    let startMonthIndex = this.dates.indexOf(product.selectedDate) + 1; // Comenzamos desde el mes siguiente
                    let endMonthIndex = startMonthIndex + product.selectedQuota;

                    for (let i = startMonthIndex; i < endMonthIndex && i < this.dates.length; i++) {
                        monthlyScores[i] += this.calculateScoreForQuota(product.puntaje_por_cuota, product.selectedQuota);
                    }
                }
            });

            for (let i = 1; i < monthlyScores.length; i++) {
                monthlyScores[i] = monthlyScores[i - 1] + (monthlyScores[i] - initialScore);
            }

            monthlyScores = monthlyScores.map(score => Math.round(score));

            return monthlyScores;
        },

        dateMatchesProductStart(dateLabel, product) {
            const [month, year] = dateLabel.split('/');
            const startDate = new Date(`${month} 1 ${year}`);
            const productStartDate = new Date(product.selectedDate);
            return startDate >= productStartDate;
        },
        generateMonthLabels() {
            let labels = [];
            let maxQuotas = Math.max(...this.products.map(p => p.selectedQuota));
            let startDate = this.products.fecha_diagnostico ? new Date(this.products.fecha_diagnostico) : new Date();

            for (let i = 0; i <= maxQuotas; i++) {
                let newDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                labels.push(`${newDate.toLocaleString('default', { month: 'short' })}/${newDate.getFullYear()}`);
            }

            return labels;
        },



    },
    watch: {
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.productos = newValue;
                    this.score = newValue[0].puntaje_crediticio || 0; // Puntaje inicial
                    this.goalScore = newValue[0].puntaje_objetivo || 0; // Puntaje meta
                    // this.updateChart();
                }
            },
        },
        products: {
            handler() {
                this.calculateTotalScore();
            },
            deep: true
        },
        products: {
            handler: 'updateChart',
            deep: true
        },
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();
        this.setupChart();
        this.updateChart();

        introJs().setOptions({
            steps: [
                {
                    title: "Simulador",
                    intro: "En esta sección podrás simular como seria el comportamiento de tu perfil crediticio."
                },
                {
                    element: document.querySelector('.step-1'),
                    title: "Selecciona tus deudas",
                    intro: "Selecciona las deudas que deseas simular, recuerda que, si no simulas algún producto, puede que no alcances tu objetivo financiero."
                },
                {
                    element: document.querySelector('.cuota-step'),
                    title: "Selecciona la cantidad de cuotas",
                    intro: "Selecciona la cantidad de cuotas que deseas simular."
                },
                {
                    element: document.querySelector('.step-3'),
                    title: "Selecciona el mes en el que deseas comenzar a pagar",
                    intro: "Selecciona el mes en el cual comenzarías a pagar este producto para realizar una proyección adecuada."
                },
                {
                    element: document.querySelector('.step-4'),
                    title: "Proyección de tu puntaje de crédito",
                    intro: "En esta proyección puedes visualizar en cuanto tiempo lograras alcanzar tu objetivo financiero"
                },
                {
                    element: document.querySelector('.step-5'),
                    intro: "¡Continua con tu presupuesto!",
                    position: 'top',

                }

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
    },
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
    padding: 2px !important;
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

.chart-container {
    max-width: 1100px;
}

@media (min-width: 960px) {
    .main-container {
        max-width: 1200px;
        /* Ajusta el ancho máximo del contenedor */
        margin: auto;
        /* Centra el contenedor */
    }


    .chart-container {
        height: 60vh;
        /* Ajusta la altura del contenedor del gráfico */
        width: 90vw;
        /* Ajusta el ancho del contenedor del gráfico */
    }
}
</style>