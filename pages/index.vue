<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        Datos personales
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        OTP
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3">
        Tus Finanzas
      </v-stepper-step>
      <v-divider></v-divider>

      <v-stepper-step :complete="e1 === 4" step="4">
        ¿Felicidades?
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="e1 = 2">
          Continuar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>



        <v-btn text>
          Atrás
        </v-btn>

        <v-btn color="primary" @click="e1 = 3">
          Continuar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>
        <v-btn text>
          Atrás
        </v-btn>
        <v-btn color="primary" @click="e1 = 4">
          Continuar
        </v-btn>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn text @click="e1 = 1">
          Cancelar
        </v-btn>


        <!-- botón alineado al centro -->
        <v-btn color="primary" @click="e1 = 1" class="mx-auto">
          Enviar
        </v-btn>

      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data(){
    return {
      head : {
        title: 'Diagnostico Stepper TEST'
      },
      e1: 1
    }
  }
}
</script>

<style>

.v-stepper {
  width: 50%;
  margin: 0 auto;
  margin-top: 120px;
}

@media (max-width: 600px) {
  .v-stepper {
    width: 100%;
    margin-top: 60px;
  }
}

</style>