const zoneNames={body:'Main body',chest:'Chest',shoulders:'Shoulders',arms:'Arms',sides:'Side panels',legs:'Lower legs',knees:'Knee pads',accent:'Accent'};
const palette=['#111111','#f4ff58','#ff4f9a','#ff5a36','#7c5cff','#13c9c3','#1473e6','#f1ead7','#9aa0a3','#6a3df0','#b8ffdf','#ffb800','#9a174c','#23364d','#ffffff','#784b2b'];
const models=[
  {id:'classic',name:'ASYM FULL',icon:'◒',description:'Asymmetric chest and knee panels'},
  {id:'apex',name:'SPRING',icon:'◫',description:'Short sleeve and thigh-length cut'},
  {id:'flow',name:'ZIP FULL',icon:'↟',description:'Front zip with curved torso panels'},
  {id:'spring',name:'SPRING SUIT',icon:'⌁',description:'Short sleeve and thigh-length spring suit'}
];
const presets=[['#111111','#f4ff58','#f4ff58','#111111','#111111','#111111','#111111','#f4ff58'],['#23364d','#ff5a36','#f1ead7','#23364d','#13c9c3','#23364d','#111111','#ff5a36'],['#7c5cff','#ff4f9a','#ffb800','#7c5cff','#ff4f9a','#111111','#111111','#f4ff58'],['#f1ead7','#111111','#f1ead7','#111111','#111111','#f1ead7','#111111','#9a174c'],['#13c9c3','#1473e6','#b8ffdf','#23364d','#1473e6','#23364d','#111111','#f4ff58']];
const defaultColors={body:'#111111',chest:'#f4ff58',shoulders:'#7c5cff',arms:'#13c9c3',sides:'#ff5a36',legs:'#23364d',knees:'#1d1e1c',accent:'#ff4f9a'};
const seamColor='#151614';
let state=JSON.parse(localStorage.getItem('wetsuit-lab-state'))||{model:'classic',active:'chest',pattern:'solid',zones:Object.fromEntries(Object.keys(defaultColors).map(k=>[k,{color:defaultColors[k],color2:'#111111',pattern:'solid'}]))};
Object.keys(defaultColors).forEach(k=>{
  if(!state.zones[k]) state.zones[k]={color:defaultColors[k],color2:'#111111',pattern:'solid'};
  if(!state.zones[k].color2) state.zones[k].color2='#111111';
});
if(!state.referencePanels)state.referencePanels={};
let history=[];
const referenceAssets={classic:'asym-reference.svg',apex:'pattern-2.svg',flow:'pattern-3.svg',spring:'pattern-4-spring-suit.svg'};
const references={};
let responsiveLayoutBound=false;
let sharkPreviewBound=false;

const paths={
  classic:{
    front:{
      shoulders:'M184 132 Q202 103 232 96 L239 91 L245 119 Q268 128 327 151 L337 101 Q365 109 382 132 L366 191 Q350 164 326 158 L302 178 Q278 194 251 183 Q229 174 216 153 Q197 158 184 185 L168 174 Q170 150 184 132Z',
      chest:'M216 153 Q229 174 251 183 Q278 194 302 178 L326 158 Q345 166 354 188 Q326 204 294 211 Q258 220 225 205 Q206 197 184 185 Q197 158 216 153Z',
      body:'M184 185 Q206 197 225 205 Q258 220 294 211 Q326 204 354 188 L330 220 Q323 282 320 342 Q318 380 300 403 Q281 418 260 405 Q239 418 220 403 Q202 380 200 342 Q197 282 190 220Z',
      arms:'M184 132 Q159 140 147 169 Q139 189 138 218 L131 346 Q138 351 148 346 L166 222 Q169 195 184 185Z M337 101 Q366 108 380 130 Q391 149 393 180 L409 346 Q402 351 392 346 L371 209 Q367 180 354 188 L326 158Z',
      sides:'M184 185 L190 220 Q197 282 200 342 Q202 380 220 403 L195 427 Q176 397 174 360 L166 218Z M354 188 Q360 204 361 229 L346 360 Q344 397 325 427 L300 403 Q318 380 320 342 Q323 282 330 220Z',
      legs:'M195 427 L220 403 Q239 418 260 405 L245 447 L245 650 Q234 654 222 650 L207 520Z M260 405 Q281 418 300 403 L325 427 L313 520 L298 650 Q286 654 275 650 L275 447Z',
      knees:'M204 492 Q220 475 242 488 L241 550 Q237 575 220 577 Q203 574 201 548Z M278 488 Q300 475 316 492 L319 548 Q317 574 300 577 Q283 575 279 550Z',
      accent:'M230 71 Q260 56 290 71 L289 111 Q260 124 231 111Z'
    },
    back:{
      shoulders:'M484 132 Q502 103 532 96 L539 91 L545 119 Q568 128 627 151 L637 101 Q665 109 682 132 L666 191 Q650 164 626 158 L602 178 Q578 194 551 183 Q529 174 516 153 Q497 158 484 185 L468 174 Q470 150 484 132Z',
      chest:'M516 153 Q529 174 551 183 Q578 194 602 178 L626 158 Q645 166 654 188 Q626 204 594 211 Q558 220 525 205 Q506 197 484 185 Q497 158 516 153Z',
      body:'M484 185 Q506 197 525 205 Q558 220 594 211 Q626 204 654 188 L630 220 Q623 282 620 342 Q618 380 600 403 Q581 418 560 405 Q539 418 520 403 Q502 380 500 342 Q497 282 490 220Z',
      arms:'M484 132 Q459 140 447 169 Q439 189 438 218 L431 346 Q438 351 448 346 L466 222 Q469 195 484 185Z M637 101 Q666 108 680 130 Q691 149 693 180 L709 346 Q702 351 692 346 L671 209 Q667 180 654 188 L626 158Z',
      sides:'M484 185 L490 220 Q497 282 500 342 Q502 380 520 403 L495 427 Q476 397 474 360 L466 218Z M654 188 Q660 204 661 229 L646 360 Q644 397 625 427 L600 403 Q618 380 620 342 Q623 282 630 220Z',
      legs:'M495 427 L520 403 Q539 418 560 405 L545 447 L545 650 Q534 654 522 650 L507 520Z M560 405 Q581 418 600 403 L625 427 L613 520 L598 650 Q586 654 575 650 L575 447Z',
      knees:'M504 492 Q520 475 542 488 L541 550 Q537 575 520 577 Q503 574 501 548Z M578 488 Q600 475 616 492 L619 548 Q617 574 600 577 Q583 575 579 550Z',
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
  updateZonePicker();
  document.getElementById('swatches').innerHTML=palette.map(c=>`<button class="swatch" style="background:${c}" data-color="${c}" aria-label="Use ${c}"></button>`).join('');
  document.getElementById('patternGrid').innerHTML=['solid','stripe','check','wave'].map((p,i)=>`<button class="pattern ${state.pattern===p?'active':''}" data-pattern="${p}" aria-label="${p} pattern" title="${p}"></button>`).join('');
  document.getElementById('presetList').innerHTML=presets.map((p,i)=>`<button class="preset" data-preset="${i}" aria-label="Apply preset ${i+1}">${p.slice(0,5).map(c=>`<i style="background:${c}"></i>`).join('')}</button>`).join('');
  bind();render();syncInputs();setupResponsiveLayout();setupSharkView();
  loadReferences();
}
function setupResponsiveLayout(){
  if(responsiveLayoutBound)return;
  responsiveLayoutBound=true;
  const media=window.matchMedia('(max-width: 600px)');
  const arrange=()=>{
    const presets=document.querySelector('.preset-bar');
    (media.matches?document.querySelector('.controls'):document.querySelector('.stage-wrap')).append(presets);
  };
  arrange();media.addEventListener('change',arrange);
}
function updateZonePicker(){
  const picker=document.getElementById('zonePicker');
  if(references[state.model]){
    const selected=state.active?.startsWith('ref:')?Number(state.active.slice(4))+1:null;
    picker.innerHTML=`<div class="seam-panel-status"><strong>${selected?`SEAM PANEL ${String(selected).padStart(2,'0')}`:'NO PANEL SELECTED'}</strong><span>${selected?'Tap it again to deselect.':'Tap any enclosed suit panel.'}</span></div>`;
    return;
  }
  picker.innerHTML=Object.keys(zoneNames).map(z=>`<button class="zone-button ${state.active===z?'active':''}" data-zone="${z}"><i class="zone-dot" style="background:${state.zones[z].color}"></i>${zoneNames[z]}</button>`).join('');
  picker.querySelectorAll('.zone-button').forEach(b=>b.onclick=()=>selectZone(b.dataset.zone));
}
async function loadReferences(){
  await Promise.all(Object.entries(referenceAssets).map(async([model,file])=>{
    if(references[model])return;
    try{
      const source=await fetch(`assets/${file}`).then(r=>{if(!r.ok)throw new Error(`SVG ${r.status}`);return r.text()});
      const doc=new DOMParser().parseFromString(source,'image/svg+xml');
      references[model]=doc.querySelector('svg > g')?.outerHTML||null;
    }catch(error){console.error(`Unable to load supplied ${model} wetsuit reference`,error)}
  }));
  render();
}
function patternDefs(){return `<defs><pattern id="stripe" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="9" height="18" fill="var(--c)"/><rect x="9" width="9" height="18" fill="var(--c2)"/></pattern><pattern id="check" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="var(--c)"/><path d="M0 0h12v12H0zM12 12h12v12H12z" fill="var(--c2)"/></pattern><pattern id="wave" width="28" height="20" patternUnits="userSpaceOnUse"><rect width="28" height="20" fill="var(--c)"/><path d="M-7 10 Q0 0 7 10 T21 10 T35 10" fill="none" stroke="var(--c2)" stroke-width="5"/></pattern></defs>`}
function explicitPattern(id,cfg){
  if(cfg.pattern==='stripe')return `<pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="9" height="18" fill="${cfg.color}"/><rect x="9" width="9" height="18" fill="${cfg.color2}"/></pattern>`;
  if(cfg.pattern==='check')return `<pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${cfg.color}"/><path d="M0 0h12v12H0zM12 12h12v12H12z" fill="${cfg.color2}"/></pattern>`;
  if(cfg.pattern==='wave')return `<pattern id="${id}" width="28" height="20" patternUnits="userSpaceOnUse"><rect width="28" height="20" fill="${cfg.color}"/><path d="M-7 10 Q0 0 7 10 T21 10 T35 10" fill="none" stroke="${cfg.color2}" stroke-width="5"/></pattern>`;
  return'';
}
function zonePatternInstances(){return [...Object.entries(state.zones),...Object.entries(state.referencePanels).map(([key,cfg])=>[`ref-${key}`,cfg])].map(([zone,cfg])=>explicitPattern(`${cfg.pattern}-${zone}`,cfg)).join('')}
function render(){
  const svg=document.getElementById('suitSvg');let out=patternDefs();
  document.getElementById('stage').classList.add('three-view');
  document.querySelector('.left-label').textContent='SIDE';
  document.querySelector('.center-label').hidden=false;
  document.querySelector('.right-label').textContent='BACK';
  updateZonePicker();
  if(!references[state.model]&&!paths[state.model]){
    svg.setAttribute('viewBox','0 0 820 720');
    svg.innerHTML='<text x="410" y="360" text-anchor="middle">LOADING SEAM MAP…</text>';
    save();
    return;
  }
  if(references[state.model]){
    svg.setAttribute('viewBox','0 0 2481 3508');
    svg.innerHTML=out.replace('</defs>',zonePatternInstances()+'</defs>')+`<g class="classic-reference">${references[state.model]}</g>`;
    decorateReference(svg);
    document.getElementById('styleCode').textContent=`WL—0${models.findIndex(m=>m.id===state.model)+1}`;
    document.querySelectorAll('.zone-dot').forEach((d,i)=>d.style.background=state.zones[Object.keys(zoneNames)[i]].color);
    save();
    return;
  }
  svg.setAttribute('viewBox','0 0 820 720');
  for(const view of ['front','back']) for(const [zone,d] of Object.entries(paths[state.model][view])){const cfg=state.zones[zone];const fill=cfg.pattern==='solid'?cfg.color:`url(#${cfg.pattern}-${zone})`;const transform=state.model==='classic'?(view==='front'?'translate(52 0) scale(.8 1)':'translate(112 0) scale(.8 1)'):'';if(cfg.pattern!=='solid')out+=explicitPattern(`${cfg.pattern}-${zone}`,cfg);out+=`<path class="suit-panel ${state.active===zone?'selected':''}" data-zone="${zone}" d="${d}" fill="${fill}" transform="${transform}"/>`;}
  if(state.model==='classic') out+=`<path class="reference-seams" d="M232 84 Q260 96 288 84 M253 142 L305 165 M331 119 L317 169 M188 647 L224 647 M296 647 L332 647" transform="translate(52 0) scale(.8 1)"/><path class="reference-seams" d="M532 84 Q560 96 588 84 M560 145 L618 169 M628 121 L618 169 M488 647 L524 647 M596 647 L632 647" transform="translate(112 0) scale(.8 1)"/><path class="chest-mark" d="M257 181h2 M265 183h2" transform="translate(52 0) scale(.8 1)"/><path class="chest-mark" d="M557 181h2 M565 183h2" transform="translate(112 0) scale(.8 1)"/>`;
  if(state.model==='flow') out+=`<path class="front-zip" d="M260 143 L260 355"/><path class="back-leg-seam" d="M560 398 L560 630"/><path class="zip-pull" d="M254 157h12v18h-12z"/>`;
  svg.innerHTML=out;document.getElementById('styleCode').textContent=`WL—0${models.findIndex(m=>m.id===state.model)+1}`;
  document.querySelectorAll('.zone-dot').forEach((d,i)=>d.style.background=state.zones[Object.keys(zoneNames)[i]].color);
  document.querySelectorAll('.suit-panel').forEach(p=>p.onclick=()=>selectZone(p.dataset.zone));save();
}
function classifyReferencePanel(path){
  const b=path.getBBox(),x=b.x+b.width/2,y=b.y+b.height/2;
  if(y<115)return'accent';
  if(y<205)return b.width>115?'chest':'shoulders';
  if(y<360&&(x<215||x>705||b.width<55))return'arms';
  if(y<360)return'chest';
  if(y<690&&(x<120||x>815||b.width<45))return'sides';
  if(y<675)return'body';
  if(y<815&&b.height<175)return'knees';
  return'legs';
}
function defaultReferenceConfig(path,index){
  const b=path.getBBox();
  const isThin=Math.min(b.width,b.height)<9||b.width*b.height<900;
  if(isThin)return{color:seamColor,color2:'#111111',pattern:'solid',detail:true};
  const zone=classifyReferencePanel(path);
  return{color:defaultColors[zone],color2:'#111111',pattern:'solid'};
}
function panelKey(index){return `${state.model}-p${index}`}
function decorateReference(svg){
  svg.querySelectorAll('.classic-reference path').forEach((path,index)=>{
    const zone=classifyReferencePanel(path),key=panelKey(index);
    if(!state.referencePanels[key])state.referencePanels[key]=defaultReferenceConfig(path,index);
    const cfg=state.referencePanels[key],activeKey=`ref:${index}`;
    path.classList.add('suit-panel','reference-panel',cfg.detail?'seam-detail':'fabric-panel');
    if(state.active===activeKey)path.classList.add('selected');
    path.dataset.panel=key;
    const fill=cfg.pattern==='solid'?cfg.color:`url(#${cfg.pattern}-ref-${key})`;
    path.style.setProperty('fill',fill,'important');
    path.onclick=()=>selectReferencePanel(index);
  });
}
function snapshot(){history.push(JSON.stringify(state));if(history.length>30)history.shift()}
function selectZone(z){state.active=state.active===z?null:z;state.pattern=state.active?state.zones[state.active].pattern:null;syncInputs();render()}
function selectReferencePanel(index){const key=`ref:${index}`;state.active=state.active===key?null:key;state.pattern=activeConfig()?.pattern||null;syncInputs();render()}
function activeConfig(){if(!state.active)return null;if(state.active.startsWith('ref:'))return state.referencePanels[panelKey(state.active.slice(4))]||null;return state.zones[state.active]||null}
function setColor(c){const cfg=activeConfig();if(!cfg||!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();cfg.color=c.toUpperCase();syncInputs();render()}
function setColor2(c){const cfg=activeConfig();if(!cfg||!/^#[0-9a-f]{6}$/i.test(c))return;snapshot();cfg.color2=c.toUpperCase();syncInputs();render()}
function setPattern(p){const cfg=activeConfig();if(!cfg)return;snapshot();state.pattern=p;cfg.pattern=p;syncInputs();render()}
function refreshSelection(){document.querySelectorAll('[data-zone]').forEach(e=>e.classList.toggle('active',e.dataset.zone===state.active));document.querySelectorAll('[data-pattern]').forEach(e=>e.classList.toggle('active',e.dataset.pattern===state.pattern));document.querySelectorAll('[data-model]').forEach(e=>e.classList.toggle('active',e.dataset.model===state.model))}
function syncInputs(){
  const cfg=activeConfig();
  document.querySelectorAll('#colorInput,#hexInput,#color2Input,#hex2Input,.swatch,.pattern').forEach(el=>el.disabled=!cfg);
  if(cfg){document.getElementById('colorInput').value=cfg.color;document.getElementById('hexInput').value=cfg.color;document.getElementById('color2Input').value=cfg.color2;document.getElementById('hex2Input').value=cfg.color2}
  document.getElementById('secondaryColorControls').classList.toggle('is-disabled',!cfg||cfg.pattern==='solid');
  refreshSelection();
}
function save(){localStorage.setItem('wetsuit-lab-state',JSON.stringify(state));if(document.getElementById('sharkDialog')?.open)updateSharkPreview()}
function bind(){
  document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{snapshot();state.model=b.dataset.model;state.active=null;state.pattern=null;syncInputs();render()});
  document.querySelectorAll('.zone-button').forEach(b=>b.onclick=()=>selectZone(b.dataset.zone));
  document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>setColor(b.dataset.color));
  document.querySelectorAll('.pattern').forEach(b=>b.onclick=()=>setPattern(b.dataset.pattern));
  document.getElementById('colorInput').oninput=e=>setColor(e.target.value);
  document.getElementById('hexInput').onchange=e=>setColor(e.target.value);
  document.getElementById('color2Input').oninput=e=>setColor2(e.target.value);
  document.getElementById('hex2Input').onchange=e=>setColor2(e.target.value);
  document.querySelectorAll('.preset').forEach(b=>b.onclick=()=>{snapshot();const p=presets[+b.dataset.preset];Object.keys(zoneNames).forEach((z,i)=>{state.zones[z].color=p[i];state.zones[z].pattern='solid'});Object.keys(state.referencePanels).filter(k=>k.startsWith(`${state.model}-`)).forEach(k=>delete state.referencePanels[k]);state.active=null;state.pattern=null;syncInputs();render()});
  document.getElementById('undoBtn').onclick=()=>{if(history.length){state=JSON.parse(history.pop());init()}};
  document.getElementById('randomBtn').onclick=()=>{snapshot();const targets=Object.entries(state.referencePanels).filter(([k])=>k.startsWith(`${state.model}-`)).map(([,v])=>v);targets.forEach(cfg=>{cfg.color=palette[Math.floor(Math.random()*palette.length)];cfg.color2=palette[Math.floor(Math.random()*palette.length)];cfg.pattern=['solid','solid','stripe','check','wave'][Math.floor(Math.random()*5)]});syncInputs();render()};
  document.getElementById('resetBtn').onclick=()=>{snapshot();Object.keys(defaultColors).forEach(z=>state.zones[z]={color:defaultColors[z],color2:'#111111',pattern:'solid'});state.referencePanels={};state.model='classic';state.active=null;state.pattern=null;init()};
  document.getElementById('exportBtn').onclick=exportPng;
}
function setupSharkView(){
  if(sharkPreviewBound)return;
  sharkPreviewBound=true;
  const dialog=document.getElementById('sharkDialog');
  document.getElementById('sharkViewBtn').onclick=()=>{dialog.showModal();updateSharkPreview()};
  document.getElementById('closeSharkView').onclick=()=>dialog.close();
  dialog.onclick=e=>{if(e.target===dialog)dialog.close()};
  ['sharkWater','sharkDepth','sharkDistance'].forEach(id=>document.getElementById(id).oninput=updateSharkPreview);
}
function updateSharkPreview(){
  const source=document.getElementById('suitSvg'),mount=document.getElementById('sharkSvgMount');
  if(!source||!mount)return;
  const water=document.getElementById('sharkWater').value;
  const depth=+document.getElementById('sharkDepth').value;
  const distance=+document.getElementById('sharkDistance').value;
  const profiles={clear:[.14,.65,.21],coastal:[.21,.69,.10],turbid:[.31,.62,.07],surf:[.20,.68,.12],low:[.10,.60,.30]};
  const names={clear:'CLEAR BLUE',coastal:'GREEN COASTAL',turbid:'TURBID / ESTUARY',surf:'SURF / BACKLIT',low:'LOW LIGHT'};
  const w=profiles[water],slope=Math.max(.42,1.12-depth*.012-distance*.012),intercept=(1-slope)/2;
  const viewWidth=source.viewBox.baseVal.width||820,blur=(distance-1)*viewWidth/2500*.75+depth*viewWidth/2500*.08;
  const clone=source.cloneNode(true);clone.removeAttribute('id');clone.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
  const ns='http://www.w3.org/2000/svg',defs=clone.querySelector('defs')||clone.insertBefore(document.createElementNS(ns,'defs'),clone.firstChild);
  const filter=document.createElementNS(ns,'filter');filter.id='shark-perception-filter';filter.setAttribute('x','-10%');filter.setAttribute('y','-10%');filter.setAttribute('width','120%');filter.setAttribute('height','120%');
  filter.innerHTML=`<feColorMatrix type="matrix" values="${w[0]} ${w[1]} ${w[2]} 0 0 ${w[0]} ${w[1]} ${w[2]} 0 0 ${w[0]} ${w[1]} ${w[2]} 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="linear" slope="${slope}" intercept="${intercept}"/><feFuncG type="linear" slope="${slope}" intercept="${intercept}"/><feFuncB type="linear" slope="${slope}" intercept="${intercept}"/></feComponentTransfer><feGaussianBlur stdDeviation="${blur.toFixed(2)}"/>`;
  defs.append(filter);
  const group=document.createElementNS(ns,'g');group.setAttribute('filter','url(#shark-perception-filter)');
  [...clone.children].filter(el=>el.tagName.toLowerCase()!=='defs').forEach(el=>group.append(el));clone.append(group);
  mount.replaceChildren(clone);
  document.getElementById('depthOutput').value=`${depth} M`;document.getElementById('distanceOutput').value=`${distance} M`;
  document.getElementById('sharkWaterLabel').textContent=`${names[water]} / ${depth} M / ${distance} M VIEW`;
  const canvas=document.getElementById('sharkCanvas');canvas.dataset.water=water;canvas.style.setProperty('--haze',Math.min(.48,.04+depth*.009+distance*.008).toFixed(2));
}
function exportPng(){const svg=document.getElementById('suitSvg');const clone=svg.cloneNode(true);clone.setAttribute('width','1640');clone.setAttribute('height','1440');const data=new XMLSerializer().serializeToString(clone);const blob=new Blob([data],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1640;canvas.height=1440;const ctx=canvas.getContext('2d');ctx.fillStyle='#f8f7f1';ctx.fillRect(0,0,1640,1440);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);const a=document.createElement('a');a.download=`wetsuit-lab-${state.model}.png`;a.href=canvas.toDataURL('image/png');a.click()};img.src=url}
init();
