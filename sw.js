importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
// เก็บหน้าแอปไว้ในเครื่อง: ออนไลน์ใช้ของใหม่เสมอ ออฟไลน์ใช้ของที่เก็บไว้
const CACHE='jobapp-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  // ข้อมูลและรูปจาก Supabase ไม่เก็บแคช (ต้องสดและเป็นความลับ)
  const ok=u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'||u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com');
  if(!ok)return;
  e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
