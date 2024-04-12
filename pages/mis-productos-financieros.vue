<template>
    <h1>es la data</h1>
</template>

<script>
// Importar los componentes SVG
import IconoCredito from '/components/icons/IconoCredito.vue';
import IconoMora from '/components/icons/IconoMora.vue';
import Header from '/components/commons/Header.vue';
import Productos from '/components/commons/Products.vue';
import { useMainStore } from '@/store/mainStore';


export default {
    components: {
        IconoCredito,
        IconoMora,
        Productos,
        Header,
    },
    data: () => ({
        localClientData: null,
        saldoProductos: 0,
        saldoMoraProductos: null,
        fechaDiagnostico: null,
        sortedProducts: [],
        saldoMora: null,
    }),
    computed: {
        mainStore() {
            return useMainStore();
        },
    },
    methods: {
        formatCurrency(value) {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(value);
        },
        formattedDate() {
            if (this.localClientData && this.localClientData.fecha_diagnostico) {
                const date = new Date(this.localClientData.fecha_diagnostico);
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'Diciembre'];

                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();

                return `${day} de ${month} de ${year}`;
            }
            return 'Hoy es un buen día...';
        },
        navigateTo(route) {
            this.$router.push(route);
        },
    },
    watch: {
        'mainStore.clientData': {
            immediate: true,
            handler(newValue) {
                this.localClientData = newValue;
                this.saldoProductos = newValue ? newValue.saldo_total_productos : 0;
                this.saldoMoraProductos = newValue ? newValue.saldo_total_productos_mora : 'No tienes saldo en mora.';
                this.fechaDiagnostico = newValue ? this.formattedDate() : null;
            }
        },
        'mainStore.productos': {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.sortedProducts = newValue

                    this.saldoMora = this.sortedProducts.reduce((total, producto) => {
                        if (producto.estado !== "Al día") {
                            return total + producto.saldo_total;
                        }
                        return total;
                    }, 0);
                }
            }
        }

    },
    mounted() {
        const mainStore = useMainStore();
        mainStore.loadFromLocalStorage();

        if (!localStorage.getItem('tourFinances')) {
            introJs().setOptions({
                steps: [
                    {
                        intro: 'En esta sección podrás ver el saldo de tus créditos y el saldo en mora de tus productos financieros.',
                        title: "Bienvenido a tus productos financieros!",
                    },
                    {
                        element: document.querySelector('.step-3'),
                        title: "Detalle de tus productos financieros",
                        intro: 'Aquí podrás ver el detalle de tus productos financieros.',
                    },
                    {
                        element: document.querySelector('.step-4'),
                        title: "Continuar",
                        intro: 'Haz clic en el botón para continuar.',
                    },
                ],
                nextLabel: 'Siguiente',
                prevLabel: 'Anterior',
                doneLabel: 'Listo',
                // showProgress: true,
                dontShowAgain: false,
                dontShowAgainLabel: 'No volver a mostrar',
                showBullets: false,
                disableInteraction: true,
                overlayOpacity: 0.7,
                exitOnEsc: false,
                exitOnOverlayClick: false,
                showButtons: true,

            }).start();
        }

        localStorage.setItem('tourFinances', 'true');
    },
};
</script>

<style scoped>
.icono-svg {
    height: 65px;
    width: 65px;
}

.title {
    font-size: 1rem;
    font-weight: 600;
    color: #0b2f44;
    margin-bottom: 4px;
    text-align: center;
    /* Ajusta esto para controlar el espacio entre el título y el subtítulo */
}

.subtitle-1 {
    font-size: 1rem;
    color: #424242;
    text-align: center;
}

.title-tools {
    font-size: 1.2rem;
    font-weight: 600;
    color: #0b2f44;
    margin-bottom: 4px;
    text-align: center;
    /* Ajusta esto para controlar el espacio entre el título y el subtítulo */
}

@media (min-width: 960px) {
    .main-container {
        max-width: 1200px;
        /* Ajusta el ancho máximo del contenedor */
        margin: auto;
        /* Centra el contenedor */
    }
}
</style>
