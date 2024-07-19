import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    clientData: null,
    productos: null,
  }),
  actions: {
    setClientData(data, nuxt) {
      this.clientData = data;
      if (process.client) {
        localStorage.setItem('clientData', JSON.stringify(data));
      }

    },
    setProductos(data, nuxt) {
      this.productos = data;
      if (process.client) {
        localStorage.setItem('productos', JSON.stringify(data));
      }

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
    },
    setClientDataCookie(nuxt) {
      nuxt.$cookies.set('clientData', JSON.stringify(this.clientData), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 semana
      });
    },
    setTokenCookie(nuxt, token) {
      nuxt.$cookies.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 1 // 1 semana
      });
    },
  }
});
