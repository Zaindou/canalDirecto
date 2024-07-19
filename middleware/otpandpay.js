// middleware/auth.js
export default function ({ app, redirect }) {
  const clientData = app.$cookies.get('token');
  if (!clientData) {
    return redirect('/');
  }
}
