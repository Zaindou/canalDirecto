import $ from 'jquery';
<template>
    <v-container class="remove-padding">
        <Stepper />
    </v-container>
</template>
<script>

export default {
    data() {
        return {
            head: {
                title: 'Canal Directo'
            },

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
        padding: 40px !important;
    }
}
</style>