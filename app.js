const zoneNames={body:'Main body',chest:'Chest',shoulders:'Shoulders',arms:'Arms',sides:'Side panels',legs:'Lower legs',knees:'Knee pads',accent:'Accent'};
const palette=['#111111','#f4ff58','#ff4f9a','#ff5a36','#7c5cff','#13c9c3','#1473e6','#f1ead7','#9aa0a3','#6a3df0','#b8ffdf','#ffb800','#9a174c','#23364d','#ffffff','#784b2b'];
const models=[
  {id:'classic',name:'ASYM FULL',icon:'◒',description:'Asymmetric chest and knee panels'},
  {id:'apex',name:'SPRING',icon:'◫',description:'Short sleeve and thigh-length cut'},
  {id:'flow',name:'ZIP FULL',icon:'↟',description:'Front zip with curved torso panels'}
];
const presets=[['#111111','#f4ff58','#f4ff58','#111111','#111111','#111111','#111111','#f4ff58'],['#23364d','#ff5a36','#f1ead7','#23364d','#13c9c3','#23364d','#111111','#ff5a36'],['#7c5cff','#ff4f9a','#ffb800','#7c5cff','#ff4f9a','#111111','#111111','#f4ff58'],['#f1ead7','#111111','#f1ead7','#111111','#111111','#f1ead7','#111111','#9a174c'],['#13c9c3','#1473e6','#b8ffdf','#23364d','#1473e6','#23364d','#111111','#f4ff58']];
const defaultColors={body:'#111111',chest:'#f4ff58',shoulders:'#111111',arms:'#111111',sides:'#111111',legs:'#111111',knees:'#1d1e1c',accent:'#f4ff58'};
let state=JSON.parse(localStorage.getItem('wetsuit-lab-state'))||{model:'classic',active:'chest',pattern:'solid',zones:Object.fromEntries(Object.keys(defaultColors).map(k=>[k,{color:defaultColors[k],color2:'#111111',pattern:'solid'}]))};
Object.keys(defaultColors).forEach(k=>{
  if(!state.zones[k]) state.zones[k]={color:defaultColors[k],color2:'#111111',pattern:'solid'};
  if(!state.zones[k].color2) state.zones[k].color2='#111111';
});
let history=[];

const paths={
  classic:{
    front:{
      shoulders:'M178 133 Q193 104 224 91 L238 86 L245 123 Q278 143 335 166 L346 117 Q375 130 387 157 L365 239 Q344 204 318 191 L248 160 Q220 148 197 160 L168 213 L157 174 Q163 149 178 133Z',
      chest:'M197 160 Q220 148 248 160 L318 191 Q344 204 365 239 L350 361 Q310 385 260 385 Q210 385 170 361 L158 228 L197 160Z',
      body:'M170 361 Q210 385 260 385 Q310 385 350 361 L361 448 L310 466 Q284 442 260 411 Q236 442 210 466 L159 448Z',
      arms:'M157 174 Q132 188 124 230 L102 356 Q112 367 132 358 L158 236 L168 213Z M346 117 Q380 132 392 174 L418 356 Q408 367 388 358 L363 239 L365 239Z',
      sides:'M158 228 L170 361 L159 448 L145 405 L158 236Z M365 239 L350 361 L361 448 L375 405 L363 239Z',
      legs:'M159 448 L210 466 Q226 503 218 551 L207 654 Q188 660 169 653 L153 548Z M310 466 L361 448 L367 548 L351 653 Q332 660 313 654 L302 551 Q294 503 310 466Z',
      knees:'M156 505 Q187 482 218 503 L215 552 Q210 590 185 591 Q160 590 154 552Z M302 503 Q333 482 364 505 L366 552 Q360 590 335 591 Q310 590 305 552Z',
      accent:'M221 75 Q260 55 299 75 L298 116 Q260 135 222 116Z'
    },
    back:{
      shoulders:'M478 133 Q493 104 524 91 L538 86 L545 123 Q578 143 635 166 L646 117 Q675 130 687 157 L665 239 Q644 204 618 191 L548 160 Q520 148 497 160 L468 213 L457 174 Q463 149 478 133Z',
      chest:'M497 160 Q520 148 548 160 L618 191 Q644 204 665 239 L650 361 Q610 385 560 385 Q510 385 470 361 L458 228 L497 160Z',
      body:'M470 361 Q510 385 560 385 Q610 385 650 361 L661 448 L610 466 Q584 442 560 411 Q536 442 510 466 L459 448Z',
      arms:'M457 174 Q432 188 424 230 L402 356 Q412 367 432 358 L458 236 L468 213Z M646 117 Q680 132 692 174 L718 356 Q708 367 688 358 L663 239 L665 239Z',
      sides:'M458 228 L470 361 L459 448 L445 405 L458 236Z M665 239 L650 361 L661 448 L675 405 L663 239Z',
      legs:'M459 448 L510 466 Q526 503 518 551 L507 654 Q488 660 469 653 L453 548Z M610 466 L661 448 L667 548 L651 653 Q632 660 613 654 L602 551 Q594 503 610 466Z',
      knees:'M456 505 Q487 482 518 503 L515 552 Q510 590 485 591 Q460 590 454 552Z M602 503 Q633 482 664 505 L666 552 Q660 590 635 591 Q610 590 605 552Z',
      accent:'M521 75 Q560 55 599 75 L598 116 Q560 135 522 116Z'
    }
  },
  apex:{
    front:{shoulders:'M185 130 Q260 82 335 130 L322 190 L260 225 L198 190Z',chest:'M198 190 L260 225 L322 190 L305 330 L260 355 L215 330Z',body:'M215 330 L260 355 L305 330 L315 458 Q285 475 260 438 Q235 475 205 458Z',arms:'M185 130 Q150 145 145 205 L143 260 L178 265 L184 205 L198 190Z M335 130 Q370 145 375 205 L377 260 L342 265 L336 205 L322 190Z',sides:'M198 190 L215 330 L205 458 L178 390 L178 225Z M322 190 L305 330 L315 458 L342 390 L342 225Z',legs:'M205 458 Q235 475 260 438 L250 520 L198 518Z M260 438 Q285 475 315 458 L322 518 L270 520Z',knees:'M198 488 Q224 476 252 492 L250 520 L198 518Z M268 492 Q296 476 322 488 L322 518 L270 520Z',accent:'M215 113 Q235 96 260 108 Q285 96 305 113 L296 142 Q260 157 224 142Z'},
    back:{shoulders:'M485 130 Q560 82 635 130 L622 190 L560 225 L498 190Z',chest:'M498 190 L560 225 L622 190 L605 330 L560 355 L515 330Z',body:'M515 330 L560 355 L605 330 L615 458 Q585 475 560 438 Q535 475 505 458Z',arms:'M485 130 Q450 145 445 205 L443 260 L478 265 L484 205 L498 190Z M635 130 Q670 145 675 205 L677 260 L642 265 L636 205 L622 190Z',sides:'M498 190 L515 330 L505 458 L478 390 L478 225Z M622 190 L605 330 L615 458 L642 390 L642 225Z',legs:'M505 458 Q535 475 560 438 L550 520 L498 518Z M560 438 Q585 475 615 458 L622 518 L570 520Z',knees:'M498 488 Q524 476 552 492 L550 520 L498 518Z M568 492 Q596 476 622 488 L622 518 L570 520Z',accent:'M515 113 Q535 96 560 108 Q585 96 605 113 L596 142 Q560 157 524 142Z'}
  },
  flow:{
    front:{shoulders:'M185 130 Q260 82 335 130 Q310 175 280 197 Q238 220 198 190Z',chest:'M198 190 Q238 220 280 197 Q302 185 322 190 Q308 270 305 330 Q260 375 215 330Z',body:'M215 330 Q260 375 305 330 L319 470 L280 474 L260 398 L240 474 L201 470Z',arms:'M185 130 Q150 145 138 210 L120 350 L154 355 L178 225 L198 190Z M335 130 Q370 145 382 210 L400 350 L366 355 L342 225 L322 190Z',sides:'M198 190 L215 330 L201 470 L178 410 L178 225Z M322 190 L305 330 L319 470 L342 410 L342 225Z',legs:'M201 470 L240 474 L225 630 L184 625Z M280 474 L319 470 L336 625 L295 630Z',knees:'M188 500 Q210 470 239 490 L233 555 Q202 540 182 575Z M281 490 Q310 470 332 500 L338 575 Q316 540 287 555Z',accent:'M215 113 Q235 96 260 108 Q285 96 305 113 L296 142 Q260 157 224 142Z'},
    back:{shoulders:'M485 130 Q560 82 635 130 Q610 175 580 197 Q538 220 498 190Z',chest:'M498 190 Q538 220 580 197 Q602 185 622 190 Q608 270 605 330 Q560 375 515 330Z',body:'M515 330 Q560 375 605 330 L621 470 L581 474 L560 398 L539 474 L499 470Z',arms:'M485 130 Q450 145 438 210 L420 350 L454 355 L478 225 L498 190Z M635 130 Q670 145 682 210 L700 350 L666 355 L642 225 L622 190Z',sides:'M498 190 L515 330 L499 470 L478 410 L478 225Z M622 190 L605 330 L621 470 L642 410 L642 225Z',legs:'M499 470 L539 474 L525 630 L484 625Z M581 474 L621 470 L636 625 L595 630Z',knees:'M488 500 Q510 470 539 490 L533 555 Q502 540 482 575Z M581 490 Q610 470 632 500 L638 575 Q616 540 587 555Z',accent:'M515 113 Q535 96 560 108 Q585 96 605 113 L596 142 Q560 157 524 142Z'}
  }
};

function init(){
  document.getElementById('modelGrid').innerHTML=models.map(m=>`<button class="model-card ${state.model===m.id?'active':''}" data-model="${m.id}" title="${m.description}" aria-label="${m.name}: ${m.description}"><span class="model-thumb">${m.icon}</span><span class="model-name">${m.name}</span></button>`).join('');
  document.getElementById('zonePicker').innerHTML=Object.keys(zoneNames).map(z=>`<button class="zone-button ${state.active===z?'active':''}" data-zone="${z}"><i class="zone-dot" style="background:${state.zones[z].color}"></i>${zoneNames[z]}</button>`).join('');
  document.getElementById('swatches').innerHTML=palette.map(c=>`<button class="swatch" style="background:${c}" data-color="${c}" aria-label="Use ${c}"></button>`).join('');
  document.getElementById('patternGrid').innerHTML=['solid','stripe','check','wave'].map((p,i)=>`<button class="pattern ${state.pattern===p?'active':''}" data-pattern="${p}" aria-label="${p} pattern" title="${p}"></button>`).join('');
  document.getElementById('presetList').innerHTML=presets.map((p,i)=>`<button class="preset" data-preset="${i}" aria-label="Apply preset ${i+1}">${p.slice(0,5).map(c=>`<i style="background:${c}"></i>`).join('')}</button>`).join('');
  bind();render();syncInputs();
}
function patternDefs(){return `<defs><pattern id="stripe" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="9" height="18" fill="var(--c)"/><rect x="9" width="9" height="18" fill="var(--c2)"/></pattern><pattern id="check" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="var(--c)"/><path d="M0 0h12v12H0zM12 12h12v12H12z" fill="var(--c2)"/></pattern><pattern id="wave" width="28" height="20" patternUnits="userSpaceOnUse"><rect width="28" height="20" fill="var(--c)"/><path d="M-7 10 Q0 0 7 10 T21 10 T35 10" fill="none" stroke="var(--c2)" stroke-width="5"/></pattern></defs>`}
function render(){
  const svg=document.getElementById('suitSvg');let out=patternDefs();
  for(const view of ['front','back']) for(const [zone,d] of Object.entries(paths[state.model][view])){const cfg=state.zones[zone];const fill=cfg.pattern==='solid'?cfg.color:`url(#${cfg.pattern}-${zone})`;if(cfg.pattern!=='solid')out+=`<pattern id="${cfg.pattern}-${zone}" href="#${cfg.pattern}" style="--c:${cfg.color};--c2:${cfg.color2}"/>`;out+=`<path class="suit-panel ${state.active===zone?'selected':''}" data-zone="${zone}" d="${d}" fill="${fill}"/>`;}
  if(state.model==='classic') out+=`<path class="reference-seams" d="M232 84 Q260 96 288 84 M253 142 L305 165 M331 119 L317 169 M532 84 Q560 96 588 84 M560 145 L618 169 M628 121 L618 169 M188 647 L224 647 M296 647 L332 647 M488 647 L524 647 M596 647 L632 647"/><path class="chest-mark" d="M257 181h2 M265 183h2 M557 181h2 M565 183h2"/>`;
  if(state.model==='flow') out+=`<path class="front-zip" d="M260 143 L260 355"/><path class="back-leg-seam" d="M560 398 L560 630"/><path class="zip-pull" d="M254 157h12v18h-12z"/>`;
  svg.innerHTML=out;document.getElementById('styleCode').textContent=`WL—0${models.findIndex(m=>m.id===state.model)+1}`;
  document.querySelectorAll('.zone-dot').forEach((d,i)=>d.style.background=state.zones[Object.keys(zoneNames)[i]].color);
  document.querySelectorAll('.suit-panel').forEach(p=>p.onclick=()=>selectZone(p.dataset.zone));save();
}
function snapshot(){history.push(JSON.stringify(state));if(history.length>30)history.shift()}
function selectZone(z){state.active=z;state.pattern=state.zones[z].pattern;refreshSelection();syncInputs();render()}
function setColor(c){if(!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();state.zones[state.active].color=c.toUpperCase();syncInputs();render()}
function setColor2(c){if(!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();state.zones[state.active].color2=c.toUpperCase();syncInputs();render()}
function setPattern(p){snapshot();state.pattern=p;state.zones[state.active].pattern=p;syncInputs();render()}
function refreshSelection(){document.querySelectorAll('[data-zone]').forEach(e=>e.classList.toggle('active',e.dataset.zone===state.active));document.querySelectorAll('[data-pattern]').forEach(e=>e.classList.toggle('active',e.dataset.pattern===state.pattern));document.querySelectorAll('[data-model]').forEach(e=>e.classList.toggle('active',e.dataset.model===state.model))}
function syncInputs(){const cfg=state.zones[state.active];document.getElementById('colorInput').value=cfg.color;document.getElementById('hexInput').value=cfg.color;document.getElementById('color2Input').value=cfg.color2;document.getElementById('hex2Input').value=cfg.color2;document.getElementById('secondaryColorControls').classList.toggle('is-disabled',cfg.pattern==='solid');refreshSelection()}
function save(){localStorage.setItem('wetsuit-lab-state',JSON.stringify(state))}
function bind(){
  document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{snapshot();state.model=b.dataset.model;refreshSelection();render()});
  document.querySelectorAll('.zone-button').forEach(b=>b.onclick=()=>selectZone(b.dataset.zone));
  document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>setColor(b.dataset.color));
  document.querySelectorAll('.pattern').forEach(b=>b.onclick=()=>setPattern(b.dataset.pattern));
  document.getElementById('colorInput').oninput=e=>setColor(e.target.value);
  document.getElementById('hexInput').onchange=e=>setColor(e.target.value);
  document.getElementById('color2Input').oninput=e=>setColor2(e.target.value);
  document.getElementById('hex2Input').onchange=e=>setColor2(e.target.value);
  document.querySelectorAll('.preset').forEach(b=>b.onclick=()=>{snapshot();const p=presets[+b.dataset.preset];Object.keys(zoneNames).forEach((z,i)=>{state.zones[z].color=p[i];state.zones[z].pattern='solid'});state.pattern='solid';syncInputs();render()});
  document.getElementById('undoBtn').onclick=()=>{if(history.length){state=JSON.parse(history.pop());init()}};
  document.getElementById('randomBtn').onclick=()=>{snapshot();Object.keys(zoneNames).forEach(z=>{state.zones[z].color=palette[Math.floor(Math.random()*palette.length)];state.zones[z].pattern=['solid','solid','stripe','check','wave'][Math.floor(Math.random()*5)]});syncInputs();render()};
  document.getElementById('resetBtn').onclick=()=>{snapshot();Object.keys(defaultColors).forEach(z=>state.zones[z]={color:defaultColors[z],color2:'#111111',pattern:'solid'});state.model='classic';state.active='chest';state.pattern='solid';init()};
  document.getElementById('exportBtn').onclick=exportPng;
}
function exportPng(){const svg=document.getElementById('suitSvg');const clone=svg.cloneNode(true);clone.setAttribute('width','1640');clone.setAttribute('height','1440');const data=new XMLSerializer().serializeToString(clone);const blob=new Blob([data],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1640;canvas.height=1440;const ctx=canvas.getContext('2d');ctx.fillStyle='#f8f7f1';ctx.fillRect(0,0,1640,1440);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);const a=document.createElement('a');a.download=`wetsuit-lab-${state.model}.png`;a.href=canvas.toDataURL('image/png');a.click()};img.src=url}
init();
