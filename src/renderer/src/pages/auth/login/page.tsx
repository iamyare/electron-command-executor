import FormLogin from './form-login'

export default function LoginPage() {
  // const [isPending, startTransition] = useTransition()
  // function onSubmit() {
  //   startTransition(async () => {
  //     // Lógica de inicio de sesión
  //     const username = 'admin'
  //     const password = 'admin'

  //     const { user, userError } = await login({ email: username, password })

  //     if (userError) {
  //       console.error(userError)
  //       return
  //     }

  //     console.log(user)
  //   })
  // }
  return (
    <main className="relative w-screen h-screen flex justify-center items-center">
      <section className="relative max-w-sm w-full">
        <FormLogin />
      </section>

      <div className="absolute -z-[2] bg-primary h-1/2 w-1/2 rounded-full blur-[100px] opacity-25"></div>
    </main>
  )
}
