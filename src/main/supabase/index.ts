// Asegúrate de que tu archivo tsconfig.json tenga configurado "module" a uno de los valores permitidos para usar import.meta.
// Por ejemplo, puedes configurarlo a "es2022" si aún no está configurado de esta manera.

// tsconfig.json
// {
//   "compilerOptions": {
//     "module": "es2022",
//     ...
//   }
// }

// index.ts
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_KEY: string
  }
}

import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? ''
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
