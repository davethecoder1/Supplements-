const { chromium } = require('playwright');
const path = require('path');
const OUT = __dirname;

const FL = {
  'citrus-salt': { name: 'Citrus Salt', c: '#E8CF4A', ink: '#000' },
  'watermelon': { name: 'Watermelon', c: '#E86F6F', ink: '#000' },
  'mixed-berry': { name: 'Mixed Berry', c: '#7E5BA6', ink: '#fff' },
  'pure': { name: 'Pure', c: '#D5DBD9', ink: '#000' },
  'variety': { name: 'Variety', c: null, ink: '#000' },
};
const VAR = ['#E8CF4A', '#E86F6F', '#7E5BA6', '#D5DBD9'];

function band(f) {
  if (f.c) return `<div class="band" style="background:${f.c};color:${f.ink}">${f.name}</div>`;
  return `<div class="band band--var">${VAR.map(c => `<i style="background:${c}"></i>`).join('')}<span>Variety</span></div>`;
}
function box(f, scale = 1) {
  return `<div class="box" style="transform:scale(${scale})">
    <div class="box__side"></div>
    <div class="box__front">
      <div class="top"><span class="mono">Electrolyte drink mix</span><span class="mono">30 × 500 ml</span></div>
      <div class="word">ELECTRO<br>LIFE</div>
      <div class="sub">Hydration</div>
      ${band(f)}
      <div class="stats"><div><b>1,000</b><span>mg sodium</span></div><div><b>0 g</b><span>sugar</span></div></div>
      <div class="foot mono">30 sticks · vegan</div>
    </div></div>`;
}
function stick(c, rot, x, y, z = 1) {
  return `<div class="stick" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg);z-index:${z}">
    <div class="stick__body"><span>ELECTROLIFE</span></div><div class="stick__tip" style="background:${c}"></div></div>`;
}
function shaker(x, y, scale = 1, liq = '#D7F75B') {
  return `<div class="shaker" style="left:${x}px;top:${y}px;transform:scale(${scale});transform-origin:bottom center">
    <div class="sh__cap"></div><div class="sh__neck"></div>
    <div class="sh__body"><div class="sh__liquid" style="background:${liq};opacity:.85"></div><div class="sh__ticks">${[500, 400, 300, 200, 100].map(v => `<i>${v}</i>`).join('')}</div>
    <div class="sh__word">ELECTRO<br>LIFE</div></div></div>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Inter+Tight:wght@800;900&family=JetBrains+Mono:wght@500&display=block');
*{box-sizing:border-box;margin:0;padding:0}
body{width:2048px;height:2048px;background:#F4F4F4;font-family:Inter,sans-serif;overflow:hidden;position:relative}
.stage{position:absolute;inset:0}
.floor{position:absolute;left:50%;bottom:250px;width:1500px;height:120px;transform:translateX(-50%);background:radial-gradient(ellipse at center,rgba(0,0,0,.22),rgba(0,0,0,0) 70%);filter:blur(10px)}
.mono{font-family:'JetBrains Mono',monospace;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.box{position:absolute;width:820px;height:1180px;transform-origin:bottom center}
.box__front{position:absolute;inset:0;background:#000;color:#fff;border-radius:22px;padding:64px 64px 56px;display:flex;flex-direction:column;box-shadow:0 40px 80px rgba(0,0,0,.18)}
.box__side{display:none}
.top{display:flex;justify-content:space-between;font-size:26px;color:#bbb}
.word{font-family:'Inter Tight',sans-serif;font-weight:900;font-size:168px;line-height:.86;letter-spacing:-.03em;margin-top:70px}
.sub{font-family:'Inter Tight';font-weight:800;font-size:64px;letter-spacing:-.03em;color:#D7F75B;margin-top:22px}
.band{margin-top:auto;border-radius:14px;height:120px;display:flex;align-items:center;padding:0 40px;font-family:'Inter Tight';font-weight:800;font-size:58px;letter-spacing:-.025em}
.band--var{padding:0;overflow:hidden;position:relative}
.band--var i{flex:1;height:100%}
.band--var span{position:absolute;left:40px;color:#000}
.stats{display:flex;gap:56px;margin-top:40px}
.stats b{display:block;font-family:'Inter Tight';font-weight:800;font-size:72px;letter-spacing:-.03em;line-height:1}
.stats span{font-size:26px;color:#bbb;font-weight:600}
.foot{margin-top:34px;font-size:24px;color:#888}
.stick{position:absolute;width:150px;height:680px;transform-origin:bottom center}
.stick__body{position:absolute;inset:0 0 140px 0;background:#000;border-radius:14px 14px 0 0;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px rgba(0,0,0,.15)}
.stick__body span{transform:rotate(-90deg);white-space:nowrap;color:#fff;font-family:'Inter Tight';font-weight:900;font-size:62px;letter-spacing:-.03em}
.stick__tip{position:absolute;left:0;right:0;bottom:0;height:140px;border-radius:0 0 14px 14px}
.shaker{position:absolute;width:520px;height:1260px}
.sh__cap{width:300px;height:150px;margin:0 auto;background:#000;border-radius:30px 30px 10px 10px}
.sh__neck{width:420px;height:60px;margin:0 auto;background:#111;border-radius:8px}
.sh__body{position:relative;width:520px;height:1050px;border-radius:40px 40px 70px 70px;background:linear-gradient(90deg,rgba(255,255,255,.92),rgba(255,255,255,.6) 40%,rgba(255,255,255,.85));border:3px solid rgba(0,0,0,.08);overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.14)}
.sh__liquid{position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(180deg,rgba(215,247,91,.85),rgba(190,225,60,.9))}
.sh__ticks{position:absolute;right:36px;top:120px;display:flex;flex-direction:column;gap:118px;font-family:'JetBrains Mono';font-size:26px;color:rgba(0,0,0,.45)}
.sh__ticks i{font-style:normal;border-top:3px solid rgba(0,0,0,.3);padding-top:4px;width:80px}
.sh__word{position:absolute;left:48px;bottom:70px;font-family:'Inter Tight';font-weight:900;font-size:70px;line-height:.88;letter-spacing:-.03em;color:#000}
`;

function page(inner) { return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage"><div class="floor"></div>${inner}</div></body></html>`; }

const jobs = [];
for (const [k, f] of Object.entries(FL)) {
  const cs = f.c ? [f.c, f.c] : [VAR[1], VAR[2]];
  // Hydration box with two sticks
  jobs.push([`hydration-${k}`, page(
    stick(cs[0], -7, 1250, 900, 0) + stick(cs[1], 7, 1450, 900, 0) +
    `<div style="position:absolute;left:330px;top:434px">${box(f)}</div>`)]);
  // Starter kit: box + shaker
  jobs.push([`starter-kit-${k}`, page(
    `<div style="position:absolute;left:250px;top:434px">${box(f)}</div>` + shaker(1240, 354, 1, f.c && k !== 'pure' ? f.c : '#D7F75B'))]);
}
jobs.push(['shaker-bottle', page(shaker(764, 354, 1, '#D7F75B'))]);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2048, height: 2048 } });
  for (const [name, html] of jobs) {
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('ok', name);
  }
  await b.close();
})();
