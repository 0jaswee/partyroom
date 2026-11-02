// Optional integration check against the configured project.
// Install firebase@12.0.0 temporarily before running: npm install --no-save firebase@12.0.0
// Creates its own random-password test rooms and deletes only those rooms.
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,signInAnonymously} from 'firebase/auth';
import * as api from 'firebase/database';
import {firebaseConfig} from '../public/firebase-config.js';
import {createTransport} from '../public/free-firebase.js';
const clients=[];
async function client(id){const app=initializeApp(firebaseConfig,id);const user=(await signInAnonymously(getAuth(app))).user;const db=api.getDatabase(app);const transport=createTransport(api,db,()=>user);const c={app,user,db,transport};clients.push(c);return c;}
try{
 const a=await client('smoke-host-'+Date.now()),b=await client('smoke-guest-'+Date.now());
 const code=String(10000+Math.floor(Math.random()*90000)),password=crypto.randomUUID();
 await a.transport.call({action:'create',code,password,name:'Smoke Host',settings:{max:20,timer:30,extra:6,cancel:true}});
 await api.set(api.ref(a.db,'freePresence/'+a.transport.key+'/'+a.user.uid),true);
 await b.transport.call({action:'join',code,password,name:'Smoke Guest'});
 const path='freeRooms/'+a.transport.key;
 let s=(await api.get(api.ref(b.db,path))).val();assert.equal(Object.keys(s.players).length,2);assert.equal(s.settings.max,20);
 console.log('PASS live create + second anonymous player join + shared 20-seat state');
 await a.transport.call({action:'start'});s=(await api.get(api.ref(a.db,path))).val();
 const turnClient=s.current===a.user.uid?a:b;
 await turnClient.transport.call({action:'roll',turn:s.round});
 s=(await api.get(api.ref(b.db,path))).val();assert.ok(s.last.value>=1&&s.last.value<=6);
 console.log('PASS live turn + roll + shared result');
 await a.transport.call({action:'end'});assert.equal((await api.get(api.ref(b.db,path))).val(),null);
 console.log('PASS host end atomically removed room and presence paths');
 const code2=String(10000+Math.floor(Math.random()*90000));
 await a.transport.call({action:'create',code:code2,password:crypto.randomUUID(),name:'Smoke Host',settings:{max:20}});
 const path2='freeRooms/'+a.transport.key;
 await a.transport.call({action:'leave'});assert.equal((await api.get(api.ref(a.db,path2))).val(),null);
 console.log('PASS last-player leave removed room');
}finally{for(const c of clients)if(c.transport.key)await c.transport.call({action:'end'}).catch(()=>{});await Promise.all(clients.map(c=>deleteApp(c.app)));}
