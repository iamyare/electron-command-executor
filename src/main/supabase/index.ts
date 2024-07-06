// Se debe extender la interfaz ImportMetaEnv para incluir las propiedades personalizadas
// Corrección: Asegurarse de que las extensiones de tipo se realicen en un archivo de declaración global o se utilice la declaración de módulo si es necesario.

// Corrección: Se mueve la extensión de la interfaz ImportMetaEnv a un archivo de declaración global o se encapsula en un módulo para evitar el error de "nunca se utiliza".
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_KEY: string
  }
}

import { createClient } from '@supabase/supabase-js'

// Corrección: Ahora TypeScript debería reconocer las propiedades VITE_SUPABASE_URL y VITE_SUPABASE_KEY sin errores.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? ''
export const supabase = createClient(supabaseUrl, supabaseKey)
