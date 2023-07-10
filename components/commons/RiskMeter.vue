<template>
    <v-card class="text-center risk-meter__box" :color="riskColor" dark>
        <div class="risk-meter__score">TU PUNTAJE <br> <span class="big-text"> {{ score }}</span></div>
        <div class="risk-meter__level">
            <v-icon class="risk-meter__indicator" :style="{ left: `${indicatorPosition}%` }">mdi-circle-slice-8</v-icon>
        </div>
        <div class="risk-meter__risk">CALIFICACIÓN DE RIESGO <br> <span class="big-text">{{ riskLevel }}</span></div>
        <p class="risk-meter__description">{{ riskDescription }}</p>

    </v-card>
</template>

<script>
export default {
    props: {
        score: {
            type: Number,
            required: true,
        },
    },
    computed: {
        indicatorPosition() {
            const minScore = 150;
            const maxScore = 950;
            const normalizedScore = (this.score - minScore) / (maxScore - minScore);
            return normalizedScore * 100; // Convert to percentage
        },
        riskLevel() {
            if (this.score >= 621) {
                return "BAJO";
            } else if (this.score >= 481) {
                return "MODERADO";
            } else {
                return "ALTO";
            }
        },
        riskDescription() {
            if (this.score >= 621) {
                return "Significa que tienes el menor nivel de riesgo en el cumplimiento de tus obligaciones financieras."
            } else if (this.score >= 481) {
                return "Significa un nivel moderado de riesgo en el cumplimiento de tus obligaciones financieras."
            } else {
                return "Significa que existe un mayor riesgo de incumplimiento en el pago de tus obligaciones financieras."
            }
        },
        riskColor() {
            if (this.score >= 621) {
                return "#81c784";
            } else if (this.score >= 481) {
                return "#ffb74d";
            } else {
                return "#e57373";
            }
        },
    },
};
</script>

<style scoped>
.risk-meter__box {
    margin: 0 auto;
    padding: 20px;
    color: white;
    border-radius: 5px;
}

.risk-meter__score,
.risk-meter__risk {
    font-size: 16px;
    font-weight: 500;
    margin: 10px 0;
}

.big-text {
    font-size: 18px;
    font-weight: bold;
}

.risk-meter__description {
    font-size: 14px;
    margin-bottom: 20px;
}

.risk-meter__level {
    width: 100%;
    height: 30px;
    background: linear-gradient(to right, #e57373 0%, #ffb74d 50%, #81c784 100%);
    position: relative;
    border-radius: 15px;
    overflow: hidden;
}

.risk-meter__indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 35px;
    transition: left 0.3s ease-in-out;
}
</style>
