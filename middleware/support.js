export default function ({ route, redirect }) {
  const token = route.query.token
  if (!token) {
    return redirect('/')
  }
}
