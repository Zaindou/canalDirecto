<template>
    <div class="whatsapp-button" @click="openWhatsApp">
        <v-btn class="whatsapp-btn" icon>
            <v-icon class="whatsapp-icon">mdi-whatsapp</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    name: 'WhatsAppButton',
    props: {
        phoneNumber: {
            type: String,
            required: true
        },
        message: {
            type: String,
            default: '¡Hola! Me gustaría obtener más información.'
        }
    },
    methods: {
        openWhatsApp() {
            const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}`;
            window.open(url, '_blank');
        }
    }
}
</script>

<style scoped>
.whatsapp-button {
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 1000;
}

.whatsapp-btn {
    background-color: #25D366;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.whatsapp-icon {
    font-size: 40px !important;
    color: white !important;
}
</style>
