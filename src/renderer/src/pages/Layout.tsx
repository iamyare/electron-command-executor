import { refreshSession } from '@renderer/actions'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const isSessionValid = await refreshSession()

      if (!isSessionValid) {
        return navigate('/auth/login')
      }

      navigate('/')
    }

    checkSession()
  }, [navigate])

  return (
    <div>
      <p></p>
      <Outlet />
    </div>
  )
}
