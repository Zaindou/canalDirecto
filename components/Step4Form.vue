<template>
  <div class="principal-container">
    <div>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12">
            <h3 class="text-center" style="color:#00263C;">
              {{
                clientData.nombre_completo }}
            </h3>
            <p class="mt-3 px-1 text-center mb-1" style="color:#636363f5;">
              ¡Felicitaciones! Has realizado tu diagnóstico financiero QNT el día
              <b>{{ fechaFormateada }}</b>, si necesitas asesoría recuerda que puedes
              contactarnos en nuestros canales de atención:
            </p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="d-flex justify-center" cols="12" sm="12">
            <a href="https://wa.link/h1y0vn" target="_blank" style="text-decoration: none;">
              <v-btn dark class="mx-2" color="green">
                <v-icon left>mdi-whatsapp</v-icon>
                WhatsApp
              </v-btn>
            </a>
            <!-- email button -->
            <a href="mailto:diagnosticofinanciero@qnt.com.co" style="text-decoration: none;">
              <v-btn dark class="mx-2" color="light-blue darken-1">
                <v-icon left>mdi-email</v-icon>
                Email
              </v-btn>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-divider class="mt-5 mb-5" :thickness="2" />
    <div style="text-align: center; text-justify: center;">
      <v-container>
        <v-row align="start">
          <v-col cols="6" sm="6" class="d-flex flex-column">
            <p class="title__chunk_1">
              MI PUNTAJE
            </p>
            <span class="content__chunk__1">{{ clientData.puntaje_crediticio }}</span>
          </v-col>
          <v-col cols="6" sm="6" class="d-flex flex-column">
            <p class="title__chunk_1">
              MI OBJETIVO <v-icon small class="ml-1" v-on="on" @click="dialogObjetivo = true">
                mdi-information-outline
              </v-icon>
            </p>
            <span class="content__chunk__1">{{ clientData.objetivo_financiero }}</span>
          </v-col>
          <v-col cols="12" sm="12">
            <RiskMeter
              :score="clientData.puntaje_crediticio"
              :goal-score="clientData.objetivo_score"
              :porcentage-target="clientData.porcentaje_avance_actual"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <p class="title__chunk_1">
              CALIFICACIÓN DE RIESGO
              <v-icon small class="ml-1" v-on="on" @click="dialog = true">
                mdi-information-outline
              </v-icon>
            </p>
            <span class="content__chunk__1">{{ riskLevel }}</span>
            <v-dialog v-model="dialog" max-width="400">
              <v-card>
                <v-card-title class="headline">
                  Calificación de
                  Riesgo
                </v-card-title>
                <v-card-text>
                  <b style="color:#81c784;">Bajo:</b> Significa que tienes
                  el
                  menor nivel de
                  riesgo en
                  el cumplimiento de tus obligaciones financieras."
                  <br>
                  <br><b style="color:#ffb74d;">Medio:</b> Significa un
                  nivel
                  moderado de riesgo
                  en el
                  cumplimiento de tus obligaciones financieras."
                  <br>
                  <br><b style="color:#e57373;">Alto:</b> Significa que
                  existe un
                  mayor riesgo de
                  incumplimiento en el pago de tus obligaciones
                  financieras."
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    block
                    dark
                    style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                    elevation="2"
                    @click="dialog = false"
                  >
                    Entendido
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogObjetivo" max-width="400">
              <v-card>
                <v-card-text justify="center" class="py-5" style="font-weight: 400; font-size: 1em; text-align:center;">
                  <span>Recuerda que al pagar tus obligaciones financieras
                    quedarás en estado “pago voluntario” y tu
                    puntaje de crédito aumentará mientras demuestres
                    un buen comportamiento de pago. Alcanzar el
                    puntaje adecuado podría permitirte acceder a
                    crédito. Esto dependerá de las políticas de cada
                    entidad financiera.</span>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    block
                    dark
                    style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                    elevation="2"
                    @click="dialogObjetivo = false"
                  >
                    Entendido
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="12">
            <p class="title__recommendation">
              RECOMENDACIÓN:
            </p>
            <p class="content__recomendation">
              {{ clientData.recomendacion }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-divider class="mt-5 mb-10" :thickness="2" />
    <div>
      <h4 style="color:#00263C; text-align: center;" class="mb-1">
        <v-icon id="product-icon" large>
          mdi-wallet-outline
        </v-icon>TUS PRODUCTOS VIGENTES
      </h4>

      <div style="text-align: center;" class="mb-3">
        <v-container>
          <v-row align="center">
            <v-col cols="12" sm="5">
              <v-card>
                <v-card-title
                  class="title__chunk_1"
                  style="padding-bottom: 0px; padding-right: 0px; padding-left: 0px; padding-top: 7px;"
                >
                  Saldo
                  de tus
                  productos
                </v-card-title>
                <v-card-text style="font-weight: 600; font-size: 1em;">
                  {{ formatCurrency(clientData.saldo_total_productos)
                    ? formatCurrency(clientData.saldo_total_productos)
                    : '$ 0' }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="5">
              <v-card>
                <v-card-title
                  class="title__chunk_1"
                  style="padding-bottom: 0px; padding-right: 0px; padding-left: 0px; padding-top: 7px;"
                >
                  Saldo
                  en mora
                </v-card-title>
                <v-card-text style="font-weight: 600; font-size: 1em;">
                  {{ formatCurrency(clientData.saldo_total_productos_mora)
                    ? formatCurrency(clientData.saldo_total_productos_mora)
                    : '$ 0' }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-expansion-panels v-model="panel" accordion hover-focus class="mb-5">
        <v-expansion-panel v-for="producto in sortedProducts" :key="producto.id">
          <v-expansion-panel-header
            :class="{ 'border-green': producto.estado === 'Al día', 'border-red': producto.estado !== 'Al día' }"
          >
            <div>
              <span id="entityname">{{ producto.entidad }}</span>
              <br>Número de producto: {{ producto.producto }}
              <br>Estado de producto: {{ producto.estado }}
              <br>Saldo total: {{ formatCurrency(producto.saldo_total) }}
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <div>
              <v-row>
                <v-col cols="12" sm="12">
                  <strong class="product__titles">Producto:</strong>
                  <span class="product__content">{{ producto.tipo_producto
                  }}</span>
                  <br><strong class="product__titles">Antigüedad (en
                    días):</strong>
                  <span class="product__content">{{ producto.antiguedad
                  }}</span>
                  <br><strong class="product__titles">Días en
                    mora:</strong>
                  <span class="product__content">{{ producto.dias_en_mora
                  }}</span>
                  <br><strong class="product__titles">Cuota:</strong>
                  <span class="product__content">{{
                    formatCurrency(producto.cuota) }}</span>
                  <br><strong class="product__titles">% del saldo de tus
                    productos vigentes:</strong>
                  <span class="product__content">{{
                    producto.participacion_al_dia }}%</span>
                  <br><strong class="product__titles">% del saldo de tus
                    deudas(en mora):</strong>
                  <span class="product__content">{{
                    producto.participacion_mora }}%</span>
                </v-col>
              </v-row>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div>
      <h4 style="color:#00263C; text-align: center;" class="mb-1">
        <v-icon id="product-icon" large>
          mdi-checkbox-marked-circle-outline
        </v-icon> PRESUPUESTO SUGERIDO
        <v-icon small class="ml-1" v-on="on" @click="dialogPresupuesto = true">
          mdi-information-outline
        </v-icon>
      </h4>

      <v-dialog v-model="dialogPresupuesto" max-width="400">
        <v-card>
          <v-card-text class="py-5" style="font-weight: 400; font-size: 1em;">
            Estas recomendaciones se basan en tu comportamiento financiero
            individual.
            No incluyen los ingresos o gastos de tu núcleo familiar. Si compartes gastos e
            ingresos con
            otras
            personas, ten en cuenta esta información adicional al establecer tu presupuesto.
            Recuerda que
            estas
            recomendaciones son de expertos economistas y están diseñadas para guiarte hacia
            una mejor salud
            financiera
            <br>
            <br><b>Ingresos netos: </b><span>Corresponde a tus ingresos descontando las
              prestaciones, aportes a salud y pensiones.</span>
            <br>
            <br><b>Pago de tus productos al día: </b><span>Corresponde a la suma de los
              pagos
              promedio de tus productos al día que reportan las centrales de
              riesgo.</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              block
              dark
              style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
              elevation="2"
              @click="dialogPresupuesto = false"
            >
              Entendido
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card class="pa-4 mb-5 card-estado-actual" outlined>
        <v-row>
          <v-col cols="4" sm="4" class="d-none d-sm-block">
            <img style="border-radius: 30%;" src="../static/presupuesto.svg" width="150" alt="">
          </v-col>
          <v-col cols="8" sm="8" class="py-1">
            <strong class="product__titles">Ingresos
              netos<v-icon
                small
                class="ml-1"
                v-on="on"
                @click="dialogPresupuesto = true"
              >mdi-information-outline</v-icon>:</strong>
            <p class="my-0 product__content">
              {{
                formatCurrency(clientData.ingresos_sin_prestaciones) }}
            </p>
            <strong class="product__titles">Pago
              de tus productos al día<v-icon
                small
                class="ml-1"
                v-on="on"
                @click="dialogPresupuesto = true"
              >mdi-information-outline</v-icon>:</strong>
            <p class="my-0 product__content">
              {{
                formatCurrency(clientData.pagos_promedio_mes) }}
            </p>
            <strong class="product__titles">Recomendación gastos básicos:</strong>
            <p class="my-0 product__content">
              {{
                formatCurrency(clientData.recomendacion_gastos_basicos) }}
            </p>
            <strong class="product__titles">Recomendación pago obligaciones:</strong>
            <p class="my-0 product__content">
              {{
                formatCurrency(clientData.recomendacion_pago_deudas) }}
            </p>
            <strong class="product__titles">Disponible para pago de obligaciones:</strong>
            <p v-if="clientData.disponible_saldar_deudas >= 0" class="my-0 product__content">
              {{ formatCurrency(clientData.disponible_saldar_deudas) }}
            </p>
            <p v-else class="my-0 product__content">
              $0 - Sin disponibilidad para saldar deudas. Prioriza el pago de tus
              obligaciones
              y libera espacio para abordar el resto de tus deudas.
            </p>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-if="messageOfferClient()">
      <v-alert color="light-green" dark icon="mdi-party-popper" prominent>
        <strong>¡Felicitaciones!</strong> QNT Tiene el <b>{{ roundPercentage(totalPorcentageDebt())
        }}%</b> del saldo total de tus deudas
        y
        tenemos una oferta(s)
        para ti, comeinza tu Rebancarización ahora y mejora tu puntaje de crédito.
      </v-alert>
      <div>
        <h4 style="color:#00263C; text-align: center;" class="mb-1">
          <v-icon id="product-icon" large>
            mdi-wallet-plus-outline
          </v-icon>CONOCE LOS PLANES CON QNT
        </h4>
        <v-expansion-panels v-model="panel" class="mb-3">
          <v-expansion-panel v-for="(producto, index) in productosOferta" :key="index">
            <v-expansion-panel-header>
              <div>
                <span id="entityname">{{ producto.entidad }}</span>
                <br>Estado del producto: {{ producto.estado }}
                <br>Saldo total: {{ formatCurrency(producto.saldo_total) }}
                <br>Part. En mora: {{ producto.participacion_mora }}%
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-divider class="mt-5 mb-5" :thickness="2" />
              <div>
                <v-row>
                  <v-col cols="6">
                    <p class="title__chunk_1">
                      Selecciona el plazo
                      que
                      se ajuste
                      a tus necesidades financieras
                    </p>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="selectedTerm"
                      :items="fees"
                      label="Selecciona el plazo"
                      solo
                      @change="selectOffer(producto, $event)"
                    />
                  </v-col>
                </v-row>
                <div style="text-align: center;">
                  <v-row>
                    <v-col cols="6">
                      <p v-if="producto.selectedOffer">
                        <strong class="product__titles">Valor
                          total a pagar: </strong>
                        <span style="color:#81c784; font-weight: 500;">{{
                          formatCurrency(producto.selectedOffer.monto_final_oferta)
                        }}</span>
                      </p>

                      <p v-if="producto.selectedOffer">
                        <strong class="product__titles">Cuota
                          mes a
                          mes:</strong>
                        <span style="color:#81c784; font-weight: 500;">{{
                          formatCurrency(producto.selectedOffer.cuota)
                        }}</span>
                      </p>
                    </v-col>
                    <v-col cols="6">
                      <p v-if="producto.selectedOffer">
                        <strong class="product__titles">Cuota
                          inicial:</strong>
                        <span style="color:#81c784; font-weight: 500;">{{
                          formatCurrency(producto.selectedOffer.cuota_inicial)
                        }}</span>
                      </p>
                      <p v-if="producto.selectedOffer">
                        <strong class="product__titles">%
                          de
                          ahorro:</strong>
                        <span style="color:#81c784; font-weight: 500;">{{
                          ((1 -
                            (producto.selectedOffer.monto_final_oferta
                              / producto.saldo_total))
                            *
                            100).toFixed(2)
                        }}%</span>
                      </p>
                    </v-col>
                  </v-row>
                </div>
                <div>
                  <v-alert v-if="producto.selectedOffer" dark color="#00263C">
                    <p>
                      Si seleccionas
                      este plan
                      avanzaras
                      <b>{{ roundPercentage(producto.scores_by_term[selectedTerm].aumento_puntaje_porcentaje)
                      }}%</b>
                      para {{ clientData.objetivo_financiero
                      }} y
                      quedaras a
                      un <b>{{
                        roundPercentage(producto.scores_by_term[selectedTerm].hacia_objetivo)
                      }}%</b> de
                      este objetivo.
                      De acuerdo a la ley 1266 de 2008 de
                      habeas Data
                      tardaras
                      <b>{{
                        roundMonths(producto.scores_by_term[selectedTerm].tiempo_meses)
                      }}</b>
                      meses en eliminar este reporte negativo
                      de las
                      centrales
                      de
                      riesgo.
                      Ten en cuenta que desde el momento que
                      comiences a pagar tu puentaje crediticio
                      comenzará a mejorar y podrás solicitar
                      crédito siempre y cuando no tengas
                      carteras castigadas.
                    </p>
                  </v-alert>
                </div>
              </div>
              <v-divider class="mt-5 mb-5" :thickness="2" />
              <h4 class="mb-3" style="text-align:center; color:#00a1e4;">
                ¿Quieres este
                plan?
                comunícate con nosotros
              </h4>
              <v-row justify="center">
                <v-col class="d-flex justify-center" cols="12" sm="12">
                  <a href="https://wa.link/h1y0vn" target="_blank" style="text-decoration: none;">
                    <v-btn dark class="mx-2" color="green">
                      <v-icon left>mdi-whatsapp</v-icon>
                      WhatsApp
                    </v-btn>
                  </a>
                  <!-- email button -->
                  <a href="mailto:diagnosticofinanciero@qnt.com.co" style="text-decoration: none;">
                    <v-btn dark class="mx-2" color="light-blue darken-1">
                      <v-icon left>mdi-email</v-icon>
                      Email
                    </v-btn>
                  </a>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <div v-if="productsAgreement()">
      <h4 style="color:#00263C; text-align: center;" class="mb-1">
        <v-icon id="product-icon" large>
          mdi-credit-card-check-outline
        </v-icon>PRODUCTO(S) REESTRUCTURADO(S)
      </h4>
      <v-expansion-panels class="mb-3">
        <v-expansion-panel v-for="(producto, index) in productosAcuerdo" :key="index">
          <v-expansion-panel-header>
            <div>
              <span id="entityname">REESTRUCTURACIÓN QNT</span>
              <br>Número de restructuración: {{ producto.numero_restructuracion }}
              <br>Fecha de restructuración: {{ producto.fecha_restructuracion }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <span class="product__titles">Producto(s):</span> <span class="product__content"> {{
              producto.productos.join(', ') }}</span>
            <br><span class="product__titles">Valor total a pagar: </span><span class="product__content">{{
              formatCurrency(producto.valor_total_pagar)
            }}</span>
            <br><span class="product__titles">Número de cuota(s): </span><span class="product__content">{{ producto.plazo
            }}</span>
            <br><span class="product__titles">Valor cuota incicial:
            </span><span class="product__content">{{
              formatCurrency(producto.valor_cuota_inicial)
            }}</span>
            <br><span class="product__titles">Valor cuota mensual: </span>
            <span class="product__content">{{ formatCurrency(producto.valor_cuota_mensual)
            }}</span>
            <br><span class="product__titles">Día de pago mensual:</span>
            <span class="product__content">{{ producto.dia_pago_mensual }}</span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div v-if="othersDebts()">
      <h4 style="color:#00263C; text-align: center;" class="mb-1">
        PRODUCTOS SIN OFERTA QNT
      </h4>
      <v-expansion-panels class="mb-5">
        <v-expansion-panel v-for="producto in otrosProductos" :key="producto">
          <v-expansion-panel-header>
            <div>
              <span id="entityname">{{ producto.entidad }}</span>
              <br>Estado del producto: {{ producto.estado }}
              <br>Part. En mora: {{ producto.participacion_mora }}%
              <br>Saldo total del producto: {{ formatCurrency(producto.saldo_total) }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p v-if="producto.contacto" class="content__recomendation">
              Para ponerte al día
              con esta obligación, debes
              contactarte
              con la entidad a:
              <br><strong>Correo:</strong> {{ producto.contacto.correo_contacto }}
              <br><strong>Teléfono:</strong> {{ producto.contacto.numero_contacto }}
            </p>
            <p v-else class="content__recomendation">
              Actualmente no contamos con una oferta
              de este producto desde QNT, sin
              embargo te recomendamos contactarte con la entidad
              {{ producto.entidad }} para que puedas negociar esta deuda.
            </p>
            <p class="content__recomendation">
              Lo que si podemos decirte es que si pagas esta
              deuda en una sola cuota te
              acercarás
              <b>{{
                roundPercentage(producto.aumento_puntaje_porcentaje)
              }}%</b>
              para {{ clientData.objetivo_financiero }} y quedarás a
              <b>{{
                roundPercentage(producto.hacia_objetivo) }}%</b> de
              este objetivo.
              <br>De acuerdo a la ley 1266 de 2008 de habeas Data tardarás
              <b>{{
                producto.contacto ? producto.contacto.tiempo_meses :
                roundMonths(producto.tiempo_meses) }}</b>
              meses en eliminar este reporte negativo en centrales de riesgo; Pero ten
              en cuenta que desde el momento que comiences a pagar tu puntaje
              crediticio comenzará a mejorar y podrás solicitar crédito siempre y
              cuando no tengas carteras castigadas.
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-if="messageGoodHistorialCredit()">
      <v-alert color="light-green" dark icon="mdi-party-popper" prominent>
        <strong>¡FELICIDADES!</strong> <br>
        Cuentas con un excelente historial de crédito.
      </v-alert>
    </div>

    <h4 style="color:#00263C; text-align: center;">
      <v-icon id="product-icon" large>
        mdi-hand-heart-outline
      </v-icon>
      RECOMENDACIONES FINANCIERAS
    </h4>
    <v-carousel cycle hide-delimiter-background show-arrows-on-hover height="300px">
      <v-carousel-item v-for="tip in clientData.tips_financieros" :key="tip.id">
        <v-row class="fill-height px-5" align="center" justify="center">
          <v-card outlined class="pa-4 mb-2">
            <v-card-title class="title__tips">
              {{ tip.contenido.split(':')[0] }}
            </v-card-title>
            <v-card-text class="text-center">
              {{ tip.contenido.split(':').slice(1).join(':') }}
            </v-card-text>
          </v-card>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import RiskMeter from './commons/RiskMeter.vue'
export default {
  components: {

    RiskMeter
  },
  props: {
    clientData: {
      type: Object,
      default: () => ({})
    },
    productos: {
      type: Array,
      default: () => ([])
    },
    productosOferta: {
      type: Array,
      default: () => ([])
    },
    productosAcuerdo: {
      type: Array,
      default: () => ([])
    },
    otrosProductos: {
      type: Array,
      default: () => ([])
    }

  },
  data () {
    return {
      selectedTerm: null,
      selectedOffer: null,
      dialog: false,
      dialogPresupuesto: false,
      dialogObjetivo: false,
      panel: 0
    }
  },
  computed: {
    fechaFormateada () {
      const fecha = new Date(this.clientData.fecha_diagnostico)
      const dia = fecha.getDate().toString().padStart(2, '0')
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Los meses en JavaScript empiezan desde 0
      const año = fecha.getFullYear()
      return `${dia}/${mes}/${año}`
    },

    sortedProducts () {
      return [...this.productos].sort((a, b) => {
        if (a.estado === 'Al día' && b.estado !== 'Al día') {
          return 1
        } else if (a.estado !== 'Al día' && b.estado === 'Al día') {
          return -1
        } else {
          return 0
        }
      })
    },
    riskLevel () {
      const score = this.clientData.puntaje_crediticio
      if (score >= 621) {
        return 'Bajo'
      } else if (score >= 481) {
        return 'Moderado'
      } else {
        return 'Alto'
      }
    },
    fees () {
      const plazos = []
      for (const producto of this.productosOferta) {
        if (producto.ofertas) {
          for (const key in producto.ofertas) {
            if (producto.ofertas[key].plazo) {
              const plazo = producto.ofertas[key].plazo
              const plazoText = plazo === 1 ? 'cuota' : 'cuotas'
              plazos.push({
                text: `${plazo} ${plazoText}`,
                value: plazo
              })
            }
          }
        }
      }
      return plazos
    }

  },
  methods: {
    formatCurrency (value) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value)
    },
    roundPercentage (value) {
      return parseFloat(value).toFixed(2)
    },
    roundMonths (value) {
      return parseFloat(value).toFixed(0)
    },
    messageOfferClient () {
      if (this.productosOferta != null && this.productosOferta.length > 0) {
        return true
      }
    },
    othersDebts () {
      if (this.otrosProductos != null && this.otrosProductos.length > 0) {
        return true
      } else {
        return false
      }
    },
    productsAgreement () {
      if (this.productosAcuerdo != null && this.productosAcuerdo.length > 0) {
        return true
      } else {
        return false
      }
    },
    messageGoodHistorialCredit () {
      const allProducts = [...this.productos]
      if (allProducts.every(producto => producto.estado === 'Al día')) {
        return true
      }
    },
    totalPorcentageDebt () {
      let total = 0
      for (const i in this.productos) {
        if (this.productos[i].es_producto_qnt === true) { total += this.productos[i].participacion_mora }
        if (total === 100) {
          total = 100
          return total
        }
      }
      return total
    },
    selectOffer (producto, selectedTerm) {
      this.selectedTerm = selectedTerm
      producto.selectedOffer = producto.ofertas[selectedTerm]
    }
  }

}

</script>

<style scoped>
.principal-container {
  padding: 5px;
  position: relative;
}

.title__chunk_1 {
  color: #00263C;
  font-size: 1.05em;
  font-weight: 600;
  justify-content: center;
  margin-bottom: 0;
  text-align: center;
}

.content__chunk__1 {
  font-size: 1em;
  font-weight: 500;
  color: #636363f5;
  text-align: center !important;
  margin-top: 0;
}

.title__recommendation {
  font-size: 0.95em;
  font-weight: 500;
  color: #00263C;
  text-align: left;
  margin-bottom: 0;
}

.content__recomendation {
  font-size: 0.9em;
  font-weight: 400;
  color: #636363f5;
  text-align: left !important;
  margin-top: 0;
}

.title__tips {
  color: #00A1E6;
  font-size: 1.05em;
  font-weight: 600;
  justify-content: center;
  margin-bottom: 0;
  text-align: center;
  word-wrap: break-word;
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
  color: #00263C;
  ;
}

#entityname {
  color: #575757;
  font-weight: 700;
  font-size: 16px;
}

.product__titles {
  color: #6e7173;
  font-weight: 400;

}

.product__content {
  color: #6e7173;
  font-weight: 500;
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

  .title__tips {
    font-size: 14px;
    /* O el tamaño que te parezca adecuado */
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
  line-height: 0.9;
  margin-top: 10px;
  padding: 20px;
  font-weight: 400;
}

.title-offer {
  /* font-size: 0.9em; */
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
