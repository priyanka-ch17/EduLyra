import type { Role, User } from '../types';
import { login, register, currentUser, hydrateCloudUser } from './store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { loadWorkspaceSnapshot } from './cloudSync';
export const demoUsers:User[]=[{id:'student-demo',name:'Alex Student',email:'student@demo.com',role:'student'},{id:'faculty-demo',name:'Dr. Priya Faculty',email:'faculty@demo.com',role:'faculty'},{id:'industry-demo',name:'Jordan Recruiter',email:'industry@demo.com',role:'industry'},{id:'institution-demo',name:'Institution Admin',email:'admin@demo.com',role:'institution'}];
export const DEMO_PASSWORD='EduLyra@2026!Demo';
export async function signIn(email:string,password:string){
 if(isSupabaseConfigured&&supabase){const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(!error&&data.user){const snap=await loadWorkspaceSnapshot(data.user.id);if(snap)return hydrateCloudUser({...snap,id:data.user.id,email:data.user.email||email});return hydrateCloudUser({id:data.user.id,name:data.user.user_metadata?.name||email.split('@')[0],email:data.user.email||email,role:(data.user.user_metadata?.role||'student') as Role,profile:{careerGoal:'',currentSkills:[]},portfolio:{skills:[],courses:[],certifications:[],internships:[],projects:[],achievements:[]},learning:[],applications:[],notifications:[]});} }
 return login(email,password);
}
export async function signUp(name:string,email:string,password:string,role:Role,profile:Record<string,unknown>={}){
 if(isSupabaseConfigured&&supabase){
   const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{name,role}}});
   if(error) throw error;
   if(data.user&&!data.session){
     throw new Error('Account created. Please verify your email before signing in.');
   }
   if(data.user&&data.session){
     return hydrateCloudUser({id:data.user.id,name:name||email.split('@')[0],email:data.user.email||email,role,profile:{...profile,name,email,role,emailVerificationStatus:'verified'},portfolio:{skills:[],courses:[],certifications:[],internships:[],projects:[],achievements:[]},learning:[],applications:[],notifications:[]});
   }
 }
 return register({name,email,password,role,...profile,emailVerificationStatus:'demo_verified'});
}
export async function signOut(){if(isSupabaseConfigured&&supabase)await supabase.auth.signOut();localStorage.removeItem('edulyra_user');localStorage.removeItem('edulyra_session_id');}
export function getStoredUser(){try{return currentUser()}catch{return null}}
export function getDemoPassword(){return DEMO_PASSWORD}
