<template>
    <v-dialog v-model="modalOpen" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ title }}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="modalOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                {{ content }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" text @click="modalOpen = false">{{ closeText }}</v-btn>
            </v-card-actions>
        </v-card>
</v-dialog>
</template>
  
<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        closeText: {
            type: String,
            default: 'Close'
        }
    },
    data() {
        return {
            modalOpen: false
        }
    }
}
</script>