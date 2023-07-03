<template>
        <div class="principal-container">
                <div class="banner-text">
                        <p><b>¡Felicitaciones, {{ clientData.nombre_completo }}!</b> este es tu diagnóstico
                                financiero QNT,
                                ten en cuenta
                                las siguientes recomendaciones para mejorar tu perfil crediticio.</p>
                </div>
                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon" large>mdi-notebook-outline</v-icon> Resumen de
                        tu
                        diagnóstico</h3>
                <v-card class="mb-5">
                        <v-list>
                                <v-list-item>
                                        <v-list-item-content>
                                                <v-list-item-title><b>Fecha de diagnóstico</b></v-list-item-title>
                                                {{ fechaFormateada }}
                                                <v-list-item-title><b>Puntaje de crédito</b></v-list-item-title>
                                                {{ clientData.puntaje_crediticio }}
                                                <v-list-item-title><b>Objetivo financiero</b></v-list-item-title>
                                                {{ clientData.objetivo_financiero }}
                                                <v-list-item-title><b>% de avance hacia tu
                                                                objetivo:</b></v-list-item-title>
                                                {{ clientData.porcentaje_avance_actual }}%
                                                <v-list-item-title><b>Calificación de riesgo</b></v-list-item-title>
                                                {{ clientData.calificacion_riesgo }}
                                                <v-list-item-title><b>Recomendación</b></v-list-item-title>
                                                {{ clientData.recomendacion }}
                                        </v-list-item-content>
                                </v-list-item>
                        </v-list>
                </v-card>
                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon" large>mdi-currency-usd</v-icon> Información
                        financiera</h3>
                <v-card class="mb-5">
                        <v-list>
                                <v-list-item>
                                        <v-list-item-content>
                                                <v-list-item-title><b>Tus ingresos</b></v-list-item-title>
                                                {{ formatCurrency(clientData.ingresos_mensuales) }}
                                                <v-list-item-title><b>Productos activos</b></v-list-item-title>
                                                {{ clientData.productos_activos }}
                                                <v-list-item-title><b>Productos en mora</b></v-list-item-title>
                                                {{ clientData.productos_mora }}
                                                <v-list-item-title><b>Saldo total de productos</b></v-list-item-title>
                                                {{ formatCurrency(clientData.saldo_total_productos) }}
                                                <v-list-item-title><b>Saldo total de productos en mora</b></v-list-item-title>
                                                {{ formatCurrency(clientData.saldo_total_productos_mora) }}
                                        </v-list-item-content>
                                </v-list-item>
                        </v-list>
                </v-card>
                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon" large>mdi-pencil-outline</v-icon>
                        Recomendaciones financieras</h3>
                <v-card class="mt-5 mb-5">
                        <v-card-text>
                                <v-list>
                                        <v-list-item v-for="tip in clientData.tips_financieros" :key="tip.id">
                                                <v-list-item-content>
                                                        <li>{{ tip.contenido }}</li>
                                                </v-list-item-content>
                                        </v-list-item>
                                </v-list>
                        </v-card-text>
                </v-card>

                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon" large>mdi-wallet-outline</v-icon> Detalle de
                        tus
                        productos vigentes</h3>

                <v-expansion-panels accordion hover-focus>
                        <v-expansion-panel v-for="producto in productos" :key="producto.id">
                                <v-expansion-panel-header>
                                        <div>
                                                <span id="entityname">{{ producto.entidad }}</span>
                                                <br>Número de producto: {{ producto.producto }}
                                                <br>Estado del producto: {{ producto.estado }}

                                        </div>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                        <div>
                                                <strong>Tipo de cuenta:</strong> {{ producto.tipo_producto }}

                                                <br><strong>Antigüedad (En días):</strong> {{ producto.antiguedad }}
                                                <br><strong>Días en mora:</strong> {{ producto.dias_en_mora }}
                                                <br><strong>Saldo total:</strong> {{ formatCurrency(producto.saldo_total) }}
                                                <br><strong>Cuota promedio:</strong> {{ formatCurrency(producto.cuota) }}
                                                <br><strong>Participación de tus productos activos:</strong> {{
                                                        producto.participacion_al_dia }}%
                                                <br><strong>Participación de tus productos activos en mora (Deudas): </strong>{{
                                                        producto.participacion_mora }}%
                                        </div>
                                </v-expansion-panel-content>
                        </v-expansion-panel>
                </v-expansion-panels>


                <v-card class="pa-3 mt-3 mb-3 card-estado-actual" outlined>
                        <center><span class="product-icon material-symbols-outlined">cardiology</span></center>
                        <center id="entityname" class="mb-2">Estado actual</center>
                        <v-row>
                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Tus Ingresos SIN prestaciones / aportes a salud:</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.ingresos_sin_prestaciones) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Pagos promedio al mes (Obligaciones vigentes):</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.pagos_promedio_mes) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Recomendación de tus gastos básicos:</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.recomendacion_gastos_basicos) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Recomendación de pago de obligaciones (deudas):</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.recomendacion_pago_deudas) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Disponible para el saldar tus deudas:</strong>
                                        <p v-if="clientData.disponible_saldar_deudas >= 0" class="my-0">
                                                {{ formatCurrency(clientData.disponible_saldar_deudas) }}
                                        </p>
                                        <p v-else class="my-0">
                                                $0 - Debes revisar tus finanzas.
                                        </p>
                                </v-col>
                        </v-row>
                </v-card>

                <div class="mb-5 card-alert">
                        <div class="card-icon-alert">
                                <span class="material-symbols-outlined">emergency_home</span>
                        </div>
                        <div class="card-content">
                                <p><strong>Advertencia: </strong>Recuerda que las recomendaciones presentadas son de expertos
                                        economistas, sin embargo ten en cuenta únicamente tu comportamiento y no
                                        incluye los ingresos o gastos de tu núcleo familiar.
                                </p>
                        </div>
                </div>
                <h3 style="color:#2B81D6;" class="mb-5"><v-icon id="product-icon" large>mdi-star-outline</v-icon>
                        Recomendaciones
                        para alcanzar tu objetivo financiero</h3>
                <v-expansion-panels class="mb-3">
                        <v-expansion-panel v-for="(producto, index) in productos" :key="index"
                                v-if="producto.es_producto_qnt && producto.ofertas">
                                <v-expansion-panel-header>
                                        <div>
                                                <span id="entityname">{{ producto.entidad }}</span>
                                                <br>Estado del producto: {{ producto.estado }}
                                                <br>Part. En mora: {{ producto.participacion_mora }}%

                                        </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                        <div class="offer-card" v-for="(oferta, i) in producto.ofertas" :key="i">
                                                <p class="title-offer">Plazo: {{ oferta.plazo }} meses</p>
                                                <p><strong>Valor a Pagar:</strong> {{ formatCurrency(oferta.monto_final_oferta)
                                                }}</p>
                                                <p><strong>Cuota Inicial:</strong> {{ formatCurrency(oferta.cuota_inicial) }}
                                                </p>
                                                <p><strong>Valor Cuota:</strong> {{ formatCurrency(oferta.cuota) }}</p>
                                                <p><strong>Ahorraras:</strong> {{ ((1 - (oferta.monto_final_oferta /
                                                        producto.saldo_total)) * 100).toFixed(2) }}%</p>
                                                <p><strong>Alcanzaras tu objetivo en:</strong> {{
                                                        producto.scores_by_term[oferta.plazo].tiempo_meses }} meses</p>
                                        </div>
                                        <div class="card-alert-offer">
                                                <div class="card-icon-alert">
                                                        <span
                                                                class="material-symbols-outlined card-icon-1-alert">emergency_home</span>
                                                </div>
                                                <div class="card-content">
                                                        <p><strong>Advertencia: </strong>Si deseas saldar esta obligación,
                                                                recuerda que puedes
                                                                seleccionar uno de los planes presentados o ajustar un plan de
                                                                acuerdo a tus necesidades,
                                                                contáctate con nosotros para brindarte una asesoría
                                                                personalizada.
                                                                <br>
                                                                <br>
                                                                <strong>Whatsapp:</strong>3182876726
                                                                <br><strong>Teléfono:</strong> 01 8000 180 560
                                                                <br> <strong>Correo:</strong>Canaldirecto@qnt.com.co
                                                        </p>
                                                </div>
                                        </div>
                                </v-expansion-panel-content>
                        </v-expansion-panel>
                </v-expansion-panels>

                <h4 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon"
                                large>mdi-wallet-plus-outline</v-icon>Obligaciones fuera
                        de QNT</h4>
                <v-expansion-panels>
                        <v-expansion-panel v-for="(producto, index) in productos" :key="index"
                                v-if="!producto.ofertas || producto.ofertas.length === 0">
                                <v-expansion-panel-header>
                                        <div>
                                                <span id="entityname">{{ producto.entidad }}</span>
                                                <br>Estado del producto: {{ producto.estado }}
                                                <br>Part. En mora: {{ producto.participacion_mora }}%

                                        </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                        <p v-if="producto.contacto">Para ponerte al día con esta obligación, debes contactarte
                                                con la entidad a:
                                                <br><strong>Correo:</strong> {{ producto.contacto.correo_contacto }}
                                                <br><strong>Teléfono:</strong> {{ producto.contacto.numero_contacto }}
                                        </p>
                                        <p v-else>No disponemos de información de contacto para esta entidad.</p>
                                        <p>Si cancelas esta obligación en un solo pago te acercarás aproximadamente <b>{{
                                                roundPercentage(producto.contacto ? producto.contacto.hacia_objetivo :
                                                        producto.scores_by_term["1"].hacia_objetivo) }}%</b> a tu objetivo
                                                financiero en un periodo
                                                de <b>{{
                                                        producto.contacto ? producto.contacto.tiempo_meses :
                                                        producto.scores_by_term["1"].tiempo_meses }}</b> meses
                                        </p>
                                </v-expansion-panel-content>
                        </v-expansion-panel>
                </v-expansion-panels>



        </div>
</template>


<!-- <script>
export default {
        props: {
                clientData: {
                        type: Object,
                        default: () => ({}),
                },
                productos: {
                        type: Array,
                        default: () => ([]),
                },
                ofertas: {
                        type: Array,
                        default: () => ([]),
                },
        },
        methods: {
                formatCurrency(value) {
                        return new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                        }).format(value);





                },
                roundPercentage(value) {
                        return parseFloat(value).toFixed(2);
                }
        },
        computed: {
                fechaFormateada() {
                        const fecha = new Date(this.clientData.fecha_diagnostico);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
                        const año = fecha.getFullYear();
                        return `${dia}/${mes}/${año}`;
                }
        }
}

</script> -->

<script>
import axios from 'axios'


export default {

        data() {
                return {
                        loading: true,
                        error: null,
                        data: null,
                        clientData: {},
                        productos: {},
                        ofertas: {},
                        isOpen: false,
                }
        },
        async created() {
                this.loading = true
                try {
                        const token = '0cfc4ff8956155c133dfe3b8b3ae577289d956e5'
                        const cedula = '3278158'

                        const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                                headers: {
                                        Authorization: `Token ${token}`
                                }
                        })

                        this.clientData = response.data.informacionCliente;
                        this.productos = response.data.wazeQnt;
                        this.ofertas = response.data.wazeQnt[2].ofertas;
                        this.isOpen = false;

                } catch (error) {
                        console.error(error)
                } finally {
                        this.loading = false
                }
        },
        methods: {
                formatCurrency(value) {
                        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
                },
                roundPercentage(value) {
                        return parseFloat(value).toFixed(2);
                }
        },
        computed: {
                fechaFormateada() {
                        const fecha = new Date(this.clientData.fecha_diagnostico);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
                        const año = fecha.getFullYear();
                        return `${dia}/${mes}/${año}`;
                }
        }
}

</script>


</script>
<style scoped>
/* @media (max-width: 600px) { */



.principal-container {
        padding: 15px;
        position: relative;
}


.banner-text {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #666;
        font-weight: 300;
        line-height: 1.5;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.div-table {
        width: 100%;
}

.div-table thead {
        display: none;
}

.div-table tr {
        display: block;
}

.div-table td {
        display: block;
        text-align: left;
        /* Cambiado de right a left */
        font-size: 13px;
}

.div-table td:last-child {
        border-bottom: 0;
}

.div-table td:before {
        content: attr(data-label);
        display: block;
        text-transform: uppercase;
        font-weight: bold;
}

table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        border: 0.5px solid #747171;
        border-radius: 10px;
        overflow: hidden;
}

th,
td {
        padding: 10px;
        text-align: left;
        border: 0.5px solid #747171 !important;
}

th {
        background-color: #f2f2f2;
        border-color: #747171 ! important;
}

.grid-container {
        /* margin: auto; */
        display: grid;
        /* grid-template-columns: 1fr 1fr; */
        grid-gap: 10px;
        margin-top: 10px;
        /* font-family: 'Inter', 'sans-serif'; */
}

.grid-item {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        margin: 0 0 20px 0;
        line-height: 18px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card {
        align-items: center;
        background-color: #f0f0f0;
        border-radius: 10px;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
        display: flex;
        line-height: normal;
        margin-bottom: 20px;
        margin-top: 10px;
        margin: auto;
        padding: 5px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card-alert-offer {
        /* adjust as necessary */
        align-items: center;
        background-color: #dff0e9;
        border-radius: 10px;
        display: flex;
        line-height: normal;
        margin-top: 20px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card-alert {
        /* adjust as necessary */
        align-items: center;
        background-color: #dff0e9;
        border-radius: 10px;
        display: flex;
        line-height: normal;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

.card-icon-alert,
.card-icon-1-alert {
        color: #2B81D6;
        flex: 1;
        font-size: 37px !important;
        margin: 5px;
        text-align: center;
}

.card-content {
        flex: 6;
        margin-top: 10px;
        padding: 10px;
        text-align: left;
}


#product-icon {
        font-size: 20px !important;
        color: #2B81D6;
}

#entityname {
        color: #575757;
        font-weight: 500;
        font-size: 16px;
}


.material-symbols-outlined {
        background-color: #113758;
        font-size: 25px !important;
        border-radius: 360px;
        box-shadow: -8px 2px 33px -4px rgba(0, 0, 0, 0.16) !important;
        color: #ffffff;
        margin-bottom: 10px !important;
        margin: auto;
        padding: 10px;

}


.row {
        display: flex;
        align-items: center;
        justify-content: center;

}

.big-bold {
        font-size: 1.5em;
        font-weight: bold;
}

.text-row-2 {
        font-size: 1.1em;
        color: #ffffff;
        padding: 10px
}

#icon-offert {
        color: #ffffff !important;
        margin: 5px;
}

@media only screen and (max-width: 600px) {
        .responsive-table .table-row {
                display: block;
        }

        .responsive-table .table-cell {
                display: block;
        }

        .responsive-table .table-cell .label {
                font-weight: bold;
        }
}

.product-card {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 10px;
}

.offer-card {
        border-radius: 10px;
        border: 0.5px solid #ccc;
        line-height: 4px;
        margin-top: 10px;
        padding: 20px;
        font-weight: 400;
}

.title-offer {
        font-size: 1.2em;
        font-weight: bold;
        color: #2B81D6;
}

#footer-card {
        background-color: #0b253a;
        color: white;
        display: flex;
        padding: 100px;
        justify-content: space-between;
        font-weight: 300;
        font-size: 18px;
}

#footer-card .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
}

#footer-card .column img {
        max-width: 100%;
        /* Ajusta según tus necesidades */
}

/* Para alinear los íconos y quitar el subrayado de los enlaces */
#footer-card .social-icons {
        display: flex;
        gap: 10px;
        /* Espacio entre los íconos */

}

.social-icons {
        width: 100px;

}

#footer-card a {
        text-decoration: none;
        color: white;
}

.general-title {
        font-size: 0.9em;
        font-weight: 500;
        color: #2B81D6;
}


.card-estado-actual {
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
}

/* } */
</style>
