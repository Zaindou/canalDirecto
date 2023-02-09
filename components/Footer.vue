<template>
    <v-footer :absolute="!fixed" app>
        <span class="textcopy">QNT - Diagnostico TEST &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
</template>

<script>
export default {
    name: 'Footer',
    props: {
        fixed: {
            type: Boolean,
            default: true
        }
    }
}

</script>

<style>
.textcopy {
    text-align: center;
    display: block;
    width: 100%;
    margin: 0 auto;
    padding: 10px;
}
</style>