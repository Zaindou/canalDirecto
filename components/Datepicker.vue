<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px" >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="date" label="Seleccionar fecha de expedición" prepend-icon="mdi-calendar" readonly
                        v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable locale="es-co">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                        Cancelar
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">
                        Aceptar
                    </v-btn>
                </v-date-picker>
            </v-dialog>
        </v-col>
    </v-row>
</template>
<script>
export default {
    data: () => ({
        date: null,
        menu: false,
        modal: false,
        menu2: false,
    }),
}
</script>