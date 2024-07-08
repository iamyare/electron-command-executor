import { getSessionDevice } from '@renderer/actions'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getSessionDevice()

      if (error) {
        console.error(error)
        return
      }

      console.log(data.session)

      if (data.session === null) {
        navigate('/auth/login')
        return
      }
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
