const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
function closeMenu(){if(!menuButton)return;mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open menu':'Close menu');});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const video=document.querySelector('.hero-video');
const videoButton=document.getElementById('video-toggle');
if(video&&videoButton){
const updateVideo=()=>{videoButton.setAttribute('aria-label',video.paused?'Play background video':'Pause background video');videoButton.querySelector('.video-label').textContent=video.paused?'PLAY FILM':'PAUSE FILM';videoButton.firstElementChild.textContent=video.paused?'▷':'Ⅱ'};
if(matchMedia('(prefers-reduced-motion: reduce)').matches){video.pause();videoButton.hidden=true;}
video.addEventListener('play',updateVideo);video.addEventListener('pause',updateVideo);
videoButton.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>updateVideo());else video.pause()});updateVideo();
}
const header=document.querySelector('.site-header');
const page=document.body.dataset.page;
document.querySelectorAll('.desktop-nav [data-page]').forEach(a=>{const active=a.dataset.page===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page')});
function updateHeader(){header?.classList.toggle('scrolled',scrollY>40)}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const tabs=[...document.querySelectorAll('.department-tabs [role=tab]')];
function selectDepartment(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected})}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>selectDepartment(t));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectDepartment(tabs[next]);tabs[next].focus()}})});
const motionButton=document.querySelector('.motion-toggle');
let motionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const dispatch=document.createElement('div');dispatch.className='dispatch-terminal';dispatch.setAttribute('aria-hidden','true');
const dispatchStream=document.createElement('div');dispatchStream.className='dispatch-stream';dispatch.append(dispatchStream);document.body.prepend(dispatch);
const dispatchAgencies=['NYPD','NYPD','NYPD','FDNY','PAPD','NYSP'];
const dispatchUnits={NYPD:['3A12','5B14','7D32','9A21','14C06','20A18'],FDNY:['E274','L113','B07','R1','E65','L4'],PAPD:['P12','P37','K9-1','P24','ESU3'],NYSP:['T1-09','T3-21','T3-55','T2-17','T4-08']};
const dispatchCodes=['10-50','10-52','10-54','10-60','10-66','10-70','10-71','10-75','10-85','10-92','10-31','10-47'];
const dispatchCalls=['MV ACCIDENT','AIDED CASE','TRAFFIC STOP','ALARM ACTIVATION','DISPUTE','PERSON DOWN','STRUCTURE FIRE','UNATTENDED PACKAGE','ROAD HAZARD','SUSPICIOUS PERSON','EMS ASSIST','TRAFFIC DETAIL'];
const dispatchPlaces=['W 42 ST / 8 AV · MANHATTAN','125 ST / LEXINGTON AV · MANHATTAN','ATLANTIC AV / FLATBUSH AV · BROOKLYN','QUEENS BLVD / 71 AV · QUEENS','PORT AUTHORITY BUS TERMINAL · MIDTOWN','FDR DR SB / E 61 ST · MANHATTAN','GRAND CONCOURSE / E 161 ST · BRONX','BQE WB / ATLANTIC AV · BROOKLYN','VAN WYCK EXPY / JFK ACCESS RD · QUEENS','PENN STATION · MANHATTAN','HARLEM RIVER DR · MANHATTAN','I-87 NB MM 12.4 · BRONX'];
const dispatchStatus=['DISPATCH','ENROUTE','ON SCENE','AVAILABLE','HOLD','CLEAR'];
let dispatchIndex=4821,dispatchTimer=0,dispatchSequence=0;
// Decorative samples only: never a connection to an actual dispatch feed.
const dispatchHistory=[];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function dispatchTime(offset=0){const d=new Date(Date.now()+offset);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0')+'.'+String(d.getMilliseconds()).padStart(3,'0')}
function addDispatchLine(force=false,offset=0){
 if(motionPaused&&!force)return;
 const kind=dispatchSequence++%6;
 let record;
 if(kind===0||kind===3||!dispatchHistory.length){
  const agency=pick(dispatchAgencies);
  record={agency,unit:pick(dispatchUnits[agency]),code:pick(dispatchCodes),call:pick(dispatchCalls),place:pick(dispatchPlaces),inc:'26-'+String(dispatchIndex++).padStart(6,'0')};
  dispatchHistory.push(record);if(dispatchHistory.length>8)dispatchHistory.shift();
 }else{record=dispatchHistory[dispatchHistory.length-1]}
 const line=document.createElement('div');
 const type=['incident','ack','status','incident','location','clear'][kind];
 line.className='dispatch-line cad-kind-'+type;
 line.style.setProperty('--cad-inset',Math.floor(Math.random()*30)+'px');
 const add=(text,cls='')=>{const span=document.createElement('span');span.className=cls;span.textContent=text;line.append(span)};
 add(dispatchTime(offset),'cad-time');
 if(type==='ack'){
  add(record.unit,'cad-unit');add('ACKNOWLEDGED','cad-status');
 }else if(type==='status'){
  add(record.agency,'cad-agency');add(record.unit,'cad-unit');add('ENROUTE','cad-status');add('INC '+record.inc,'cad-inc');
 }else if(type==='location'){
  add(record.unit,'cad-unit');add('ON SCENE','cad-status');add(record.place,'cad-location');
 }else if(type==='clear'){
  add(record.agency,'cad-agency');add(record.unit,'cad-unit');add('CLEAR / AVAILABLE','cad-status');
 }else{
  add('INC '+record.inc,'cad-inc');add(record.agency,'cad-agency');add(record.unit,'cad-unit');add(record.code,'cad-code');add(record.call,'cad-call');add(record.place,'cad-location');
 }
 dispatchStream.querySelector('.cad-latest')?.classList.remove('cad-latest');
 line.classList.add('cad-latest');dispatchStream.append(line);
 requestAnimationFrame(()=>line.classList.add('visible'));
 while(dispatchStream.children.length>100)dispatchStream.firstElementChild.remove();
}
function scheduleDispatch(){if(motionPaused||document.hidden){dispatchTimer=0;return}const burst=Math.random()<.24?3+Math.floor(Math.random()*3):1+Math.floor(Math.random()*2);let sent=0;const emit=()=>{if(motionPaused||document.hidden){dispatchTimer=0;return}addDispatchLine();sent++;if(sent<burst){dispatchTimer=setTimeout(emit,70+Math.random()*180)}else{const pause=Math.random()<.18?1500+Math.random()*2200:260+Math.random()*900;dispatchTimer=setTimeout(scheduleDispatch,pause)}};emit()}
function startAmbient(){if(dispatchTimer||motionPaused||document.hidden)return;scheduleDispatch()}
function stopAmbient(){clearTimeout(dispatchTimer);dispatchTimer=0}

motionButton?.addEventListener('click',()=>{motionPaused=!motionPaused;document.body.classList.toggle('motion-paused',motionPaused);motionButton.setAttribute('aria-label',motionPaused?'Play moving effects':'Pause moving effects');motionButton.textContent=motionPaused?'▷':'Ⅱ';motionPaused?stopAmbient():startAmbient()});
document.addEventListener('visibilitychange',()=>{document.hidden?stopAmbient():startAmbient()});startAmbient();
// Stop background video offscreen without overriding an intentional pause.
let manualVideoPause=false;
if(video){videoButton?.addEventListener('click',()=>{manualVideoPause=video.paused});new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.pause();else if(!manualVideoPause&&!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{})},{threshold:.05}).observe(video)}
const conceptMark=document.createElement('div');conceptMark.className='concept-watermark';conceptMark.textContent='CONCEPTUAL DESIGN';conceptMark.setAttribute('aria-hidden','true');document.body.append(conceptMark);

// A branded loading interlude, without the old red scan/wipe.
const pageLoader=document.createElement('div');
pageLoader.className='page-loader';
pageLoader.setAttribute('role','status');
pageLoader.setAttribute('aria-live','polite');
pageLoader.setAttribute('aria-hidden','true');
pageLoader.innerHTML='<div class="loader-lockup"><div class="loader-orbit"><img src="assets/logo.webp" width="116" height="132" alt="NYRP"></div><span class="loader-label">LOADING<span class="loader-dots" aria-hidden="true">...</span></span></div>';
document.body.append(pageLoader);
const reduceRouteMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let routePending=false,loaderTimer=0,loaderFallback=0;
function showPageLoader(){clearTimeout(loaderTimer);pageLoader.classList.add('is-active');pageLoader.setAttribute('aria-hidden','false')}
function hidePageLoader(){pageLoader.classList.remove('is-active');pageLoader.setAttribute('aria-hidden','true');document.body.classList.add('page-ready');routePending=false;clearTimeout(loaderFallback)}
let arriving=false;
try{arriving=sessionStorage.getItem('nyrp-route-loading')==='1';sessionStorage.removeItem('nyrp-route-loading')}catch{}
if(arriving){
 showPageLoader();
 const logo=pageLoader.querySelector('img');
 const logoReady=logo.decode?logo.decode().catch(()=>{}):Promise.resolve();
 Promise.all([logoReady,document.fonts.ready]).then(()=>{loaderTimer=setTimeout(hidePageLoader,reduceRouteMotion?0:320)});
 loaderFallback=setTimeout(hidePageLoader,1800);
}else{requestAnimationFrame(()=>document.body.classList.add('page-ready'))}
document.addEventListener('click',e=>{
 if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const a=e.target.closest('a[href]');
 if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
 const raw=a.getAttribute('href');
 if(!raw||raw.startsWith('#')||raw.startsWith('fivem:')||raw.startsWith('mailto:')||raw.startsWith('tel:'))return;
 let u;try{u=new URL(a.href,location.href)}catch{return}
 if(u.origin!==location.origin||!u.pathname.endsWith('.html'))return;
 if(u.pathname===location.pathname&&u.search===location.search)return;
 e.preventDefault();if(routePending)return;routePending=true;
 try{sessionStorage.setItem('nyrp-route-loading','1')}catch{}
 showPageLoader();
 setTimeout(()=>{location.assign(u.href)},reduceRouteMotion?0:220);
 loaderFallback=setTimeout(hidePageLoader,6000);
});
window.addEventListener('pageshow',e=>{if(e.persisted)hidePageLoader()});


/* Seamless marquee: keep enough identical groups mounted to cover the viewport at every frame. */
const marqueeTrack=document.querySelector('.agency-marquee .marquee-track');
function rebuildMarquee(){
  if(!marqueeTrack)return;
  const groups=[...marqueeTrack.querySelectorAll('.marquee-group')];
  if(!groups.length)return;
  const template=groups[0].cloneNode(true);
  groups.slice(1).forEach(g=>g.remove());
  marqueeTrack.append(template.cloneNode(true));
  const groupWidth=marqueeTrack.querySelector('.marquee-group').getBoundingClientRect().width;
  if(!groupWidth)return;
  const needed=Math.max(3,Math.ceil(innerWidth/groupWidth)+2);
  while(marqueeTrack.children.length<needed)marqueeTrack.append(template.cloneNode(true));
  marqueeTrack.style.setProperty('--marquee-shift',groupWidth+'px');
}
rebuildMarquee();
addEventListener('load',rebuildMarquee,{once:true});
let marqueeResizeTimer=0;
addEventListener('resize',()=>{clearTimeout(marqueeResizeTimer);marqueeResizeTimer=setTimeout(rebuildMarquee,120)},{passive:true});


/* Subtle CAD active-line pulse. */
let cadPulseTimer=0,cadPulseClearTimer=0;
function stopCadPulse(){
  clearTimeout(cadPulseTimer);clearTimeout(cadPulseClearTimer);
  cadPulseTimer=0;cadPulseClearTimer=0;
  dispatchStream.querySelectorAll('.cad-active').forEach(el=>el.classList.remove('cad-active'));
}
function scheduleCadPulse(first=false){
  if(motionPaused||document.hidden){cadPulseTimer=0;return}
  const delay=first?1400+Math.random()*1200:4200+Math.random()*5200;
  cadPulseTimer=setTimeout(()=>{
    cadPulseTimer=0;
    const lines=[...dispatchStream.querySelectorAll('.dispatch-line.visible')];
    if(lines.length){
      dispatchStream.querySelectorAll('.cad-active').forEach(el=>el.classList.remove('cad-active'));
      const pool=lines.slice(Math.max(0,lines.length-14));
      const line=pool[Math.floor(Math.random()*pool.length)];
      line.classList.add('cad-active');
      cadPulseClearTimer=setTimeout(()=>line.classList.remove('cad-active'),1600+Math.random()*900);
    }
    scheduleCadPulse(false);
  },delay);
}
scheduleCadPulse(true);
motionButton?.addEventListener('click',()=>{motionPaused?stopCadPulse():scheduleCadPulse(true)});
document.addEventListener('visibilitychange',()=>{document.hidden?stopCadPulse():scheduleCadPulse(true)});
/* Subtle staged entrances; content stays visible without JavaScript. */
const revealTargets=document.querySelectorAll('.feature,.route-cards>a,.gallery-editorial>a,.section-top,.footer-identity,.footer-links');
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;revealObserver.unobserve(entry.target);if(motionPaused)return;entry.target.animate([{opacity:.45,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)',fill:'none'})})},{threshold:.13});
 revealTargets.forEach(el=>revealObserver.observe(el));
}
