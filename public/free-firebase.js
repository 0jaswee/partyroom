import {roomKey,createRoom,joinRoom,applyAction} from './room-model.js';
// Transactions run against Firebase directly. This is a trusted-friends model:
// room members can write game state; there is no paid server enforcing randomness.
export function createTransport(api,db,getUser,getOffset=()=>0){
 let currentKey='';
 const random=()=>{const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]/4294967296;};
 return {
  get key(){return currentKey;},
  reset(){currentKey='';},
  async call(d){
   const uid=getUser().uid;
   const joining=d.action==='create'||d.action==='join';
   const key=joining?await roomKey(d.code,d.password):currentKey;
   if(!key)throw Error('Join a room first.');
   let failure='The room changed. Please try again.';
   const randomSeed=random();
   const now=Date.now()+getOffset();
   // Keep a live listener during the transaction. A one-shot get can evict its
   // cache before the first updater call, making an existing room appear null.
   let stop;
   try {
   const initial=await new Promise((resolve,reject)=>{stop=api.onValue(api.ref(db,'freeRooms/'+key),resolve,reject);});
   let departedHost;
   if(d.action==='takeover'){
    departedHost=initial.val()?.owner;
    if(!departedHost||(await api.get(api.ref(db,'freePresence/'+key+'/'+departedHost))).val()!==false)throw Error('The host is still connected.');
   }
   if(d.action==='end'){
    const snapshot=await api.get(api.ref(db,'freeRooms/'+key));
    if(snapshot.val()?.owner!==uid)throw Error('Only the host can end the room.');
    await api.update(api.ref(db),{['freeRooms/'+key]:null,['freePresence/'+key]:null});
    return {ok:true};
   }
   const result=await api.runTransaction(api.ref(db,'freeRooms/'+key),s=>{
    try{
     if(d.action==='create'){if(s)throw Error('That code and password are in use. Choose another code.');return createRoom(uid,d.name,d.settings,now);}
     if(d.action==='join')return joinRoom(s,uid,d.name,now);
     if(d.action==='takeover'&&s?.owner!==departedHost)throw Error('The host changed. Please try again.');
     const next=applyAction(s,uid,d.action,{...d,hostOffline:d.action==='takeover'},now,()=>randomSeed);
     return d.action==='leave'&&!Object.values(next.players).some(p=>p.active)?null:next;
    }catch(e){failure=e.message;return;}
   },{applyLocally:false});
   if(!result.committed)throw Error(failure);
   if(d.action==='leave'&&!result.snapshot.exists())await api.remove(api.ref(db,'freePresence/'+key)).catch(()=>{});
   if(joining)currentKey=key;
   return {ok:true};
   } finally {stop?.();}
  }
 };
}
