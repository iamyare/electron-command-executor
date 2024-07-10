import { type Database as DB } from './actions/supabase/database.types'

declare global {
  type Database = DB
}
