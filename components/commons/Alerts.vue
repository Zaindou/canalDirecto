<template>
    <v-alert border="right" elevation="2" :value="showAlert" :type="type" dismissible @input="showAlert = false">
        {{ message }}
</v-alert>
</template>
  
<script>
export default {
    name: 'Alert',
    props: {
        message: String,
        type: {
            type: String,
            default: 'error',
        },
    },
    data() {
        return {
            showAlert: true,
        };
    },
};
</script>