import {act} from './game-engine.js';
export function settingsFrom(v={}) {
 const s={game:v.game==='truth'?'truth':'dice',max:Number(v.max??8),timer:Number(v.timer??30),extra:Number(v.extra??6),cancel:!!v.cancel,majority:!!v.majority,tie:v.tie==='dare'?'dare':'truth'};
 for(const [k,min,max] of [['max',2,20],['timer',10,120],['extra',1,6]])if(!Number.isInteger(s[k])||s[k]<min||s[k]>max)throw Error('Check your room settings.');
 return s;
}
export function cleanName(name){name=String(name||'').trim();if(!name||name.length>24)throw Error('Enter a name of 1–24 characters.');return name;}
export function createRoom(uid,name,settings,now){return {owner:uid,created:now,seatCount:1,settings:settingsFrom(settings),phase:'lobby',round:0,players:{[uid]:{name:cleanName(name),active:true,joined:now,score:0}}};}
export function joinRoom(s,uid,name,now){if(!s)throw Error('Room not found. Check the code and password.');name=cleanName(name);const p=s.players[uid];if(p){p.active=true;return s;}if(Object.keys(s.players).length>=s.settings.max)throw Error('This room has no free seats. Ask the host to create a fresh room.');if(Object.values(s.players).some(p=>p.name.toLowerCase()===name.toLowerCase()))throw Error('That name is taken. Choose another.');s.players[uid]={name,active:true,joined:now,score:0};s.seatCount=Object.keys(s.players).length;return s;}
export function applyAction(s,uid,action,data,now,random){if(!s)throw Error('Room not found.');return act(s,uid,action,data,now,random);}
export async function roomKey(code,password,cryptoAPI=globalThis.crypto){if(!/^\d{5}$/.test(code))throw Error('Enter a 5-digit room code.');password=String(password||'');if(password.length>64)throw Error('Use a password of up to 64 characters.');const hash=await cryptoAPI.subtle.digest('SHA-256',new TextEncoder().encode('PartyRoom-v2:'+code+':'+password));return code+'_'+Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');}
