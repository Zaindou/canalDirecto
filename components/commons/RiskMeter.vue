<template>
    <div class="text-center">
        <div class="risk-meter__level">
            <div class="risk-meter__score-min">150</div>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span class="material-symbols-outlined risk-meter__indicator" :style="{ left: `${indicatorPosition}%` }"
                        v-on="on">
                        expand_circle_down
                    </span>
                </template>
                <span>Hoy: {{ porcentageTarget }}%</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <span class="material-symbols-outlined risk-meter__indicator goal-indicator"
                        :style="{ left: `${goalIndicatorPosition}%` }" v-on="on">
                        flag_circle
                    </span>
                </template>
                <span>Tu objetivo</span>
            </v-tooltip>
            <div class="risk-meter__score-max">950</div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        score: {
            type: Number,
            required: true,
        },
        goalScore: {
            type: Number,
            required: true,
        },
        porcentageTarget: {
            type: Number,
            required: true,
        }

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
        goalIndicatorPosition() {
            const minScore = 150;
            const maxScore = 950;
            const normalizedScore = (this.goalScore - minScore) / (maxScore - minScore);
            return normalizedScore * 100; // Convert to percentage
        },
    },
};
</script>

<style scoped>
.risk-meter__score,
.risk-meter__risk {
    font-size: 16px;
    font-weight: 500;
    margin: 10px 0;
    border-color: #81c784 !important;

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
    height: 35px;
    background: linear-gradient(to right, #e57373 0%, #ffb74d 50%, #81c784 100%);
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.risk-meter__score-min,
.risk-meter__score-max {
    color: white;
    opacity: 0.7;
    font-weight: 400;
    margin-inline-end: 7px;
    margin-inline-start: 7px;
}

.risk-meter__indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 35px;
    transition: left 0.3s ease-in-out;
    color: white;
}

.goal-indicator {
    color: white;
    /* Puedes personalizar esto */
}
</style>
