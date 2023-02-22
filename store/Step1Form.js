import axios from 'axios';

const API_URL = 'http://diagnosticot.qnt.com.co/diagnostico/'

export const state = () => ({
    primerNombre: '',
    primerApellido: '',
    numeroDeCedula: '',
    fechaExpedicion: null,
    identificacionSelect: 'CC',
    numeroDeCelular: '',
    email: '',
    terminosCondiciones: false,
    valid: false,
  })
  
  export const mutations = {
    setField(state, { field, value }) {
      state[field] = value
    },
    setValidation(state, value) {
      state.valid = value
    },
  }
  
  export const actions = {
    submitForm({ state }) {

        // Do something with the form data
        console.log('submitForm', state)
    
        // Reset the form
        this.$resetValidation()
        this.$resetForm()


    },
  }
  
  export const getters = {
    getField: (state) => (field) => state[field],
    getValidation: (state) => state.valid,
  }