import { Settings } from 'lucide-react'
import ButtonGhost from './ui/button-ghost'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import TabsConf from './tabs-config'
import { useState } from 'react'

export default function ModalConfig() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <ButtonGhost icon={Settings} tooltip="Configuracion" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <TabsConf setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
