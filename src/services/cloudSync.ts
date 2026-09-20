import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function syncWorkspaceSnapshot(user:any){
  if(!isSupabaseConfigured||!supabase)return;
  const {data:{user:authUser}}=await supabase.auth.getUser();
  if(!authUser)return;
  const {password,...safe}=user;
  await supabase.from('workspace_snapshots').upsert({user_id:authUser.id,email:authUser.email||safe.email,role:safe.role,data:safe,updated_at:new Date().toISOString()});
}
export async function loadWorkspaceSnapshot(authId:string){
  if(!isSupabaseConfigured||!supabase)return null;
  const {data,error}=await supabase.from('workspace_snapshots').select('data').eq('user_id',authId).maybeSingle();
  if(error||!data?.data)return null;
  return data.data;
}
