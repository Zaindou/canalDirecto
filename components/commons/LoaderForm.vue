<template>
  <div class="loading-overlay">
    <div class="loader">
      <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
        <circle
          class="pl__ring pl__ring--a"
          cx="120"
          cy="120"
          r="105"
          fill="none"
          stroke="#000"
          stroke-width="20"
          stroke-dasharray="0 660"
          stroke-dashoffset="-330"
          stroke-linecap="round"
        />
        <circle
          class="pl__ring pl__ring--b"
          cx="120"
          cy="120"
          r="35"
          fill="none"
          stroke="#000"
          stroke-width="20"
          stroke-dasharray="0 220"
          stroke-dashoffset="-110"
          stroke-linecap="round"
        />
        <circle
          class="pl__ring pl__ring--c"
          cx="85"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          stroke-width="20"
          stroke-dasharray="0 440"
          stroke-linecap="round"
        />
        <circle
          class="pl__ring pl__ring--d"
          cx="155"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          stroke-width="20"
          stroke-dasharray="0 440"
          stroke-linecap="round"
        />
      </svg>
      <p class="loading-title">
        ¿Sabias qué?
      </p>
      <p class="loading-text">
        {{ randomFact }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      facts: [
        'En Colombia, según la Superintendencia Financiera, cerca del 28% de los adultos están en mora con sus obligaciones financieras. Un indicador que resalta la importancia de la educación financiera en el país.',
        'A pesar de la creciente tendencia hacia la digitalización, el 58% de las transacciones en Colombia todavía se realizan en efectivo, según un informe del Banco de la República. ¡El efectivo sigue siendo rey!',
        'Según el Banco de la República, el billete de 50.000 pesos es el más falsificado en el país. ¡Una buena razón para conocer bien nuestras monedas y billetes!'
        // Agrega aquí todos los hechos curiosos que quieras...
      ],
      randomFact: ''
    }
  },
  created () {
    this.randomFact = this.facts[Math.floor(Math.random() * this.facts.length)]
  }
}
</script>

<style>
.loading-overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.pl {
    width: 6em;
    height: 6em;
}

.pl__ring {
    animation: ringA 2s linear infinite;
}

.pl__ring--a {
    stroke: #1976d2;
}

.pl__ring--b {
    animation-name: ringB;
    stroke: #87BD29;
}

.pl__ring--c {
    animation-name: ringC;
    stroke: #f42525;
}

.pl__ring--d {
    animation-name: ringD;
    stroke: #f42525;
}

/* Animations */
@keyframes ringA {

    from,
    4% {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -330;
    }

    12% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -335;
    }

    32% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -595;
    }

    40%,
    54% {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -660;
    }

    62% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -665;
    }

    82% {
        stroke-dasharray: 60 600;
        stroke-width: 30;
        stroke-dashoffset: -925;
    }

    90%,
    to {
        stroke-dasharray: 0 660;
        stroke-width: 20;
        stroke-dashoffset: -990;
    }
}

@keyframes ringB {

    from,
    12% {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -110;
    }

    20% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -115;
    }

    40% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -195;
    }

    48%,
    62% {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    70% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    90% {
        stroke-dasharray: 20 200;
        stroke-width: 30;
        stroke-dashoffset: -305;
    }

    98%,
    to {
        stroke-dasharray: 0 220;
        stroke-width: 20;
        stroke-dashoffset: -330;
    }
}

@keyframes ringC {
    from {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: 0;
    }

    8% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -5;
    }

    28% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -175;
    }

    36%,
    58% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    66% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    86% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -395;
    }

    94%,
    to {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -440;
    }
}

@keyframes ringD {

    from,
    8% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: 0;
    }

    16% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -5;
    }

    36% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -175;
    }

    44%,
    50% {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -220;
    }

    58% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -225;
    }

    78% {
        stroke-dasharray: 40 400;
        stroke-width: 30;
        stroke-dashoffset: -395;
    }

    86%,
    to {
        stroke-dasharray: 0 440;
        stroke-width: 20;
        stroke-dashoffset: -440;
    }
}

.loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.loading-title {
    margin-bottom: 10px;
    color: #fff;
    font-weight: 500;
}

.loading-text {
    color: #fff;
    padding: 10px;
    text-align: center;
}

@media (min-width: 768px) {
    .loading-text {
        width: 50%;
    }
}
</style>
