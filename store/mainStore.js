import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    clientData: null,
    productos: null,
  }),
  actions: {
    setClientData(data) {
      this.clientData = data;
      localStorage.setItem('clientData', JSON.stringify(data));
    },
    setProductos(data) {
      this.productos = data;
      localStorage.setItem('productos', JSON.stringify(data));
    },
    loadFromLocalStorage() {
      if (process.client) {
        const clientData = localStorage.getItem('clientData');
        const productos = localStorage.getItem('productos');
        if (clientData) {
          this.clientData = JSON.parse(clientData);
        }
        if (productos) {
          this.productos = JSON.parse(productos);
        }
      }
    }
  }
});
