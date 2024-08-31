'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import AccountTabs from './tabs-config/account'
import General from './tabs-config/general'

export default function TabsConf({ setOpen }: { setOpen: (open: boolean) => void }) {
  return (
    <Tabs defaultValue="general" className=" flex flex-col md:flex-row w-full h-full gap-2">
      <TabsList className=" flex md:flex-col h-full bg-transparent md:justify-start items-start">
        <TabsTrigger className=" w-full md:justify-start" value="general">
          General
        </TabsTrigger>
        <TabsTrigger className=" w-full md:justify-start" value="account">
          Cuenta
        </TabsTrigger>
      </TabsList>
      <div className=" w-full px-4">
        <TabsContent className=" w-full" value="general">
          <General setOpen={setOpen} />
        </TabsContent>
        <TabsContent className=" w-full" value="account">
          <AccountTabs />
        </TabsContent>
      </div>
    </Tabs>
  )
}
