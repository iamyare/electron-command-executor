import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <p>Layout</p>
      <Outlet />
    </div>
  )
}
