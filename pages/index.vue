<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-card elevation="10" class="transparent p-2">
          <v-img src="path/to/your/background-image.jpg" height="100vh" class="align-end">
            <v-overlay absolute opacity="0.7">
              <v-card-title class="text-h4 font-weight-bold white--text mb-2">
                Bienvenid@ a tu diagnóstico financiero
              </v-card-title>
              <v-card-subtitle class="text-subtitle-1 white--text mb-6">
                Este diagnóstico te indicará el paso a paso para salir de tus deudas y mejorar tu perfil de crédito
              </v-card-subtitle>

              <v-btn block x-large dark style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)"
                elevation="2" class="mb-4" @click="$router.push('/registro')">
                NUEVO INGRESO
              </v-btn>

              <v-btn outlined x-large block class="white--text" elevation="2" @click="$router.push('/ingreso')">
                USUARIO REGISTRADO
              </v-btn>
            </v-overlay>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-application {
  background-color: #ebebeb !important;
}

.transparent {
  background-color: transparent !important;
}
</style>