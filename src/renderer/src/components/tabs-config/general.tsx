import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

interface GeneralProps {
  setOpen: (open: boolean) => void
}

export default function General({ setOpen }: GeneralProps) {
  const handleSave = () => {
    //Logica para guardar la configuracion
    setOpen(false)
  }
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">General</h2>
        <p className="text-muted-foreground text-xs">Configuración general de la aplicación</p>
      </div>
      <hr />
      <div className="flex items-center space-x-2">
        <Label htmlFor="start-with-system">Iniciar con el sistema: </Label>
        <Switch id="start-with-system" />
      </div>

      <div className="flex space-x-2 justify-end">
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cerrar
        </Button>
        <Button className="glow text-white" onClick={handleSave}>
          Guardar
        </Button>
      </div>
    </section>
  )
}
