<template>
  <v-container fluid class="pa-0 fill-height background-container">
    <v-row no-gutters align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3" class="text-center">
        <div class="content-wrapper">
          <h1 class="text-h5 font-weight-bold white--text text-center mb-4">
            Bienvenid@ a tu diagnóstico financiero
          </h1>
          <p class="white--text subtitle-1 mb-6">
            Este diagnóstico te indicará el paso a paso para salir de tus deudas y mejorar tu perfil de crédito
          </p>

          <div class="button-container">
            <v-btn style="background-image:linear-gradient(81deg, #00263CAB 0%, #00A2E4 87%)" dark x-large
              class="mb-2 custom-btn" elevation="2" @click="$router.push('/registro')">
              NUEVO INGRESO
            </v-btn>
            <v-btn outlined x-large class="white--text custom-btn" elevation="2" @click="$router.push('/ingreso')">
              USUARIO REGISTRADO
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.background-container {
  background-image: url('/bg.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  min-height: 100vh;
}

.background-container::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
  width: 100% !important;
  max-width: 300px !important;
}

@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.25rem !important;
  }

  .subtitle-1 {
    font-size: 0.875rem !important;
  }

  .custom-btn {
    font-size: 0.875rem !important;
  }
}
</style>