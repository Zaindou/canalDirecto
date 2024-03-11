<template>
    <v-container class="pa-7 main-container">
        <Loader v-if="loading4" />
        <Header></Header>
        <div>
            <h4 class="title-name mb-3">Hola, {{ formattedName }}</h4>
            <p style="color: #666666; line-height: normal;">¡Felicitaciones! Has comenzado tu diagnóstico, el cual obtuvo
                los datos del día <b>{{
                    formattedDate }}.</b>
            </p>
        </div>
        <v-window v-model="window" cycle class="carousel-container">
            <v-window-item v-for="i in pageCount" :key="i">
                <v-row>
                    <v-col v-for="(card, index) in cards.slice(getStartIndex(i), getEndIndex(i))" :key="card.title"
                        :cols="calculateColSize" class="my-card" data-title="Welcome!"
                        data-intro='Hola este es el primer paso!'>
                        <v-card class="tips-inicial">
                            <v-card-title class="title-carrousel">
                                {{ card.title }}
                                <v-spacer></v-spacer>
                                <v-btn icon @click="openModal(card)">
                                    <v-icon style="color: #00A2E4;">mdi-information-outline</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text>
                                <template v-if="card.type === 'creditScore'">
                                    <div class="mb-2" style="line-height: normal;">{{ card.text }}</div>
                                    <span class=" score-text" :style="scoreAndRiskStyles[index]">
                                        {{ card.highlightedValue }}
                                    </span><span class="color-higlited">{{ card.highlightedText }}</span>
                                    <div class="score-message mt-2" style="line-height: normal;">
                                        {{ scoreMessage }}
                                    </div>
                                </template>
                                <template v-else-if="card.type === 'riskRating'">
                                    {{ card.text }}
                                    <span class="score-text" :style="scoreAndRiskStyles[index]">
                                        {{ card.highlightedValue ? card.highlightedValue : card.riskLevel }}
                                    </span>
                                </template>
                                <template v-else-if="card.type === 'objetivoFinanciero'">
                                    {{ card.text }}
                                    <div class="mb-2"></div>
                                    <span class="color-higlited">{{ card.objective }}</span>
                                </template>
                                <template v-else>
                                    {{ card.text }}
                                </template>
                            </v-card-text>
                            <v-card-actions v-if="card.buttonText">
                                <v-btn color="primary">{{ card.buttonText }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>

        <!-- Indicadores del carrusel -->
        <v-row justify="center" class="d-sm-none">
            <v-btn v-for="n in pageCount" :key="n" :class="{ 'white--text': n === 1 }" color="light-blue lighten-1" icon
                @click="window = n - 1">
                <v-icon>
                    {{ n === window + 1 ? 'mdi-circle' : 'mdi-circle-outline' }}
                </v-icon>
            </v-btn>
        </v-row>
        <!-- Modal de información -->
        <v-dialog v-model="showModal" persistent max-width="400px">
            <v-card>
                <v-card-title style="color: #0b2f44;">
                    {{ currentCard.title }}
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="py-2" style="font-weight: 400; font-size: 1em;">{{ currentCard.modalText
                }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                        elevation="2" @click="closeModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="mt-7 herramientas-tip">
            <span class="title-tools">Herramientas para tus finanzas saludables</span>
            <opcionesFinancieras />
        </div>
        <div class="mt-7">
            <recomendaciones class="recomendaciones-tip" />
        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6 button-next-tip" @click="navigateTo('mis-productos-financieros')">
            CONTINUAR
        </v-btn>
    </v-container>
</template>

<script>
import { useMainStore } from '@/store/mainStore';
import recomendaciones from '/components/commons/Recomendaciones.vue';
import Header from '/components/commons/Header.vue';
import OpcionesFinancieras from '/components/commons/opcionesFinancieras.vue';
import Loader from '~/components/commons/LoaderForm.vue'


export default {
    components: {
        OpcionesFinancieras, recomendaciones, Header, Loader
    },
    data: () => ({
        localClientData: null,
        window: 0,
        showModal: false,
        currentCard: {},
        score: 0,
        loading4: true,
        cards: [
            {
                title: 'Puntaje crediticio',
                text: 'Tu puntaje crediticio en centrales de riesgo es de:',
                score: null,
                highlightedValue: null,
                highlightedText: 'de 950',
                type: 'creditScore',
                modalText: 'El puntaje de crédito es una calificación (hasta 950 generalmente) basada en tu historial financiero. Las entidades que dan crédito lo usan para evaluar tu confiabilidad crediticia. Los buenos hábitos como, pagos a tiempo, deudas controladas y buen historial mejoran el puntaje.'
            },
            {
                title: 'Objetivo financiero',
                text: 'El objetivo financiero que seleccionaste es: ',
                objective: null,
                modalText: 'El objetivo financiero te ayuda a definir metas crediticias. A través del diagnóstico, te guiaremos para alcanzarlas con estrategias personalizadas.',
                type: 'objetivoFinanciero',
            },
            {
                title: 'Calificación de riesgo',
                text: 'La calificación de riesgo que tienes en centrales de riesgo es:',
                highlightedValue: null,
                riskLevel: 150,
                type: 'riskRating',
                modalText: 'Tu capacidad para obtener crédito depende de cómo las entidades te ven en términos de riesgo. Si tienes un riesgo bajo, significa que confían mucho en ti para pagar tus deudas, lo que te ayuda a conseguir crédito fácilmente. Un riesgo medio indica que tienes oportunidades justas para obtener crédito. Sin embargo, un riesgo alto podría hacer que sea más difícil para ti conseguir préstamos, ya que las entidades te ven más propenso a no pagar tus deudas.'
            },
        ],
        itemsPerPage: 3, // Por defecto mostramos 3 tarjetas
    }),
    computed: {
        pageCount() {
            return Math.ceil(this.cards.length / this.itemsPerPage);
        },
        calculateColSize() {
            if (this.$vuetify.breakpoint.xs) {
                return 12; // Todo el ancho en dispositivos móviles
            } else if (this.$vuetify.breakpoint.sm) {
                return 6; // Mitad del ancho para pantallas pequeñas
            } else {
                return 4; // Un tercio del ancho para pantallas md y mayores
            }
        },
        scoreAndRiskStyles() {
            return this.cards.map(card => {
                if (card.type === 'creditScore') {
                    return { color: this.getColorBasedOnScore(card.score) };
                } else if (card.type === 'riskRating') {
                    return { color: this.getColorBasedOnScore(card.riskLevel) };
                }
                return {}; // Devuelve un objeto vacío si no es ninguno de los tipos
            });
        },
        mainStore() {
            return useMainStore();
        },
        scoreMessage() {
            // Acceder directamente al puntaje crediticio desde localClientData
            const score = this.localClientData ? this.localClientData.puntaje_crediticio : 0;

            if (score <= 250) {
                return 'Tu puntaje es críticamente bajo, estás en el 5% de la población. Actualmente, es improbable que obtengas créditos si no tomas acciones oportunas.';
            } else if (score <= 350) {
                return 'Te encuentras con el 30% de la población. Acceder a créditos es posible, pero las tasas pueden ser desafiantes. Considera mejorar tu historial de crédito.';
            } else if (score <= 580) {
                return 'Tu puntaje se encuentra con el 50% de la población. Puedes acceder a créditos, pero condiciones más favorables requerirán mejoras en tu historial de crédito.';
            } else if (score <= 650) {
                return 'Cuentas con un puntaje regular, estás con el 15% de la población. Acceder a créditos es posible, pero aún hay margen para obtener mejores tasas.';
            } else if (score <= 740) {
                return 'Tu puntaje es bueno, colocándote con el 15% de la población. Puedes acceder a créditos con tasas favorables, sigue manteniendo buenos hábitos financieros.';
            } else {
                return 'Este puntaje te ubica con el 10% superior de la población, con un puntaje sobresaliente puedes disfrutar de las mejores ofertas crediticias y condiciones muy favorables.';
            }
        },
        formattedName() {
            if (this.localClientData && this.localClientData.nombre_completo) {
                const parts = this.localClientData.nombre_completo.split(' ');
                if (parts.length >= 3) {
                    return `${parts[2]} ${parts[0]}`; // Primer nombre y primer apellido
                }
                return this.localClientData.nombre_completo; // Devuelve el nombre completo si no cumple con el formato esperado
            }
            return '¿Cómo estas?';
        },
        formattedDate() {
            if (this.localClientData && this.localClientData.fecha_diagnostico) {
                const date = new Date(this.localClientData.fecha_diagnostico);
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'Diciembre'];

                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();

                return `${day} de ${month} de ${year}`;
            }
            return 'Hoy es un buen día...';
        },
    },
    methods: {
        getStartIndex(page) {
            return (page - 1) * this.itemsPerPage;
        },
        getEndIndex(page) {
            return page * this.itemsPerPage;
        },
        openModal(card) {
            this.currentCard = card;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        getColorBasedOnScore(value) {

            if (value <= 200) return '#FF4136'; // rojo
            if (value <= 400) return '#FF4136'; // naranja
            if (value <= 600) return '#FFDC00'; // amarillo
            if (value <= 800) return '#2ECC40'; // verde claro
            return '#3D9970'; // verde oscuro
        },
        formatName(fullName) {
            const parts = fullName.split(' ');
            if (parts.length >= 3) {
                return `${parts[2]} ${parts[0]}`;
            }
            return fullName;
        },
        navigateTo(route) {
            this.$router.push(route);
        },
    },
    watch: {
        '$vuetify.breakpoint.name'(newVal) {
            if (newVal === 'xs') {
                this.itemsPerPage = 1; // Solo una tarjeta en dispositivos móviles
            } else {
                this.itemsPerPage = 3; // Tres tarjetas en otros tamaños
            }
            this.window = 0; // Restablece la ventana del carrusel al cambiar el tamaño
        },
        'mainStore.clientData': {
            immediate: true, // Ejecuta el watcher inmediatamente
            handler(newValue) {
                this.localClientData = newValue;
                this.cards[0].highlightedValue = newValue ? newValue.puntaje_crediticio : 0;
                this.cards[0].score = newValue ? newValue.puntaje_crediticio : 0;
                this.cards[1].objective = newValue ? newValue.objetivo_financiero : 'No definido';
                this.cards[2].highlightedValue = newValue ? newValue.calificacion_riesgo : 500;
                this.cards[2].riskLevel = newValue ? newValue.calificacion_riesgo : 0;
            }
        }
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();
        // if (this.localClientData == null) {
        //     this.$router.push('/')
        // }
        this.score = this.localClientData ? this.localClientData.puntaje_crediticio : 0;
        this.cards[0].highlightedValue = this.score;

        // this.window = 0;
        if (this.$vuetify.breakpoint.xs) {
            this.itemsPerPage = 1;
        }

        this.loading4 = false;
        if (!localStorage.getItem('tourInicioVisto')) {
            introJs().setOptions({
                steps: [
                    {
                        title: '¡Bienvenido!',
                        intro: `Hola, este es el primer paso de tu diagnóstico financiero. Aquí podrás ver tu puntaje crediticio, el objetivo financiero que seleccionaste y tu calificación de riesgo`
                    },
                    {
                        title: 'Información adicional',
                        element: document.querySelector('.carousel-container'),
                        intro: "Puedes deslizar hacia la izquierda o derecha para ver más información."
                    },
                    {
                        title: 'Herramientas financieras',
                        element: document.querySelector('.herramientas-tip'),
                        intro: "En esta sección encontrarás herramientas para mejorar tus finanzas."
                    },
                    {
                        title: 'Recomendaciones',
                        element: document.querySelector('.recomendaciones-tip'),
                        intro: "Y aquí encontrarás recomendaciones personalizadas para ti."
                    },
                    {
                        title: '¡Listo!',
                        element: document.querySelector('.button-next-tip'),
                        intro: "Finalmente, puedes continuar con el diagnóstico."
                    }
                ],
                nextLabel: 'Siguiente',
                prevLabel: 'Anterior',
                doneLabel: 'Listo',
                dontShowAgain: false,
                dontShowAgainLabel: 'No volver a mostrar',
                showBullets: false,
                disableInteraction: true,
                overlayOpacity: 0.7,
                exitOnEsc: false,
                exitOnOverlayClick: false,
                showButtons: true,
            }).start();

            localStorage.setItem('tourInicioVisto', 'true');
        }
    }

};
</script>

<style>
.carousel-container .v-window__container {
    overflow: hidden !important;
}

.carousel-container .v-window-item {
    justify-content: center !important;
}


.v-window__container {
    padding: 10px !important;
    overflow: visible !important;
}

.my-card {
    margin-bottom: 20px;
}

.card-height {
    width: 50px;
    height: 1000px;
}

.title-name {
    color: #0b2f44;
}

.title-carrousel {
    color: #0b2f44;
    font-weight: 600;
    font-size: 1rem !important;
    margin-bottom: 0px !important;
}

.title-tools {
    color: #0b2f44;
    font-weight: 500;
    font-size: 1rem;
}

.score-text {
    font-weight: 600;
    font-size: 1rem;
}

.color-higlited {
    font-weight: 600;
    font-size: 1rem;
    color: #0b2f44;
}

.data-tooltip-class {
    background-color: #0b2f44;
    color: white;
    font-size: 2rem !important;
    font-weight: 500;
}

.tips-inicial {
    min-height: 150px;
    min-width: 50px;
    /* Aumenta la altura mínima de las tarjetas */
}

@media (min-width: 960px) {
    .main-container {
        max-width: 1200px;
        /* Ajusta el ancho máximo del contenedor */
        margin: auto;
        /* Centra el contenedor */
    }

    .title-name,
    .title-carrousel,
    .title-tools,
    .score-text,
    .color-higlited {
        font-size: 1.2rem;
        /* Aumenta el tamaño de la fuente */
    }


    .tips-inicial {
        min-height: 210px;
        min-width: 50px;
        /* Aumenta la altura mínima de las tarjetas */
    }

    .v-btn {
        padding: 10px 20px;
        /* Aumenta el tamaño de los botones */
        font-size: 1rem;
        /* Aumenta el tamaño de la fuente de los botones */
    }
}
</style>
