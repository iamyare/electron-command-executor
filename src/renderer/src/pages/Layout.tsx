import { getSession } from '@renderer/actions'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const isSession = getSession()

      if (!isSession) {
        return navigate('/auth/login')
      }

      navigate('/')
    }

    fetchData()
  }, [navigate])

  return (
    <div>
      <p></p>
      <Outlet />
    </div>
  )
}
