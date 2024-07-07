import { type Database as DB } from './main/supabase/database.types'

declare global {
  type Database = DB
}
