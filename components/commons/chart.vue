<template>
    <div class="chart-container ml-8" style="position: relative; height:40vh; width:80vw">
        <canvas ref="creditScoreChart"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js';
import EventBus from '~/plugins/eventBus';

export default {
    props: {
        selectedProducts: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            chart: null,
            initialScore: 430
        };
    },
    watch: {
        selectedProducts: {
            immediate: true,
            handler(newVal) {
                if (this.chart) {
                    this.updateChartData(newVal);
                }
            }
        }
    },
    methods: {
        buildChart() {
            const ctx = this.$refs.creditScoreChart.getContext('2d');
            Chart.defaults.global.defaultFontColor = '#FFFFFF';
            Chart.defaults.global.defaultColor = '#FFFFFF';
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.generateMonthLabels(new Date(2023, 11), 13), // Noviembre de 2023 a Junio de 2025
                    datasets: [
                        {
                            label: 'Proyección simulada',
                            data: [], // Inicialmente vacío
                            borderColor: '#00B3FF',
                            fill: false,
                        },
                        {
                            label: 'Comportamiento real',
                            data: [], // Inicialmente vacío
                            borderColor: '#62AC21',
                            fill: false,
                        }
                    ],
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: '#FFFFFF'
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: '#FFFFFF',
                                beginAtZero: true,
                                max: 1000
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: '#FFFFFF'
                            }
                        }]
                    }
                }
            });
        },
        updateChartData(selectedProducts) {
            const newScore = this.calculateNewScore(selectedProducts);
            this.chart.data.datasets[0].data = this.generateDummyData(newScore, 20);
            this.chart.data.datasets[1].data = this.generateDummyData(this.initialScore, 20, true);
            this.chart.update();
        },
        calculateNewScore(products) {
            let scoreIncrease = 0;
            products.forEach(product => {
                if (product.selected) {
                    scoreIncrease += 20 * product.selectedQuota;
                }
            });
            return this.initialScore + scoreIncrease;
        },
        generateMonthLabels(startDate, numberOfMonths) {
            let labels = [];
            let date = new Date(startDate);

            for (let i = 0; i < numberOfMonths; i++) {
                labels.push(this.formatDateToMonthYear(date));
                date.setMonth(date.getMonth() + 1);
            }

            return labels;
        },
        generateDummyData(maxScore, numberOfMonths, isRealBehaviour = false) {
            let data = [];
            let score = Math.floor(Math.random() * maxScore);

            for (let i = 0; i < numberOfMonths; i++) {
                data.push(score);

                if (isRealBehaviour && i % 3 === 0) {
                    score = Math.max(score + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 50), 0);
                } else {
                    score = Math.min(score + Math.floor(Math.random() * 20), maxScore);
                }
            }

            return data;
        },
        formatDateToMonthYear(date) {
            return `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
        }
    },
    mounted() {
        this.buildChart();
        this.updateChartData(this.selectedProducts);
    }
};
</script>

<style>
.chart-container {
    overflow-x: scroll;
    height: 40vh;
    width: 80vw;
    position: relative;
    background: linear-gradient(to bottom, #00263C 0%, #005a7d 0%, #00A2E4 10%);
}
</style>
