const { chromium } = require('playwright');
const F = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@800;900&display=block');*{margin:0;padding:0;box-sizing:border-box}html,body{background:transparent}`;
const drop = (c, s, x='#000') => `<svg width="${s}" height="${s*1.25}" viewBox="0 0 40 50"><path d="M20 2 C20 2 4 22 4 32 a16 16 0 0 0 32 0 C36 22 20 2 20 2Z" fill="${c}"/><path d="M14 31 h12 M20 25 v12" stroke="${x}" stroke-width="4.5" stroke-linecap="round"/></svg>`;
const jobs = [
 ['logo-black', 1200, 240, `<div style="display:flex;align-items:center;gap:26px;height:240px;padding:0 10px">${drop('#000',112,'#D7F75B')}<span style="font:800 168px/1 'Inter Tight';letter-spacing:-.025em;color:#000">ELECTROLIFE</span></div>`],
 ['logo-white', 1200, 240, `<div style="display:flex;align-items:center;gap:26px;height:240px;padding:0 10px">${drop('#D7F75B',112)}<span style="font:800 168px/1 'Inter Tight';letter-spacing:-.025em;color:#fff">ELECTROLIFE</span></div>`],
 ['favicon', 512, 512, `<div style="width:512px;height:512px;border-radius:112px;background:#000;display:flex;align-items:center;justify-content:center">${drop('#D7F75B',300)}</div>`],
];
(async()=>{const b=await chromium.launch();
for (const [n,w,h,inner] of jobs){ const p=await b.newPage({viewport:{width:w,height:h}});
 await p.setContent(`<!doctype html><style>${F}</style><body>${inner}</body>`,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
 const box = n==='favicon'? null : await p.evaluate(()=>{const r=document.body.firstElementChild;const s=[...r.children];const l=Math.min(...s.map(e=>e.getBoundingClientRect().left)),rt=Math.max(...s.map(e=>e.getBoundingClientRect().right));return {x:Math.max(0,l-6),y:0,width:Math.ceil(rt-l+12),height:240};});
 await p.screenshot({path:`${__dirname}/${n}.png`,omitBackground:true, ...(box?{clip:box}:{})}); console.log('ok',n,box&&box.width); await p.close(); }
await b.close();})();
