const { chromium } = require('playwright');
const F=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Inter+Tight:wght@800&family=JetBrains+Mono:wght@500&display=block');
*{box-sizing:border-box;margin:0;padding:0}body{width:2048px;height:2048px;font-family:Inter;overflow:hidden}
.mono{font-family:'JetBrains Mono';letter-spacing:.1em;text-transform:uppercase}.h{font-family:'Inter Tight';font-weight:800;letter-spacing:-.035em;line-height:.92}`;
const how=`<div style="width:2048px;height:2048px;background:#F4F4F4;padding:150px;display:flex;flex-direction:column">
<span class="mono" style="font-size:36px;color:#555">How to use</span>
<div class="h" style="font-size:190px;margin-top:30px">Tear. Pour. Go.</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-top:auto">
${[['01','Tear','One stick. In your gym bag, kit bag or pocket.','<rect x="60" y="20" width="60" height="200" rx="10" fill="#000"/><rect x="60" y="170" width="60" height="50" rx="0" fill="#D7F75B"/><path d="M50 60 l80 -20" stroke="#000" stroke-width="10" stroke-linecap="round"/>'],
['02','Pour','Into 500 ml of cold water. Shake for five seconds.','<rect x="45" y="60" width="90" height="170" rx="18" fill="#fff" stroke="#000" stroke-width="8"/><rect x="65" y="30" width="50" height="34" rx="8" fill="#000"/><rect x="49" y="140" width="82" height="86" rx="12" fill="#D7F75B"/>'],
['03','Go','Before, during or after sessions where you sweat.','<path d="M90 20 L50 130 h40 l-20 100 l80 -130 h-45 l25 -80z" fill="#D7F75B" stroke="#000" stroke-width="8" stroke-linejoin="round"/>']].map(([n,t,d,svg])=>`<div style="background:#fff;border-radius:40px;padding:56px;height:1220px;display:flex;flex-direction:column">
<span class="mono" style="font-size:30px;color:#555">${n}</span><svg viewBox="0 0 180 250" style="width:360px;height:500px;margin:80px auto 40px">${svg}</svg>
<div class="h" style="font-size:110px;margin-top:auto">${t}</div><p style="font-size:44px;line-height:1.35;color:#333;margin-top:24px">${d}</p></div>`).join('')}
</div></div>`;
const inside=`<div style="width:2048px;height:2048px;background:#000;color:#fff;padding:150px;display:flex;flex-direction:column;position:relative;overflow:hidden">
<div style="position:absolute;right:-300px;top:500px;width:1400px;height:1400px;border-radius:50%;background:#D7F75B;filter:blur(260px);opacity:.25"></div>
<span class="mono" style="font-size:36px;color:#D7F75B">Inside every stick</span>
<div class="h" style="font-size:190px;margin-top:30px">Electrolytes,<br>measured.</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:auto;position:relative">
${[['1,000','mg','Sodium','The electrolyte you lose most in sweat','#D7F75B','#000'],['200','mg','Potassium','10% NRV','#151515','#fff'],['60','mg','Magnesium','16% NRV','#151515','#fff'],['0','g','Sugar','No fillers, no colours','#fff','#000']].map(([v,u,n,d,bg,fg])=>`<div style="background:${bg};color:${fg};border-radius:40px;padding:56px;min-height:470px;display:flex;flex-direction:column">
<span class="mono" style="font-size:30px;opacity:.7">${n}</span><div class="h" style="font-size:190px;margin-top:auto">${v}<span style="font-size:80px;margin-left:12px">${u}</span></div><p style="font-size:38px;opacity:.75;margin-top:16px">${d}</p></div>`).join('')}
</div></div>`;
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:2048,height:2048}});
for (const [n,h] of [['how-to-use',how],['inside-every-stick',inside]]) { await p.setContent(`<!doctype html><style>${F}</style><body>${h}</body>`,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:`${__dirname}/${n}.png`}); console.log('ok',n);}
await b.close();})();
