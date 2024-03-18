<template>
    <v-container class="pa-7 main-container">
        <Header></Header>
        <div>
            <v-btn icon color="#0b2f44" @click="navigateTo('/simulador')" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;">Descubre la solución que mejor se adapte a tu situación y
                negocia directamente con tu acreedor para llegar a un acuerdo financiero que beneficie tus finanzas.
            </p>
        </div>
        <div>
            <v-card>
                <v-card-text class="">
                    <span class="title"> {{ producto ? producto.entidad : 'Cargando...' }}
                    </span>
                    <br>
                    <span><b class="subtitle-1">Número de producto:</b> {{ producto ? producto.producto : 'Cargando...'
                        }}</span>
                    <br>
                    <span><b class="subtitle-1">Saldo reportado:</b> {{ producto ? formatCurrency(producto.saldo_total)
                :
                'Cargando...'
                        }}</span>
                    <br>
                    <div v-if="producto && contactoProducto">
                        <span v-if="contactoProducto.nombre_comercial">
                            <b class="subtitle-1">Nombre comercial:</b> {{ contactoProducto.nombre_comercial }}
                        </span>
                        <br v-if="contactoProducto.nombre_comercial">

                        <span v-if="contactoProducto.enlace_web">
                            <b class="subtitle-1">Página web:</b> Encuentra información <a
                                :href="contactoProducto.enlace_web" target=”_blank”>aquí</a>
                        </span>
                        <br v-if="contactoProducto.enlace_web">

                        <span v-if="contactoProducto.enlace_portal">
                            <b class="subtitle-1">Portal clientes:</b> Portal transaccional <a
                                :href="contactoProducto.enlace_portal" target=”_blank”>aquí</a>
                        </span>
                        <br v-if="contactoProducto.enlace_portal">
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <div class="mt-2 asesor">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/simularProducto.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Simular producto</div>
                                <p class="panel-description">Simula tu producto y encuentra cómo resolver
                                    esta
                                    obligación ayudaria a tu perfil de crédito.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>

                        <v-divider class="mb-5"></v-divider>
                        <v-row>
                            <v-col cols="12">
                                <v-card> <v-card-text elevation="0">
                                        <span class="title"> {{ producto ? producto.entidad : 'Cargando...' }}
                                        </span>
                                        <br>
                                        <span><b class="subtitle-1">Estado del producto:</b> {{ producto ?
                producto.estado
                : 'Cargando...'
                                            }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Saldo total:</b> {{ producto ?
                formatCurrency(producto.saldo_total) :
                'Cargando...'
                                            }}</span>
                                        <br>
                                        <span><b class="subtitle-1">% saldo de tus deudas:</b> {{ producto ?
                producto.participacion_mora : '' }}%</span>

                                        <v-select class="mt-4" :items="opcionesDeCuotas" label="Número de cuotas"
                                            v-model="cuotasSeleccionadas" outlined></v-select>

                                        <v-divider class="mb-4"></v-divider>

                                        <span style="color: #62AC21;"><b class="subtitle-1">Tu objetivo es:</b> {{
                localClientData ?
                    localClientData.objetivo_financiero :
                    'Cargando...' }}
                                        </span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto debe ser mi
                                                puntaje?:</b>
                                            {{ localClientData ?
                localClientData.objetivo_score :
                'Cargando...'
                                            }}</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuál es mi puntaje
                                                actual?:</b>
                                            {{ localClientData ?
                localClientData.puntaje_crediticio :
                'Cargando...'
                                            }}</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu puntaje
                                                al
                                                saldar esta obligación?:
                                            </b>
                                            {{ Math.round(this.producto.puntaje_por_cuota) }} puntos</span>
                                        <br>
                                        <div v-if="Math.round(this.producto.puntaje_por_cuota) != puntajePorCuota">
                                            <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu
                                                    puntaje
                                                    mes a mes?:
                                                </b>
                                                {{ puntajePorCuota }} puntos</span>
                                            <br>
                                        </div>

                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto te acerca a tu
                                                objetivo?: </b> {{ Math.round(this.producto.aumento_puntaje_porcentaje)
                                            }}%</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Con cuántos puntos
                                                quedarías
                                                respecto a tu
                                                objetivo?</b> {{
                puntajeTotalDespuesDeSaldar }} de
                                            {{ localClientData ? localClientData.objetivo_score : 'Cargando...'
                                            }}</span>

                                    </v-card-text></v-card>
                            </v-col>


                        </v-row>
                        <!-- <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%,#00A2E4 87%)"
                            elevation="2" class="mt-2" @click="navigateTo('/simulador')">
                            SIMULAR
                        </v-btn> -->
                    </v-expansion-panel-content>

                </v-expansion-panel>
                <v-expansion-panel v-if="producto && contactoProducto">
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/contactoRecomendado.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Contacto recomendado</div>
                                <p class="panel-description">QNT te relaciona con la persona que podria ayudarte
                                    a saldar esta obligación, estás a solo una llamada.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p style="color: rgb(155, 155, 155); line-height: normal;">En QNT te recomendamos contactarte
                            con {{
                            contactoProducto.nombre_comercial }} para que puedas
                            negociar tus obligaciones en mora con:
                            <br>
                            {{ contactoProducto.contacto_recomendado }}
                        </p>
                    </v-expansion-panel-content>

                </v-expansion-panel>

                <v-expansion-panel v-if="producto && contactoProducto && contactoProducto.enlace_whatsapp">
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/whatsappIcon.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Hablar por Whatsapp</div>
                                <p class="panel-description">
                                    Quieres chatear con tu acreedor para solucionar tu obligación financiera. Ingresa
                                    aqui.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p style="color: rgb(155, 155, 155); line-height: normal;">
                            Si prefieres, puedes contactar a {{ contactoProducto.nombre_comercial }} por Whatsapp
                            para que puedas negociar tus obligaciones en mora.
                        </p>

                        <div style="text-align: center;">
                            <a :href="contactoProducto.enlace_whatsapp" target="_blank">
                                <v-btn color="green" dark>
                                    <v-icon left>mdi-whatsapp</v-icon>
                                    Contactar por Whatsapp
                                </v-btn>
                            </a>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <!-- <v-expansion-panel>
                    <v-expansion-panel-header
                        v-if="producto && contactoProducto && contactoProducto.nombre_comercial && contactoProducto.numero_contacto">
                        <div class="panel-header-content">
                            <img :src="`/icons/llamadaAsesor.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Quiero llamar a un asesor</div>

                                <p class="panel-description">
                                    Te mostramos las líneas de atención en las cuales puedes recibir asesoria para
                                    mejorar
                                    tus
                                    reportes negativos.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p style="color: rgb(155, 155, 155); line-height: normal;">Si prefieres, puedes contactar con un
                            asesor de {{ contactoProducto.nombre_comercial }}
                            contactate con los siguientes canales:
                            <br>
                        <ul>{{ contactoProducto.numero_contacto }}
                        </ul>
                        </p>

                    </v-expansion-panel-content>

                </v-expansion-panel> -->

            </v-expansion-panels>

        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6" @click="navigateTo('/simulador')">
            REGRESAR
        </v-btn>
    </v-container>
</template>

<script>
// Importar los componentes SVG

import Header from '/components/commons/Header.vue';
import Productos from '~/components/commons/Products.vue';
import { useMainStore } from '@/store/mainStore';


export default {
    components: {

        Productos,
        Header,
    },
    data: () => ({
        localClientData: null,
        saldoProductos: 0,
        saldoMoraProductos: null,
        fechaDiagnostico: null,
        products: null,
        idProducto: null,
        producto: null,
        opcionesDeCuotas: Array.from({ length: 36 }, (_, i) => i + 1),
        puntajePorCuota: 0,
        puntajeTotalDespuesDeSaldar: 0,
        cuotasSeleccionadas: 1,
        contactoProducto: null,
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },


    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(value);
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
        calcularPuntajePorCuota() {
            if (this.producto && this.cuotasSeleccionadas) {
                this.puntajePorCuota = Math.round(this.producto.puntaje_por_cuota / this.cuotasSeleccionadas);
            }
        },
        navigateTo(route) {
            this.$router.push(route);
        },

    },
    watch: {
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                this.products = newValue;
                this.idProducto = this.$route.params.id;
                for (let producto of this.products) {
                    if (producto.id_producto === this.idProducto) {
                        this.producto = producto;
                        this.contactoProducto = this.producto.contacto;
                        this.puntajePorCuota = Math.round(producto.puntaje_por_cuota / this.cuotasSeleccionadas);
                    }
                }
            }
        },
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                this.localClientData = newValue;
                this.puntajeTotalDespuesDeSaldar = Math.round(this.localClientData.puntaje_crediticio + this.puntajePorCuota);
            }
        },
        cuotasSeleccionadas(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.calcularPuntajePorCuota();
                if (this.localClientData && this.puntajePorCuota !== undefined) {
                    this.puntajeTotalDespuesDeSaldar = Math.round(this.localClientData.puntaje_crediticio + this.puntajePorCuota);
                }
            }
        },
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();

    },
};
</script>

<style scoped>
.icono-svg {
    height: 50px;
    width: 50px;
}

a {
    color: #0b2f44;

}

.title {
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    color: #0b2f44;
    margin-bottom: 0px !important;
    text-align: left !important;
}

.subtitle-1 {
    font-size: 0.9rem !important;
    line-height: normal;
    font-weight: 500 !important;
    color: #424242;
    text-align: left !important;
    margin-top: 0px;
}

.title-tools {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0b2f44;
    margin-bottom: 4px;
    text-align: left !important;
}


.v-expansion-panel-header>*:not(.v-expansion-panel-header__icon) {
    flex: 0 0 auto;
}

.panel-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.panel-text-content {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
}

.panel-title {
    font-weight: bold;
    margin-bottom: 4px;
    color: #0b2f44;
    font-size: 0.9rem;
}

.panel-description {
    font-size: 0.8rem;
    color: #666666;
    margin: 0;
}

@media (min-width: 960px) {
    .panel-header-content {
        display: flex;
        align-items: center;
        justify-content: start;
    }


    .panel-title,
    .panel-description {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .v-card,
    .v-card-text {
        padding: 10px;
    }
}
</style>


<!-- <script>
export default {
    async asyncData({ params }) {
        console.log(params)
        const productId = params.id_producto;
        return { producto: await cargarProducto(productId) };
    }
};
</script> -->