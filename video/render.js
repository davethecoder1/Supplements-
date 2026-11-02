const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+__dirname+'/scene.html',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
const FPS=30, DUR=8, N=FPS*DUR; const t0=Date.now();
for(let f=0;f<N;f++){ const ms=f*1000/FPS;
  await p.evaluate(ms=>document.getAnimations().forEach(a=>{a.pause(); const d=a.effect.getTiming().delay||0; a.currentTime=ms; }),ms);
  await p.screenshot({path:`${__dirname}/frames/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:92}); }
console.log('frames',N,'in',((Date.now()-t0)/1000).toFixed(0)+'s'); await b.close();})();
