<template>
    <v-app>
        <v-main class="gradient-background">
            <v-container fluid class="fill-height">
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="10" md="8" lg="6">
                        <v-card class="product-matcher" elevation="10" shaped>
                            <v-card-title class="headline d-flex align-center">
                                <v-icon size="36" color="primary" class="mr-3">mdi-magnify</v-icon>
                                Product Matcher - Canal Directo
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="form" @submit.prevent="checkMatch" v-model="isFormValid">
                                    <v-text-field v-model="userProducts" label="Número del producto RBK"
                                        placeholder="Ingrese productos separados por comas" outlined dense
                                        :rules="[v => !!v || 'Este campo es requerido']" class="mb-4"></v-text-field>
                                    <v-text-field v-model="incomingProduct" label="Número de producto Experian"
                                        placeholder="Ingrese el producto entrante" outlined dense
                                        :rules="[v => !!v || 'Este campo es requerido']" class="mb-4"></v-text-field>
                                    <v-btn type="submit" color="primary" block large elevation="2" class="white--text"
                                        style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%); color: white;"
                                        :disabled="!isFormValid">
                                        <v-icon left>mdi-check-circle</v-icon>
                                        Verificar Match
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                            <v-expand-transition>
                                <div v-if="matchResult !== null || generatedIds.length || errorMessage">
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-slide-y-transition>
                                            <v-alert v-if="errorMessage" type="error" dense dismissible class="mb-4"
                                                transition="scale-transition">
                                                {{ errorMessage }}
                                            </v-alert>
                                        </v-slide-y-transition>
                                        <v-slide-y-transition>
                                            <v-alert v-if="matchResult !== null"
                                                :type="matchResult.includes('NO') ? 'error' : 'success'" dense
                                                dismissible class="mb-4" transition="scale-transition">
                                                {{ matchResult }}
                                            </v-alert>
                                        </v-slide-y-transition>
                                        <v-slide-y-transition>
                                            <div v-if="generatedIds.length" class="mt-4">
                                                <h3 class="subtitle-1 mb-2">IDs generados para comparación:</h3>
                                                <v-chip-group column>
                                                    <v-chip v-for="id in generatedIds" :key="id" small label
                                                        color="secondary" class="mb-2" outlined>
                                                        {{ id }}
                                                    </v-chip>
                                                </v-chip-group>
                                                <v-btn color="info" text @click="showExplanation = !showExplanation"
                                                    class="mt-2">
                                                    <v-icon left>{{ showExplanation ? 'mdi-chevron-up' :
                                    'mdi-chevron-down' }}</v-icon>
                                                    {{ showExplanation ? 'Ocultar explicación' : 'Ver explicación' }}
                                                </v-btn>
                                                <v-expand-transition>
                                                    <div v-if="showExplanation" class="mt-2 explanation-text">
                                                        <p>Los IDs generados para comparación son variaciones de los
                                                            números de producto RBK ingresados. Estos IDs se crean
                                                            utilizando diferentes lógicas para aumentar las
                                                            posibilidades de encontrar una coincidencia con el producto
                                                            Experian. Algunas de estas lógicas incluyen:</p>
                                                        <ul>
                                                            <li>Tomar los primeros o últimos 9 dígitos</li>
                                                            <li>Extraer segmentos de 6 a 9 dígitos de diferentes partes
                                                                del número</li>
                                                            <li>Combinar partes del número en caso de que contenga un
                                                                guion</li>
                                                            <li>Generar subsecuencias de 3 a 8 dígitos que aparezcan en
                                                                múltiples productos</li>
                                                        </ul>
                                                        <p>Estos IDs generados se comparan con el número de producto
                                                            Experian para determinar si hay una coincidencia.</p>
                                                    </div>
                                                </v-expand-transition>
                                            </div>
                                        </v-slide-y-transition>
                                    </v-card-text>
                                </div>
                            </v-expand-transition>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" text @click="clearForm">
                                    <v-icon left>mdi-refresh</v-icon>
                                    Limpiar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<script>
export default {
    data() {
        return {
            userProducts: "",
            incomingProduct: "",
            matchResult: null,
            generatedIds: [],
            errorMessage: null,
            isFormValid: false,
            showExplanation: false
        };
    },
    methods: {
        clearForm() {
            // (Método sin cambios)
        },
        clearResults() {
            // (Método sin cambios)
        },
        stripLeadingZeros(s) {
            return s.replace(/^0+/, '') || '0';  // Devuelve '0' si la cadena es toda ceros
        },
        checkMatch() {
            this.errorMessage = null;
            if (!this.isFormValid) {
                this.errorMessage = "Por favor, complete todos los campos requeridos.";
                return;
            }

            try {
                const incomingProduct = this.stripLeadingZeros(this.incomingProduct);
                const userProducts = this.userProducts.split(",").map(p => this.stripLeadingZeros(p.trim()));

                // Lógica original y nueva lógica de coincidencias
                const first_products_ids = userProducts.map(p => this.stripLeadingZeros(p.slice(0, 9)));
                const last_products_ids = userProducts.map(p => this.stripLeadingZeros(p.slice(-9)));
                const last_minus_one_ids = userProducts.map(p => this.stripLeadingZeros(p.slice(0, -1)));
                const middle_ids_2_10 = userProducts.map(p => this.stripLeadingZeros(p.slice(1, 10)));
                const middle_ids_3_11 = userProducts.map(p => this.stripLeadingZeros(p.slice(2, 11)));
                const middle_ids_4_12 = userProducts.map(p => this.stripLeadingZeros(p.slice(3, 12)));

                const logic_1_ids = userProducts.filter(p => p.includes("-")).map(p => this.stripLeadingZeros(p.slice(0, 6) + p.split("-")[0].slice(-3)));
                const logic_2_ids = userProducts.map(p => this.stripLeadingZeros(p.slice(0, 6) + p.slice(-3)));
                const logic_3_ids = userProducts.flatMap(p => [...Array(p.length - 5).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 6))));
                const logic_4_ids = userProducts.flatMap(p => [...Array(p.length - 4).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 5))));
                const logic_5_ids = userProducts.flatMap(p => [...Array(p.length - 3).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 4))));
                const logic_6_ids = userProducts.flatMap(p => [...Array(p.length - 2).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 3))));
                const logic_7_ids = [...new Set(userProducts.flatMap(p => [...Array(p.length - 2).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 3))).filter(id => userProducts.filter(p => p.includes(id)).length >= 2)))];

                // Nuevas lógicas para productos Experian
                const logic_exp_1_ids = userProducts.filter(p => p.length >= 9).map(this.stripLeadingZeros);
                const logic_exp_2_ids = userProducts.flatMap(p => [...Array(p.length - 7).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 8))));
                const logic_exp_3_ids = userProducts.flatMap(p => [...Array(p.length - 6).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 7))));
                const logic_exp_4_ids = userProducts.flatMap(p => [...Array(p.length - 5).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 6))));
                const logic_exp_5_ids = userProducts.flatMap(p => [...Array(p.length - 4).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 5))));
                const logic_exp_6_ids = userProducts.flatMap(p => [...Array(p.length - 3).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 4))));
                const logic_exp_7_ids = userProducts.flatMap(p => [...Array(p.length - 2).keys()].map(i => this.stripLeadingZeros(p.slice(i, i + 3))));

                const all_ids = [
                    ...first_products_ids,
                    ...last_products_ids,
                    ...last_minus_one_ids,
                    ...middle_ids_2_10,
                    ...middle_ids_3_11,
                    ...middle_ids_4_12,
                    ...logic_1_ids,
                    ...logic_2_ids,
                    ...logic_3_ids,
                    ...logic_4_ids,
                    ...logic_5_ids,
                    ...logic_6_ids,
                    ...logic_7_ids,
                    ...logic_exp_1_ids,
                    ...logic_exp_2_ids,
                    ...logic_exp_3_ids,
                    ...logic_exp_4_ids,
                    ...logic_exp_5_ids,
                    ...logic_exp_6_ids,
                    ...logic_exp_7_ids
                ];

                this.generatedIds = all_ids;

                // Convertir all_ids a conjunto para búsquedas más rápidas
                const all_ids_set = new Set(all_ids);

                // Verificar si el producto recibido hace match con alguna de las lógicas generadas
                if (all_ids_set.has(incomingProduct)) {
                    this.matchResult = `Producto ${this.incomingProduct} hace match con uno de los ID generados.`;
                } else {
                    this.matchResult = `Producto ${this.incomingProduct} NO hace match con ninguno de los ID generados.`;
                }
            } catch (error) {
                console.error("Error en checkMatch:", error);
                this.errorMessage = "Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente.";
            }
        }
    }
};
</script>

<style scoped>
.product-matcher {
    border-radius: 16px;
    overflow: hidden;
}

.gradient-background {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.gradient-button {
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s ease;
}

.gradient-button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
}

.v-card-title {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.v-chip {
    transition: all 0.3s ease;
}

.v-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.explanation-text {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;
}

.explanation-text ul {
    padding-left: 20px;
}
</style>