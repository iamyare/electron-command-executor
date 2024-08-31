import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { toast } from '../ui/use-toast'

interface GeneralProps {
  setOpen: (open: boolean) => void
}

export default function General({ setOpen }: GeneralProps) {
  const [autoLaunch, setAutoLaunch] = useState(false)

  useEffect(() => {
    // Obtener el estado actual del inicio automático
    window.api.getAutoLaunch().then((enabled: boolean) => {
      setAutoLaunch(enabled)
    })
  }, [])

  const handleAutoLaunchChange = (checked: boolean) => {
    setAutoLaunch(checked)
    window.api.setAutoLaunch(checked)
  }

  const handleSave = () => {
    // Guardar la configuración
    window.api.setAutoLaunch(autoLaunch)
    toast({
      title: 'Configuración guardada',
      description: 'Los cambios han sido aplicados correctamente.'
    })
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
        <Switch
          id="start-with-system"
          checked={autoLaunch}
          onCheckedChange={handleAutoLaunchChange}
        />
        <Label htmlFor="start-with-system">Iniciar con el sistema</Label>
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
