<template>
    <v-otp-input length="6" type="number" @input="$emit('otp-entered', $event)"></v-otp-input>
</template>
  
<script>
export default {
    data() {
        return {
            otp: ''
        }
    },
    methods: {
        onInput(value) {
            this.otp = value
        },
        onComplete(value) {
            this.$emit('otp-entered', this.otp)
        }
    }
}
</script>
  