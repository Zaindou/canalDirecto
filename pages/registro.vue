<template>
    <v-container class="remove-padding">
        <StepperForm />
    </v-container>
</template>
<script>

export default {
    data() {
        return {
            head: {
                title: 'Canal Directo'
            }

        }
    }
}
</script>

<style scoped>
@media (max-width: 790px) {
    .remove-padding {
        padding: 0 !important;
    }
}

@media (min-width: 790px) {
    .remove-padding {
        padding: 10px !important;
    }
}

.no-scroll input[type="number"]::-webkit-outer-spin-button,
.no-scroll input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.no-scroll input[type="number"] {
    -moz-appearance: textfield;
}
</style>
