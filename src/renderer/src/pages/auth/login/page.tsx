import { login } from '@renderer/actions'
import { Button } from '@renderer/components/ui/button'
import { useTransition } from 'react'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  function onSubmit() {
    startTransition(async () => {
      // Lógica de inicio de sesión
      const username = 'admin'
      const password = 'admin'

      const { user, userError } = await login({ email: username, password })

      if (userError) {
        console.error(userError)
        return
      }

      console.log(user)
    })
  }
  return (
    <main className=" w-screen h-screen">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-4xl">Login</h1>
        <form className="flex flex-col w-1/3">
          <label className="text-lg">Username</label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            placeholder="Username"
          />
          <label className="text-lg">Password</label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            placeholder="Password"
          />
          <Button className="bg-blue-500 text-white p-2 rounded-md mt-2" onClick={onSubmit}>
            {isPending ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </div>
    </main>
  )
}
