<template>
        <div class="principal-container">
                <v-alert border="buttom" color="info" dark class="banner-text">
                        <h4 class="mb-1"><b>¡Felicitaciones, {{ clientData.nombre_completo }}!</b></h4>
                        <p>Aquí tienes tu diagnóstico financiero QNT del {{ fechaFormateada }}, en el que encontrarás un
                                análisis
                                de tu situación financiera actual y algunas recomendaciones para mejorar tu perfil crediticio.
                        </p>
                </v-alert>
                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon" large>mdi-notebook-outline</v-icon> Resumen de
                        tu diagnóstico</h3>
                <RiskMeter class="mb-3" :score="clientData.puntaje_crediticio" />

                <v-card class="mb-5">
                        <v-list>
                                <v-list-item>
                                        <v-list-item-content>
                                                <v-list-item-title><b>Objetivo financiero</b></v-list-item-title>
                                                {{ clientData.objetivo_financiero }}
                                                <v-list-item-title><b>¿Hoy qué tan cerca estas de este
                                                                objetivo?</b></v-list-item-title>
                                                {{ clientData.porcentaje_avance_actual }}%
                                        </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                        <v-list-item-content>
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
                                                <v-list-item-title><b>Saldo productos vigentes</b></v-list-item-title>
                                                {{ formatCurrency(clientData.saldo_total_productos) }}
                                                <v-list-item-title><b>Saldo deudas activas</b></v-list-item-title>
                                                {{ formatCurrency(clientData.saldo_total_productos_mora) }}
                                        </v-list-item-content>
                                </v-list-item>
                        </v-list>
                </v-card>
                <h3 style="color:#2B81D6;" class="mb-1"> <v-icon id="product-icon" large>mdi-pencil-outline</v-icon>
                        Recomendaciones financieras para {{ clientData.objetivo_financiero }}</h3>
                <v-card class="mb-5">
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

                <v-expansion-panels accordion hover-focus class="mb-5">
                        <v-expansion-panel v-for="producto in sortedProducts" :key="producto.id">
                                <v-expansion-panel-header
                                        :class="{ 'border-green': producto.estado === 'Al día', 'border-red': producto.estado !== 'Al día' }">
                                        <div>
                                                <span id="entityname">{{ producto.entidad }}</span>
                                                <br>Número de producto: {{ producto.producto }}
                                                <br>Estado del producto: {{ producto.estado }}

                                        </div>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                        <div>
                                                <strong>Producto:</strong> {{ producto.tipo_producto }}

                                                <br><strong>Antigüedad (En días):</strong> {{ producto.antiguedad }}
                                                <br><strong>Días en mora:</strong> {{ producto.dias_en_mora }}
                                                <br><strong>Saldo total:</strong> {{ formatCurrency(producto.saldo_total) }}
                                                <br><strong>Cuota promedio:</strong> {{ formatCurrency(producto.cuota) }}
                                                <br><strong>Porcentaje del saldo total de tus productos vigentes:</strong> {{
                                                        producto.participacion_al_dia }}%
                                                <br><strong>Porcentaje del saldo total de tus deudas vigentes: </strong>{{
                                                        producto.participacion_mora }}%

                                        </div>
                                </v-expansion-panel-content>
                        </v-expansion-panel>
                </v-expansion-panels>

                <h3 style="color:#2B81D6;" class="mb-1"><v-icon id="product-icon"
                                large>mdi-checkbox-marked-circle-outline</v-icon> Presupuesto sugerido
                </h3>
                <v-alert color="light-blue darken-1" dark border="left" prominent>
                        <strong>Recuerda</strong> <br>Las recomendaciones se basan en tu comportamiento financiero individual.
                        No incluyen los ingresos o gastos de tu núcleo familiar. Si compartes gastos e ingresos con otras
                        personas, ten en cuenta esta información adicional al establecer tu presupuesto. Recuerda que estas
                        recomendaciones son de expertos economistas y están diseñadas para guiarte hacia una mejor salud
                        financiera </v-alert>

                <v-card class="pa-5 mb-5 card-estado-actual" outlined>

                        <v-row>
                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Tus ingresos netos:</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.ingresos_sin_prestaciones) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Pagos promedio de tus productos</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.pagos_promedio_mes) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Recomendación gastos básicos:</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.recomendacion_gastos_basicos) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Recomendación para pagar tus deudas:</strong>
                                        <p class="my-0">{{ formatCurrency(clientData.recomendacion_pago_deudas) }}</p>
                                </v-col>

                                <v-col cols="12" sm="6" class="py-1">
                                        <strong>Disponible para deudas:</strong>
                                        <p v-if="clientData.disponible_saldar_deudas >= 0" class="my-0">
                                                {{ formatCurrency(clientData.disponible_saldar_deudas) }}
                                        </p>
                                        <p v-else class="my-0">
                                                $0 - Sin disponibilidad para saldar deudas. Prioriza el pago de tus obligaciones
                                                y libera espacio para abordar el resto de tus deudas.
                                        </p>
                                </v-col>
                        </v-row>
                </v-card>

                <h3 style="color:#2B81D6;" class="mb-5"><v-icon id="product-icon" large>mdi-wallet-plus-outline</v-icon>
                        Comienza tu rebancarización con QNT</h3>

                <div v-if="messageOfferClient()">

                        <v-alert color="light-green" dark icon="mdi-party-popper" border="left" prominent>
                                <strong>¡Felicitaciones!</strong> <br>
                                QNT Tiene el 18% del saldo total de tus deudas y tenemos una oferta(s) para ti, conócelas a
                                continuación:</v-alert>
                </div>

                <v-expansion-panels class="mb-3">
                        <v-expansion-panel v-for="(producto, index) in productos" :key="index"
                                v-if="producto.es_producto_qnt && producto.ofertas">

                                <v-expansion-panel-header>
                                        <div>
                                                <span id="entityname">{{ producto.entidad }}</span>
                                                <br>Estado del producto: {{ producto.estado }}
                                                <br>Part. En mora: {{ producto.participacion_mora }}%
                                                <br>Saldo total del producto: {{ formatCurrency(producto.saldo_total) }}

                                        </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                        <div class="offer-card" v-for="(oferta, i) in producto.ofertas" :key="i">
                                                <p class="title-offer">Puedes pagar este producto en: {{ oferta.plazo }}
                                                        cuota(s)</p>
                                                <p><strong>Valor total pagar: </strong> {{
                                                        formatCurrency(oferta.monto_final_oferta)
                                                }}</p>
                                                <p><strong>Tu cuota inicial es de: </strong> {{
                                                        formatCurrency(oferta.cuota_inicial) }}
                                                </p>
                                                <p><strong>Valor de la cuota mes a mes:</strong> {{ formatCurrency(oferta.cuota)
                                                }}</p>
                                                <p><strong>De esta manera ahorraras:</strong> {{ ((1 -
                                                        (oferta.monto_final_oferta /
                                                                producto.saldo_total)) * 100).toFixed(2) }}%</p>
                                                <p>Si seleccionas este plan avanzaras
                                                        <b>{{
                                                                roundPercentage(producto.contacto ?
                                                                        producto.contacto.hacia_objetivo :
                                                                        producto.scores_by_term[oferta.plazo].aumento_puntaje_objetivo)
                                                        }}%</b>
                                                        para {{ clientData.objetivo_financiero }} y quedaras a un <b>{{
                                                                roundPercentage(producto.scores_by_term[oferta.plazo].aumento_puntaje_porcentaje)
                                                        }}</b>% de
                                                        este objetivo.
                                                        De acuerdo a la ley 1266 de 2008 de habeas Data tardaras
                                                        <b>{{
                                                                producto.contacto ? producto.contacto.tiempo_meses :
                                                                roundMonths(producto.scores_by_term[oferta.plazo].tiempo_meses)
                                                        }}</b>
                                                        meses en eliminar este reporte negativo de las centrales de riesgo.
                                                </p>
                                        </div>
                                        <v-alert class="mt-3" type="info" dense text>
                                                <p>
                                                        <strong>Comienza tu Rebancarización con QNT</strong>
                                                </p>
                                                <p>
                                                        Si deseas adquirir alguna de nuestras ofertas, por favor escríbenos a
                                                        nuestro
                                                        <a href="https://wa.link/bcjlk0" target="_blank"
                                                                style="color:inherit;">Whatsapp aquí</a>
                                                        o escríbenos a nuestro correo eléctronico:
                                                        <a href="mailto:diagnosticofinanciero@qnt.com.co"
                                                                style="color:inherit;">diagnosticofinanciero@qnt.com.co</a>
                                                </p>
                                        </v-alert>

                                </v-expansion-panel-content>
                        </v-expansion-panel>
                </v-expansion-panels>

                <div v-if="othersDebs()">
                        <h4 style="color:#2B81D6;" class="mb-1">Deudas sin oferta de QNT</h4>
                        <v-expansion-panels class="mb-5">
                                <v-expansion-panel v-for="(producto, index) in productos" :key="index"
                                        v-if="!producto.ofertas && producto.estado != 'Al día'">
                                        <v-expansion-panel-header>
                                                <div>
                                                        <span id="entityname">{{ producto.entidad }}</span>
                                                        <br>Estado del producto: {{ producto.estado }}
                                                        <br>Part. En mora: {{ producto.participacion_mora }}%
                                                        <br>Saldo total del producto: {{ formatCurrency(producto.saldo_total) }}

                                                </div>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                                <p v-if="producto.contacto">Para ponerte al día con esta obligación, debes
                                                        contactarte
                                                        con la entidad a:
                                                        <br><strong>Correo:</strong> {{ producto.contacto.correo_contacto }}
                                                        <br><strong>Teléfono:</strong> {{ producto.contacto.numero_contacto }}
                                                </p>
                                                <p v-else>Actualmente no contamos con una oferta desde QNT para que puedas pagar
                                                        este producto; Sin embargo, te recomendamos contactarte con la entidad
                                                        {{ producto.entidad }} para que puedas negociar esta deuda.</p>
                                                <p>Lo que si podemos decirte es que si pagas esta deuda en un solo plazo te
                                                        acercarás
                                                        <b>{{
                                                                roundPercentage(producto.contacto ?
                                                                        producto.contacto.hacia_objetivo :
                                                                        producto.scores_by_term["1"].aumento_puntaje_objetivo) }}%</b>
                                                        para {{ clientData.objetivo_financiero }} y quedaras a un <b>{{
                                                                roundPercentage(producto.scores_by_term["1"].aumento_puntaje_porcentaje)
                                                        }}</b>% de
                                                        este objetivo.
                                                        De acuerdo a la ley 1266 de 2008 de habeas Data tardaras
                                                        <b>{{
                                                                producto.contacto ? producto.contacto.tiempo_meses :
                                                                roundMonths(producto.scores_by_term["1"].tiempo_meses) }}</b>
                                                        meses en eliminar este reporte negativo de las centrales de riesgo.
                                                </p>
                                        </v-expansion-panel-content>
                                </v-expansion-panel>
                        </v-expansion-panels>
                </div>
                <div v-else>
                        <v-alert color="light-green" dark icon="mdi-party-popper" border="left" prominent>
                                <strong>¡FELICIDADES!</strong> <br>
                                Tienen un buen comportamiento.</v-alert>
                </div>

        </div>
</template>


<script>
import RiskMeter from './commons/RiskMeter.vue';
export default {
        components: {
                RiskMeter
        },
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
                },
                roundMonths(value) {
                        return parseFloat(value).toFixed(0);
                },
                messageOfferClient() {
                        for (const i in this.productos) {
                                if (this.productos[i].es_producto_qnt == true) {
                                        return true;
                                } else if (this.productos[i].es_producto_qnt == true && this.productos[i].estado === 'Al día') {
                                        return true;
                                } else if (this.productos[i].es_producto_qnt == true && this.productos[i].estado != 'Al día') {
                                        return true;
                                } else {
                                        return false;
                                }
                        }

                },
                othersDebs() {
                        for (const i in this.productos) {
                                if (this.productos[i].es_producto_qnt == false || this.productos[i].estado != 'Al día') {
                                        return true;
                                } else if (this.productos[i].es_producto_qnt == false && this.productos[i].estado === 'Al día') {
                                        return false;
                                } else {
                                        return false;
                                }
                        }
                },
        },
        computed: {
                fechaFormateada() {
                        const fecha = new Date(this.clientData.fecha_diagnostico);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
                        const año = fecha.getFullYear();
                        return `${dia}/${mes}/${año}`;
                },

                sortedProducts() {
                        return [...this.productos].sort((a, b) => {
                                if (a.estado === 'Al día' && b.estado !== 'Al día') {
                                        return 1;
                                } else if (a.estado !== 'Al día' && b.estado === 'Al día') {
                                        return -1;
                                } else {
                                        return 0;
                                }
                        });
                },
        }
}

</script>

<style scoped>
.principal-container {
        padding: 5px;
        position: relative;
}


.banner-text {
        font-size: 12px !important;
        color: #ffffff !important;
        line-height: 1.5 !important;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
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
        line-height: 1.5;
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

.banner-text {
        padding: 20px;
        border-radius: 5px;
        color: white;
        font-size: 18px;
}

.banner-text h4 {
        font-size: 20px;
        margin-bottom: 10px;
}

.v-list-item__title {
        font-size: 16px;
        font-weight: 500;
        color: #636363f5;
}

.v-list-item__content {
        font-size: 14px;
        font-weight: 400;
        color: #636363f5;
}

.custom-panel {
        position: relative;
}

.custom-panel::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 5px;
}

.border-green {
        border-left: 5px solid #81c784 !important;
}

.border-red {
        border-left: 5px solid rgb(247, 103, 103) !important;
}
</style>
