const alwaysVisibleTooltipPlugin = {
  id: 'alwaysVisibleTooltip',
  afterRender: function(chart, easing, options) {
    const tooltip = chart.tooltip;
    if (!tooltip._active) {
      tooltip._active = []; // Crea un array _active si no existe
    }
    const activeElements = tooltip._active;
    const requestedElem = chart.getDatasetMeta(0).data[0]; // Ajusta esto según el dataset y el punto específico que quieras

    // Simula el estado activo solo si no hay otros tooltips activos
    if (activeElements.length === 0 || tooltip._active[0] !== requestedElem) {
      activeElements.push(requestedElem);
    }

    tooltip.update(true); // Forzar la actualización del tooltip
    chart.draw(); // Redibujar el gráfico para mostrar el tooltip
  },
  beforeEvent: function(chart, event, options) {
    if (event.type === 'mouseout') {
      event.native.preventDefault(); // Prevenir que el tooltip se oculte al mover el mouse fuera
    }
  }
};

Chart.register(alwaysVisibleTooltipPlugin);