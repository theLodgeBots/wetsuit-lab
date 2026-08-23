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
      shoulders:'M184 132 Q202 103 232 96 L239 91 L245 119 Q268 128 327 151 L337 101 Q365 109 382 132 L366 191 Q350 164 326 158 L302 178 Q278 194 251 183 Q229 174 216 153 Q197 158 184 185 L168 174 Q170 150 184 132Z',
      chest:'M216 153 Q229 174 251 183 Q278 194 302 178 L326 158 Q345 166 354 188 Q326 220 294 226 Q258 232 225 213 Q206 202 184 185 Q197 158 216 153Z',
      body:'M184 185 Q206 202 225 213 Q258 232 294 226 Q326 220 354 188 L348 373 Q345 408 318 436 L280 468 L260 421 L240 468 L202 436 Q175 408 172 373 L166 218Z',
      arms:'M184 132 Q159 140 147 169 Q139 189 137 218 L126 346 Q133 354 145 348 L164 224 Q168 194 184 185Z M337 101 Q369 109 382 132 Q394 152 398 184 L414 346 Q407 354 395 348 L374 211 Q369 178 354 188 L326 158Z',
      sides:'M166 218 L172 373 Q175 408 202 436 L190 463 Q162 434 157 389 L151 266Z M354 188 Q361 205 364 231 L369 389 Q364 434 330 463 L318 436 Q345 408 348 373Z',
      legs:'M190 463 L202 436 L240 468 L260 421 L247 650 Q236 655 220 651 L205 521Z M260 421 L280 468 L318 436 L330 463 L315 521 L300 651 Q284 655 273 650Z',
      knees:'M202 495 Q220 477 242 491 L239 556 Q234 579 218 579 Q201 578 198 552Z M278 491 Q300 477 318 495 L322 552 Q319 578 302 579 Q286 579 281 556Z',
      accent:'M230 71 Q260 56 290 71 L289 111 Q260 124 231 111Z'
    },
    back:{
      shoulders:'M484 132 Q502 103 532 96 L539 91 L545 119 Q568 128 627 151 L637 101 Q665 109 682 132 L666 191 Q650 164 626 158 L602 178 Q578 194 551 183 Q529 174 516 153 Q497 158 484 185 L468 174 Q470 150 484 132Z',
      chest:'M516 153 Q529 174 551 183 Q578 194 602 178 L626 158 Q645 166 654 188 Q626 220 594 226 Q558 232 525 213 Q506 202 484 185 Q497 158 516 153Z',
      body:'M484 185 Q506 202 525 213 Q558 232 594 226 Q626 220 654 188 L648 373 Q645 408 618 436 L580 468 L560 421 L540 468 L502 436 Q475 408 472 373 L466 218Z',
      arms:'M484 132 Q459 140 447 169 Q439 189 437 218 L426 346 Q433 354 445 348 L464 224 Q468 194 484 185Z M637 101 Q669 109 682 132 Q694 152 698 184 L714 346 Q707 354 695 348 L674 211 Q669 178 654 188 L626 158Z',
      sides:'M466 218 L472 373 Q475 408 502 436 L490 463 Q462 434 457 389 L451 266Z M654 188 Q661 205 664 231 L669 389 Q664 434 630 463 L618 436 Q645 408 648 373Z',
      legs:'M490 463 L502 436 L540 468 L560 421 L547 650 Q536 655 520 651 L505 521Z M560 421 L580 468 L618 436 L630 463 L615 521 L600 651 Q584 655 573 650Z',
      knees:'M502 495 Q520 477 542 491 L539 556 Q534 579 518 579 Q501 578 498 552Z M578 491 Q600 477 618 495 L622 552 Q619 578 602 579 Q586 579 581 556Z',
      accent:'M530 71 Q560 56 590 71 L589 111 Q560 124 531 111Z'
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
function selectZone(z){state.active=state.active===z?null:z;state.pattern=state.active?state.zones[state.active].pattern:null;syncInputs();render()}
function setColor(c){if(!state.active||!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();state.zones[state.active].color=c.toUpperCase();syncInputs();render()}
function setColor2(c){if(!state.active||!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();state.zones[state.active].color2=c.toUpperCase();syncInputs();render()}
function setPattern(p){if(!state.active)return;snapshot();state.pattern=p;state.zones[state.active].pattern=p;syncInputs();render()}
function refreshSelection(){document.querySelectorAll('[data-zone]').forEach(e=>e.classList.toggle('active',e.dataset.zone===state.active));document.querySelectorAll('[data-pattern]').forEach(e=>e.classList.toggle('active',e.dataset.pattern===state.pattern));document.querySelectorAll('[data-model]').forEach(e=>e.classList.toggle('active',e.dataset.model===state.model))}
function syncInputs(){
  const cfg=state.active?state.zones[state.active]:null;
  document.querySelectorAll('#colorInput,#hexInput,#color2Input,#hex2Input,.swatch,.pattern').forEach(el=>el.disabled=!cfg);
  if(cfg){document.getElementById('colorInput').value=cfg.color;document.getElementById('hexInput').value=cfg.color;document.getElementById('color2Input').value=cfg.color2;document.getElementById('hex2Input').value=cfg.color2}
  document.getElementById('secondaryColorControls').classList.toggle('is-disabled',!cfg||cfg.pattern==='solid');
  refreshSelection();
}
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
