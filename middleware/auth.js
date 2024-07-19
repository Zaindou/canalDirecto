// middleware/auth.js
export default function ({ app, redirect }) {
  const clientData = app.$cookies.get('clientData');
  if (!clientData) {
    return redirect('/');
  }
}
