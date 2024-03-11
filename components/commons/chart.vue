<!-- <template>
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
        // ...
        buildChart() {
            // ...
            this.chart = new Chart(ctx, {
                // ...
                options: {
                    // ...
                    scales: {
                        yAxes: [{
                            ticks: {
                                // Actualiza los rangos del eje Y según los requisitos
                                stepSize: 100, // Asegúrate de que el stepSize sea 100 para ajustarse a los rangos dados
                                suggestedMax: 900, // Ajusta esto si esperas que el puntaje pueda ser más alto
                                // Puedes definir un callback para cambiar cómo se muestran las etiquetas si es necesario
                            }
                        }],
                        xAxes: [{
                            // ...
                            // Asegúrate de que las etiquetas de xAxes puedan desplazarse si es necesario
                            type: 'category', // Utiliza el tipo 'category' para una mejor manipulación de las etiquetas
                        }]
                    }
                }
            });
        },
        updateChartData(selectedProducts) {
            // ...
            // Actualizar las etiquetas del eje X basado en la consulta más larga
            const longestSimulation = this.findLongestSimulation(selectedProducts);
            this.chart.data.labels = this.generateMonthLabels(new Date(), longestSimulation);

            // Aquí actualizas los datos de los datasets con los puntajes reales y simulados
            this.chart.data.datasets[0].data = this.generateScoreData(selectedProducts);
            this.chart.data.datasets[1].data = this.generateRealScoreData(); // Suponiendo que tienes una función para esto
            this.chart.update();
        },
        // ...
        findLongestSimulation(products) {
            // Encuentra la simulación más larga basada en las cuotas seleccionadas
            let longestQuota = 0;
            products.forEach(product => {
                if (product.selected && product.selectedQuota > longestQuota) {
                    longestQuota = product.selectedQuota;
                }
            });
            return longestQuota;
        },
        generateScoreData(products) {
            // Genera los datos de puntaje simulados basados en los productos seleccionados
            let data = [];
            // Aquí debes calcular el puntaje inicial basado en el puntaje_crediticio y luego sumar el puntaje por cuota
            // Supongamos que inicializas el puntaje con el puntaje_crediticio
            let score = this.initialScore; // Deberás obtener este valor del puntaje_crediticio
            products.forEach(product => {
                if (product.selected) {
                    // Suponiendo que dividimos el puntaje_por_cuota por la cantidad de cuotas
                    score += product.puntaje_por_cuota / product.selectedQuota;
                }
                // Aquí deberías calcular el incremento de puntaje para cada mes y agregarlo a los datos
                // Por simplicidad, aquí solo agregamos el puntaje calculado al array
                data.push(score);
            });
            return data;
        },
        // ...
    }
};
</script>
-->
<style>
.chart-container {
    /* overflow-x: scroll; */
    height: 40vh;
    width: 80vw;
    position: relative;
    /* background: linear-gradient(to bottom, #00263C 0%, #005a7d 0%, #00A2E4 10%); */
}
</style> 
