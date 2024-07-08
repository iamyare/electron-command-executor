import { Routes, Route } from 'react-router-dom'
import MainPage from './pages/main'
import LoginPage from './pages/auth/login/page'
import NotFound from './pages/notFound'
import Layout from './pages/Layout'

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Define las rutas como rutas hijas de Layout */}
        <Route index element={<MainPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
