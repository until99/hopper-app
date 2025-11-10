import { RouterProvider } from 'react-router-dom'
import { router, AuthProvider } from './routes'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
