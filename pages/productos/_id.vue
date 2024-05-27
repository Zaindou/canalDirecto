<template>
    <v-container class="pa-7 main-container">
        <Loader v-if="loading4" />
        <Header></Header>
        <div>
            <v-btn icon color="#0b2f44" @click="navigateTo('/simulador')" class="mb-1 ml-3">
                <v-icon>mdi-arrow-left</v-icon> Volver
            </v-btn>
        </div>
        <div>
            <p style="color: #666666; line-height: normal;">
                Descubre la solución que mejor se adapte a tu situación y negocia directamente con tu acreedor para
                llegar a un acuerdo financiero que beneficie tus finanzas.
            </p>
        </div>
        <div>
            <v-card>
                <v-card-text class="">
                    <span class="title">{{ producto ? producto.entidad : 'Cargando...' }}</span>
                    <br>
                    <span><b class="subtitle-1">Número de producto:</b> {{ producto ? producto.producto : 'Cargando...'
                        }}</span>
                    <br>
                    <span><b class="subtitle-1">Saldo reportado:</b> {{ producto ? formatCurrency(getMaxSaldo(producto))
            : 'Cargando...' }}</span>
                    <br>
                    <div v-if="producto && producto.en_negociacion">
                        <v-alert type="info" class="mt-3">
                            Este producto tiene un plan de pago en curso
                        </v-alert>
                        <div v-if="producto.detalles_acuerdo">
                            <span><b class="subtitle-1">Fecha de creación:</b> {{
            formattedDate(producto.detalles_acuerdo.date)
        }}</span>
                            <br>
                            <span><b class="subtitle-1">Valor total a pagar:</b> {{
                formatCurrency(producto.detalles_acuerdo.amount)
            }}</span>
                            <br>
                            <span><b class="subtitle-1">Día de pago:</b> {{ producto.detalles_acuerdo.paymentDay
                                }}</span>
                            <br>
                            <span><b class="subtitle-1">Fecha de pago cuota inicial :</b>
                                {{ formattedDate(producto.detalles_acuerdo.firstFeeDate) }}</span>
                            <br>
                            <v-divider class="my-3"></v-divider>
                            <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                                elevation="2" class="mt-6" @click="mostrarDetallesPlan = !mostrarDetallesPlan">
                                Ver detalles del plan de pago
                            </v-btn>
                            <v-expansion-panels v-if="mostrarDetallesPlan" class="mt-3">
                                <v-expansion-panel v-for="fee in producto.detalles_acuerdo.feeList" :key="fee.id">
                                    <v-expansion-panel-header>
                                        {{ fee.name }} - {{ formatCurrency(fee.amount) }}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col cols="12">
                                                <span><b>Estado:</b> {{ fee.state }}</span>
                                                <br>
                                                <span><b>Fecha de pago:</b> {{ formattedDate(fee.payment_date) }}</span>
                                                <br>
                                                <span><b>Pago pendiente:</b> {{ formatCurrency(fee.payment_balance)
                                                    }}</span>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </div>
                    <div v-if="producto && contactoProducto">
                        <span v-if="contactoProducto.nombre_comercial"><b class="subtitle-1">Nombre comercial:</b> {{
            contactoProducto.nombre_comercial }}</span>
                        <br v-if="contactoProducto.nombre_comercial">
                        <span v-if="contactoProducto.enlace_web"><b class="subtitle-1">Página web:</b> Encuentra
                            información <a :href="contactoProducto.enlace_web" target="_blank">aquí</a></span>
                        <br v-if="contactoProducto.enlace_web">
                        <span v-if="contactoProducto.enlace_portal"><b class="subtitle-1">Portal clientes:</b> Portal
                            transaccional <a :href="contactoProducto.enlace_portal" target="_blank">aquí</a></span>
                        <br v-if="contactoProducto.enlace_portal">
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <div class="mt-2 asesor">
            <v-expansion-panels>
                <v-expansion-panel v-if="producto.es_producto_qnt && !producto.en_negociacion">
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/negociarLinea.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Negociar en línea</div>
                                <p class="panel-description">
                                    Conoce las ofertas para saldar esta obligación en línea, selecciona el plan que más
                                    se ajuste a tus necesidades.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-divider class="mb-5"></v-divider>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-card-text elevation="0">
                                        <span class="title">{{ producto ? producto.entidad : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Estado del producto:</b> {{ producto ?
            producto.estado : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Saldo total:</b> {{ producto ?
            formatCurrency(getMaxSaldo(producto)) : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">% saldo de tus deudas:</b> {{ producto ?
            producto.participacion_mora : '' }}%</span>
                                        <v-select class="mt-4" :items="plazosNegociacion" label="Número de cuotas"
                                            v-model="cuotasSeleccionadas" outlined></v-select>
                                        <v-divider class="mb-4"></v-divider>
                                        <span><b class="subtitle-1">Valor total a pagar:</b> {{ valorTotalPagar
                                            }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Valor cuota inicial:</b> {{ valorCuotaInicial
                                            }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Valor cuota mes a mes:</b> {{ valorCuotaMensual
                                            }}</span>
                                        <br>
                                        <span><b class="subtitle-1">% de ahorro:</b> {{ porcentajeAhorro }}</span>
                                        <v-divider class="mb-1 mt-4"></v-divider>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu
                                                puntaje?:</b> {{ Math.round(producto.puntaje_por_cuota) }} puntos</span>
                                        <br>
                                        <div v-if="Math.round(producto.puntaje_por_cuota) != puntajePorCuota">
                                            <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu
                                                    puntaje mes a mes?:</b> {{ puntajePorCuota }} puntos</span>
                                            <br>
                                        </div>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto te acerca a tu
                                                objetivo?:</b> {{ Math.round(producto.aumento_puntaje_porcentaje)
                                            }}%</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Con cuántos puntos
                                                quedarías respecto a tu objetivo?</b> {{
            Math.round(producto.puntaje_por_cuota + localClientData.puntaje_crediticio)
        }} de {{ localClientData ? localClientData.objetivo_score : 'Cargando...'
                                            }}</span>
                                    </v-card-text>
                                    <v-btn block dark
                                        style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                                        elevation="2" class="mt-6" @click="abrirModal">
                                        Seleccionar plan
                                    </v-btn>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/simularProducto.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Simular producto</div>
                                <p class="panel-description">
                                    Simula tu producto y encuentra cómo resolver esta obligación ayudaría a tu perfil de
                                    crédito.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-divider class="mb-5"></v-divider>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-card-text elevation="0">
                                        <span class="title">{{ producto ? producto.entidad : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Estado del producto:</b> {{ producto ?
            producto.estado : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">Saldo total:</b> {{ producto ?
            formatCurrency(producto.saldo_total) : 'Cargando...' }}</span>
                                        <br>
                                        <span><b class="subtitle-1">% saldo de tus deudas:</b> {{ producto ?
            producto.participacion_mora : '' }}%</span>
                                        <v-select class="mt-4" :items="plazosSimulacion" label="Número de cuotas"
                                            v-model="cuotasSeleccionadas" outlined></v-select>
                                        <v-divider class="mb-4"></v-divider>
                                        <span style="color: #62AC21;"><b class="subtitle-1">Tu objetivo es:</b> {{
            localClientData ? localClientData.objetivo_financiero : 'Cargando...'
        }}</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto debe ser mi
                                                puntaje?:</b> {{ localClientData ? localClientData.objetivo_score :
            'Cargando...' }}</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu puntaje
                                                al saldar esta obligación?:</b> {{
            Math.round(producto.puntaje_por_cuota) }} puntos</span>
                                        <br>
                                        <div v-if="Math.round(producto.puntaje_por_cuota) != puntajePorCuota">
                                            <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto aumenta tu
                                                    puntaje mes a mes?:</b> {{ puntajePorCuota }} puntos</span>
                                            <br>
                                        </div>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Cuánto te acerca a tu
                                                objetivo?:</b> {{ Math.round(producto.aumento_puntaje_porcentaje)
                                            }}%</span>
                                        <br>
                                        <span style="color: #62AC21;"><b class="subtitle-1">¿Con cuántos puntos
                                                quedarías respecto a tu objetivo?</b> {{
            Math.round(producto.puntaje_por_cuota + localClientData.puntaje_crediticio)
        }} de {{ localClientData ? localClientData.objetivo_score : 'Cargando...'
                                            }}</span>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="producto && contactoProducto">
                    <v-expansion-panel-header>
                        <div class="panel-header-content">
                            <img :src="`/icons/contactoRecomendado.svg`" class="icono-svg" />
                            <div class="panel-text-content">
                                <div class="panel-title">Contacto recomendado</div>
                                <p class="panel-description">
                                    QNT te relaciona con la persona que podría ayudarte a saldar esta obligación, estás
                                    a solo una llamada.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p style="color: rgb(155, 155, 155); line-height: normal;">
                            En QNT te recomendamos contactarte con {{ contactoProducto.nombre_comercial }} para que
                            puedas negociar tus obligaciones en mora con:
                            <br>{{ contactoProducto.contacto_recomendado }}
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
                                    aquí.
                                </p>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p style="color: rgb(155, 155, 155); line-height: normal;">
                            Si prefieres, puedes contactar a {{ contactoProducto.nombre_comercial }} por Whatsapp para
                            que puedas negociar tus obligaciones en mora.
                        </p>
                        <div style="text-align: center;">
                            <a :href="contactoProducto.enlace_whatsapp" target="_blank">
                                <v-btn color="green" dark>
                                    <v-icon left>mdi-whatsapp</v-icon> Contactar por Whatsapp
                                </v-btn>
                            </a>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" elevation="2"
            class="mt-6" @click="navigateTo('/simulador')">
            REGRESAR
        </v-btn>

        <!-- Modal -->
        <v-dialog v-model="mostrarModal" max-width="600px">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="headline" style="color: #0b2f44;">Aceptación plan de pagos</span>
                    <v-btn icon @click="cerrarModal"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <p>Por favor ingresa la fecha en la que puedas realizar el pago de tu obligación. Recuerda que los
                        pagos oportunos son indispensables para mejorar tu perfil de crédito.</p>
                    <v-row>
                        <v-col cols="5" md="6">
                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fechaPagoCuotaInicial" label="Fecha de pago cuota inicial"
                                        prepend-inner-icon="mdi-calendar-month" readonly v-bind="attrs" v-on="on"
                                        outlined hide-details="auto" class="mb-2"></v-text-field>
                                </template>
                                <v-date-picker v-model="fechaPagoCuotaInicial" :min="minDate" :max="maxDate" no-title
                                    @input="menu = false"></v-date-picker>
                            </v-menu>
                            <v-select v-if="cuotasSeleccionadas > 1" v-model="diaPagoMesAMes" :items="[5, 16, 28]"
                                label="Día de pago mes a mes" prepend-inner-icon="mdi-calendar-cursor" outlined
                                hide-details="auto" class="mb-2"></v-select>
                        </v-col>
                        <v-divider class="my-4" vertical="true" aria-orientation="vertical"> </v-divider>
                        <v-col cols="7" md="6">
                            <span><b>Valor Total pagar:</b> {{ valorTotalPagar }}</span>
                            <br>
                            <span><b>Valor cuota inicial:</b> {{ valorCuotaInicial }}</span>
                            <br>
                            <span><b>Fecha cuota inicial:</b> {{ fechaPagoCuotaInicial }}</span>
                            <br>
                            <span v-if="cuotasSeleccionadas > 1"><b>Valor cuota mes a mes:</b> {{ valorCuotaMensual
                                }}</span>
                            <br>
                            <span v-if="cuotasSeleccionadas > 1"><b>Día de pago mensual:</b> {{ diaPagoMesAMes }}</span>
                        </v-col>
                    </v-row>
                    <v-alert class="mt-3" color="#dff0e9">
                        <v-row>
                            <v-col cols="1">
                                <v-icon style="color: #0b2f44; text-align: center;">mdi-alert-outline</v-icon>
                            </v-col>
                            <v-col cols="11">
                                <p style="color: #0b2f44;">Los documentos de tu plan de pagos llegarán a tu correo
                                    electrónico registrado.
                                </p>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn block dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                        @click="aceptarPlanDePagos" hide-details="auto">
                        Aceptar plan de pagos
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Alerta de felicitación -->
        <v-dialog v-model="mostrarFelicitacion" max-width="600px" persistent>
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="headline" style="color: #0b2f44;">¡Felicitaciones!</span>
                    <!-- Removed the close button -->
                </v-card-title>
                <v-card-text>
                    <p>¡Has aceptado el plan de pagos! Ahora puedes realizar tus dando click a <b>Realizar pagos</b>
                    </p>

                    <p>Recuerda que tu primer pago es el <b>{{ formattedDate(fechaPagoCuotaInicial) }}</b> por un valor
                        de <b>{{
                            valorCuotaInicial }}</b>.</p>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn block dark href="https://qnt.com.co/pagos-qnt/" target="_blank"
                        style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%); color: white;">
                        Realizar pagos
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import axios from 'axios';
import Header from '/components/commons/Header.vue';
import Productos from '~/components/commons/Products.vue';
import Loader from '~/components/commons/LoaderForm.vue'
import { useMainStore } from '@/store/mainStore';

export default {
    components: {
        Productos,
        Header,
        Loader,
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
        plazosNegociacion: [],
        plazosSimulacion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36],
        puntajePorCuota: 0,
        puntajeTotalDespuesDeSaldar: 0,
        cuotasSeleccionadas: 1,
        contactoProducto: null,
        valorTotalPagar: '',
        valorCuotaInicial: '',
        valorCuotaMensual: '',
        porcentajeAhorro: '',
        mostrarModal: false,
        mostrarFelicitacion: false,
        fechaPagoCuotaInicial: new Date().toISOString().substr(0, 10),
        diaPagoMesAMes: 5,
        menu: false,
        email: '',
        numeroCelular: '',
        loading4: false,
        mostrarDetallesPlan: false,
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
        minDate() {
            const today = new Date();
            return today.toISOString().substr(0, 10);
        },
        maxDate() {
            const today = new Date();
            const maxDate = new Date(today);
            maxDate.setDate(today.getDate() + 5);
            return maxDate.toISOString().substr(0, 10);
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
        getMaxSaldo(producto) {
            // Retorna el mayor valor entre saldo_total y valor_total_sf
            return Math.max(producto.saldo_total || 0, producto.valor_total_sf || 0);
        },
        formattedDate(date) {
            // Verificar si 'date' es una instancia de Date, si no, convertirla
            if (!(date instanceof Date)) {
                date = new Date(date);
            }

            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

            const dayOfWeek = days[date.getDay()];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            return `${dayOfWeek}, ${day} de ${month} de ${year}`;
        },
        calcularPuntajePorCuota() {
            if (this.producto && this.cuotasSeleccionadas) {
                this.puntajePorCuota = Math.round(this.producto.puntaje_por_cuota / this.cuotasSeleccionadas);
            }
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        cargarOpcionesCuotasNegociacion() {
            if (this.ofertas) {
                this.plazosNegociacion = Object.values(this.ofertas).map(oferta => oferta.plazo);
            }
        },
        actualizarDetallesOferta() {
            if (this.ofertas) {
                const ofertaSeleccionada = this.ofertas[this.cuotasSeleccionadas - 1];
                if (ofertaSeleccionada) {
                    this.valorTotalPagar = this.formatCurrency(ofertaSeleccionada.saldo_total);
                    this.valorCuotaInicial = this.formatCurrency(ofertaSeleccionada.cuota_inicial);
                    this.valorCuotaMensual = this.formatCurrency(ofertaSeleccionada.cuota);
                    this.porcentajeAhorro = `${((1 - ofertaSeleccionada.monto_final_oferta / this.producto.saldo_total) * 100).toFixed(2)}%`;
                }
            }
        },
        abrirModal() {
            this.mostrarModal = true;
        },
        cerrarModal() {
            this.mostrarModal = false;
        },
        abrirFelicitacion() {
            this.mostrarFelicitacion = true;
        },
        cerrarFelicitacion() {
            this.mostrarFelicitacion = false;
        },
        redireccionar() {
            this.$router.push('/inicio');
        },
        async fetchData() {
            let token, cedula;
            if (process.client) {
                token = localStorage.getItem('auth_token');
                cedula = localStorage.getItem('numero_identificacion');
            }

            try {
                const response = await axios.get(`/diagnostico/client-data/${cedula}`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                this.clientData = response.data.informacionCliente;
                this.productos = response.data.wazeQnt.all_products;
                this.productosAcuerdo = response.data.wazeQnt.products_with_agreement;
                this.productosOferta = response.data.wazeQnt.products_with_offer;
                this.otrosProductos = response.data.wazeQnt.other_products;

                const mainStore = useMainStore();
                mainStore.setClientData(this.clientData);
                mainStore.setProductos(this.productos);
                // Uncomment the following lines if needed
                // mainStore.setProductosAcuerdo(this.productosAcuerdo);
                // mainStore.setProductosOferta(this.productosOferta);
                // mainStore.setOtrosProductos(this.otrosProductos);
            } catch (error) {
                // Log any errors to the console
                console.error('Error fetching client data:', error);
            }
        },
        async aceptarPlanDePagos() {
            this.loading4 = true;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token 102f3176da1514c43cfe85bc6615b48e67821683'
            };

            const data = {
                products: [this.producto.id_producto_sf],
                management: {
                    action: 'Nuevo de acuerdo de pago',
                    contactState: 'Cliente Contactado',
                    principalResult: 'Acuerdo Vigente',
                    detailResult: 'Acuerdo Nuevo',
                    explanation: 'El cliente acepto propuesta',
                    location: this.localClientData.ubicacion_id,
                    channel: 'Landing Page',
                    observations: 'Acuerdo realizado mediante Canal Directo.',
                    user: this.localClientData.id_cliente_sf,
                },
                paymentAgreement: {
                    term: this.cuotasSeleccionadas,
                    firstFee: parseInt(this.valorCuotaInicial.replace(/[^\d]/g, ''), 10),
                    amount: parseInt(this.valorTotalPagar.replace(/[^\d]/g, ''), 10),
                    offer: {
                        plazo: this.cuotasSeleccionadas,
                        tasa: 0,
                        cuota_inicial: parseInt(this.valorCuotaInicial.replace(/[^\d]/g, ''), 10),
                        cuota: parseInt(this.valorCuotaMensual.replace(/[^\d]/g, ''), 10),
                        ultima_cuota: parseInt(this.valorCuotaMensual.replace(/[^\d]/g, ''), 10),
                        monto_financiar: parseInt(this.valorTotalPagar.replace(/[^\d]/g, ''), 10),
                        monto_final_oferta: parseInt(this.valorTotalPagar.replace(/[^\d]/g, ''), 10),
                        saldo_total: this.producto.saldo_total,
                        porcentaje_descuento: (1 - parseInt(this.valorTotalPagar.replace(/[^\d]/g, ''), 10) / this.producto.saldo_total).toFixed(4),
                        monto_oferta_remanente: parseInt(this.valorCuotaMensual.replace(/[^\d]/g, ''), 10),
                        nivel: 'suggested_offer',
                        plan: 'ESTANDAR',
                    },
                    paymentDay: this.diaPagoMesAMes,
                    firstFeeDate: this.fechaPagoCuotaInicial,
                    motivationDebt: 'Cierre de negocio',
                    sourceIncome: 'Compra de cartera',
                    office: 'Canal Directo',
                    capital: this.producto.saldo_capital_sf,
                    totalDebt: this.producto.saldo_total,
                },
                proposal: {
                    firstFee: 0,
                    amount: 0,
                    monthlyFee: 0,
                    lastFee: 0,
                    totalAmount: 0,
                },
                complement: {
                    cbirthCity: null,
                },
                exception: {},
                plan: 'ESTANDAR',
                email: this.email,
                cellPhone: this.numeroCelular,
            };

            await axios.post('/diagnostico/acuerdo/', data, { headers })
                .then(response => {
                    this.cerrarModal();
                    this.fetchData();
                    this.loading4 = false;
                    this.abrirFelicitacion();
                    setTimeout(this.redireccionar, 10000); // Redirigir después de 10 segundos
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

    },
    watch: {
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                this.products = newValue;
                this.idProducto = this.$route.params.id;
                this.email = localStorage.getItem('email');
                this.numeroCelular = localStorage.getItem('phone');

                for (let producto of this.products) {
                    if (producto.id_producto === this.idProducto) {
                        this.producto = producto;
                        this.contactoProducto = this.producto.contacto;
                        this.puntajePorCuota = Math.round(producto.puntaje_por_cuota / this.cuotasSeleccionadas);
                        this.ofertas = this.producto.ofertas;
                        this.cargarOpcionesCuotasNegociacion(); // Cargar opciones de cuotas al cargar el producto
                        this.actualizarDetallesOferta(); // Actualizar detalles de la oferta al cargar el producto
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
                this.actualizarDetallesOferta(); // Actualizar detalles de la oferta al cambiar la cuota seleccionada
                if (this.localClientData && this.puntajePorCuota !== undefined) {
                    this.puntajeTotalDespuesDeSaldar = Math.round(this.localClientData.puntaje_crediticio + this.puntajePorCuota);
                }
            }
        },
    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();

        // Recuperar el valor de selectedQuota de localStorage
        const storedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        const selectedProduct = storedProducts.find(p => p.id_producto === this.idProducto);
        if (selectedProduct) {
            this.cuotasSeleccionadas = selectedProduct.selectedQuota || 1;
        }
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

.headline {
    font-size: 1.1rem !important;
    font-weight: bold;
    color: #0b2f44;
    text-align: left !important;
}

@media (min-width: 960px) {
    .panel-header-content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
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
