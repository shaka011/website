/* ===== UGLC-SC — interactions (no framework) ===== */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var CFG=window.UGLCS_CFG||{email:'contact@uglcs.org',endpoint:''};
var SRC=(document.currentScript&&document.currentScript.src)||'';
var isFr=function(){return document.documentElement.lang==='fr'};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ---------- theme with wave ---------- */
window.toggleTheme=function(e){
  var dark=document.documentElement.getAttribute('data-theme')==='dark',next=dark?'light':'dark';
  var b=(e&&e.currentTarget)||$('.theme'),x=innerWidth-80,y=40;
  if(b){var r=b.getBoundingClientRect();x=r.left+r.width/2;y=r.top+r.height/2}
  document.documentElement.style.setProperty('--tx',x+'px');document.documentElement.style.setProperty('--ty',y+'px');
  function apply(){if(next==='dark')document.documentElement.setAttribute('data-theme','dark');else document.documentElement.removeAttribute('data-theme');try{localStorage.setItem('uglcs-theme',next)}catch(_){}}
  if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches)document.startViewTransition(apply);else apply();
};

/* ---------- menus (delegated so they survive page swaps) ---------- */
function closeMobile(){document.body.classList.remove('mopen');var b=$('.burger');if(b){b.classList.remove('on');b.setAttribute('aria-expanded','false')}}
function closeMega(){$$('.menu>li.open').forEach(function(li){li.classList.remove('open');var t=$('button',li);if(t)t.setAttribute('aria-expanded','false')})}
document.addEventListener('click',function(e){
  var t=e.target;
  var burger=t.closest('.burger');
  if(burger){var on=!document.body.classList.contains('mopen');document.body.classList.toggle('mopen',on);burger.classList.toggle('on',on);burger.setAttribute('aria-expanded',on);e.stopPropagation();return}
  /* tap anywhere outside the panel closes the mobile menu */
  if(document.body.classList.contains('mopen')&&!t.closest('.mpanel'))closeMobile();
  var mb=t.closest('.menu>li>button');
  if(mb){var li=mb.parentNode,was=li.classList.contains('open');closeMega();if(!was){li.classList.add('open');mb.setAttribute('aria-expanded','true')}return}
  if(!t.closest('.menu'))closeMega();
  var tt=t.closest('.toTop');if(tt)scrollTo({top:0,behavior:'smooth'});
  var tab=t.closest('.tabs button[data-tab]');if(tab)openTab(tab.getAttribute('data-tab'),true);
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeMobile();closeMega()}});
addEventListener('resize',function(){if(innerWidth>1080)closeMobile()});
addEventListener('scroll',function(){var h=$('header.site'),y=scrollY;if(h)h.classList.toggle('scrolled',y>10);var b=$('.toTop');if(b)b.classList.toggle('on',y>700)},{passive:true});

/* ---------- tabs ---------- */
function openTab(id,push){
  var p=$('#'+id);if(!p||!p.classList.contains('tp'))return;
  $$('.tp').forEach(function(x){x.classList.toggle('on',x===p)});
  $$('.tabs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-tab')===id)});
  if(push&&history.replaceState)history.replaceState(null,'','#'+id);
}
function initTabs(){var h=(location.hash||'').slice(1);if(h&&$('#'+h+'.tp'))openTab(h,false)}

/* ---------- reveal / counters / typewriter / lines ---------- */
function initReveal(){
  var els=$$('.rv:not(.in),.pline:not(.in),.sline:not(.in),.pf:not(.in)');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e)});
}
function initCount(){
  var els=$$('[data-count]:not(.done)');if(!els.length)return;
  function run(el){el.classList.add('done');var to=+el.getAttribute('data-count'),t0=null,dur=1400;
    function f(ts){t0=t0||ts;var p=Math.min((ts-t0)/dur,1),v=Math.floor((1-Math.pow(1-p,3))*to);el.textContent=(el.getAttribute('data-plain')?v:v.toLocaleString(isFr()?'fr-FR':'en-US'));if(p<1)requestAnimationFrame(f);else el.textContent=el.getAttribute('data-plain')?to:to.toLocaleString(isFr()?'fr-FR':'en-US')}requestAnimationFrame(f)}
  if(!('IntersectionObserver' in window)){els.forEach(run);return}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){run(x.target);io.unobserve(x.target)}})},{threshold:.5});
  els.forEach(function(e){io.observe(e)});
}
var twTimer;
function initTypewriter(){
  clearTimeout(twTimer);var el=$('.tw');if(!el)return;
  var words;try{words=JSON.parse(el.getAttribute('data-words'))}catch(_){return}
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=words[0];el.style.animation='none';return}
  var wi=0,ci=0,del=false;
  (function tick(){var w=words[wi];if(!del){ci++;el.textContent=w.slice(0,ci);if(ci===w.length){del=true;twTimer=setTimeout(tick,1500);return}}else{ci--;el.textContent=w.slice(0,ci);if(!ci){del=false;wi=(wi+1)%words.length}}twTimer=setTimeout(tick,del?32:70)})();
}
var lineCleanup=[];
function initLines(){
  lineCleanup.forEach(function(f){f()});lineCleanup=[];
  $$('svg.rl').forEach(function(svg){
    var host=svg.parentNode,ns='http://www.w3.org/2000/svg',big=host.classList.contains('hero'),data=[];
    function draw(){
      svg.innerHTML='';data=[];var w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;svg.setAttribute('viewBox','0 0 '+w+' '+h);
      var narrow=w<900,cx=big?(narrow?w*.5:w*.78):(narrow?w*.5:w*.86),cy=big?(narrow?h*.86:h*.5):(narrow?h*.88:h*.42),n=big?26:16;
      for(var i=0;i<n;i++){
        var a=i/n*Math.PI*2,len=(big?Math.min(w,h)*(narrow?.34:.5):Math.min(w,h)*.7)*(.55+.45*((i*7)%5)/4);
        var fx=cx+Math.cos(a)*len,fy=cy+Math.sin(a)*len,l=document.createElementNS(ns,'line');
        l.setAttribute('x1',cx);l.setAttribute('y1',cy);l.setAttribute('x2',cx);l.setAttribute('y2',cy);l.setAttribute('stroke','#D6B45C');l.setAttribute('stroke-width',big?1.3:1.1);
        l.style.opacity=0;l.style.transition='opacity 1.4s '+(i*.035)+'s, x2 1.6s cubic-bezier(.16,1,.3,1) '+(i*.035)+'s, y2 1.6s cubic-bezier(.16,1,.3,1) '+(i*.035)+'s';
        svg.appendChild(l);data.push({l:l,cx:cx,cy:cy,fx:fx,fy:fy,d:i*35});
        (function(o){requestAnimationFrame(function(){requestAnimationFrame(function(){o.l.setAttribute('x2',o.fx);o.l.setAttribute('y2',o.fy);o.l.style.opacity=big?.55:.45;setTimeout(function(){o.l.style.transition='opacity .4s,x2 .35s ease,y2 .35s ease'},1800+o.d)})})})(data[data.length-1]);
      }
    }
    draw();
    function mv(e){var r=host.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,th=big?170:130;data.forEach(function(o){var d=Math.hypot(o.fx-mx,o.fy-my),f=d<th?.28+.72*d/th:1;o.l.setAttribute('x2',o.cx+(o.fx-o.cx)*f);o.l.setAttribute('y2',o.cy+(o.fy-o.cy)*f)})}
    function lv(){data.forEach(function(o){o.l.setAttribute('x2',o.fx);o.l.setAttribute('y2',o.fy)})}
    var rz;function rs(){clearTimeout(rz);rz=setTimeout(draw,220)}
    host.addEventListener('mousemove',mv);host.addEventListener('mouseleave',lv);addEventListener('resize',rs);
    lineCleanup.push(function(){host.removeEventListener('mousemove',mv);host.removeEventListener('mouseleave',lv);removeEventListener('resize',rs)});
  });
}

/* ---------- 3D hero (desktop only, opt-in by connection) ---------- */
function init3D(){
  var c=$('canvas#hero3d');if(!c||c.getAttribute('data-started'))return;
  var conn=navigator.connection||{};
  if(innerWidth<901||conn.saveData||/2g/.test(conn.effectiveType||'')||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  try{var t=document.createElement('canvas');if(!(t.getContext('webgl')||t.getContext('experimental-webgl')))return}catch(_){return}
  c.setAttribute('data-started','1');
  var go=function(){import(SRC.replace(/site\.js.*$/,'hero3d.js')).then(function(m){m.start(c)}).catch(function(){c.remove()})};
  ('requestIdleCallback' in window)?requestIdleCallback(go,{timeout:2500}):setTimeout(go,900);
}

/* ---------- contact form -> e-mail ---------- */
function fieldOk(el){var v=(el.value||'').trim(),ok=!!v;if(ok&&el.type==='email')ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);if(ok&&el.type==='tel')ok=/^[+()\d\s.-]{7,}$/.test(v);var f=el.closest('.fld');if(f)f.classList.toggle('bad',!ok);el.classList.toggle('bad',!ok);return ok}
function focusFirstBad(scope){
  var bad=$('.bad input,.bad select,.bad textarea',scope||document)||$('.fld.bad',scope||document);
  if(!bad)return;
  var host=bad.closest('.fld')||bad;
  host.classList.remove('bad');void host.offsetWidth;host.classList.add('bad'); /* restart pulse animation even on repeated attempts */
  var y=host.getBoundingClientRect().top+scrollY-120;
  scrollTo({top:y,behavior:'smooth'});
  setTimeout(function(){ if(bad.focus) bad.focus({preventScroll:true}); if(bad.select) try{bad.select()}catch(_){} },350);
}
function initContact(){
  var f=$('#contact-form');if(!f||f._b)return;f._b=1;
  f.addEventListener('submit',function(e){
    e.preventDefault();var ok=true;$$('[required]',f).forEach(function(el){if(!fieldOk(el))ok=false});
    if(!ok){focusFirstBad(f);return}
    var d=new FormData(f),fr=isFr();
    var subj=(d.get('subject')||(fr?'Message depuis le site UGLC-SC':'Message from the UGLC-SC website'))+' — '+d.get('name');
    var body=(fr?'Nom : ':'Name: ')+d.get('name')+'\n'+'Email : '+d.get('email')+'\n\n'+d.get('message');
    var note=$('#contact-note');if(note){note.style.display='block'}
    location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
  });
  $$('[required]',f).forEach(function(el){el.addEventListener('blur',function(){fieldOk(el)})});
}

/* ---------- online application (honest: no fake "sent") ---------- */
function initApply(){
  var form=$('#apply-form');if(!form||form._b)return;form._b=1;
  if(CFG.endpoint){ var im=$('#apply-intro-manual'),ia=$('#apply-intro-auto'); if(im)im.style.display='none'; if(ia)ia.style.display='inline'; }
  var fr=isFr(),step=1,total=5,KEY='uglcs-apply-draft';
  var steps=$$('.fs',form),dots=$$('.st');
  try{var s=JSON.parse(localStorage.getItem(KEY)||'{}');Object.keys(s).forEach(function(k){var el=form.elements[k];if(!el||el.type==='file')return;if(el.type==='checkbox')el.checked=!!s[k];else el.value=s[k]})}catch(_){}
  function save(){try{var o={};$$('input,select,textarea',form).forEach(function(el){if(!el.name||el.type==='file')return;o[el.name]=el.type==='checkbox'?el.checked:el.value});localStorage.setItem(KEY,JSON.stringify(o))}catch(_){}}

  // File uploads: validate type/size, show filename, keep selections in memory (never persisted — files can't be saved to localStorage)
  var FILE_TYPES=['application/pdf','image/jpeg','image/png'],FILE_EXT=/\.(pdf|jpe?g|png)$/i,FILE_MAX=5*1024*1024;
  var fileState={};
  function fileFieldOk(input){
    var wrap=input.closest('.filefld'),nameEl=wrap&&$('.filename',wrap),f=input.files&&input.files[0];
    wrap.classList.remove('bad','ok');
    if(!f){ if(nameEl)nameEl.textContent=isFr()?'Aucun fichier choisi':'No file chosen'; delete fileState[input.name]; if(input.required){wrap.classList.add('bad');return false;} return true; }
    var okType=FILE_TYPES.indexOf(f.type)>-1||FILE_EXT.test(f.name), okSize=f.size<=FILE_MAX;
    if(!okType||!okSize){ wrap.classList.add('bad'); if(nameEl)nameEl.textContent=f.name; delete fileState[input.name]; return false; }
    wrap.classList.add('ok'); if(nameEl)nameEl.textContent=f.name+' · '+Math.round(f.size/1024)+' Ko';
    fileState[input.name]=f.name; return true;
  }
  $$('.filefld input[type=file]',form).forEach(function(inp){ inp.addEventListener('change',function(){ fileFieldOk(inp); }); });
  form.addEventListener('input',save);form.addEventListener('change',function(){save();syncDept()});
  function syncDept(){var fac=form.elements.faculty&&form.elements.faculty.value,dp=form.elements.dept;if(!dp)return;$$('option',dp).forEach(function(o){var g=o.getAttribute('data-f');o.hidden=!!g&&g!==fac;o.disabled=o.hidden});if(dp.selectedOptions[0]&&dp.selectedOptions[0].disabled){var first=$$('option',dp).filter(function(o){return !o.disabled})[0];if(first)dp.value=first.value}}
  syncDept();
  function show(n){step=n;steps.forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-s')===n)});dots.forEach(function(d,i){d.classList.toggle('on',i+1===n);d.classList.toggle('done',i+1<n)});var bar=$('.steps i');if(bar)bar.style.width=((n-1)/(total-1))*90+'%';if(n===total)recap();var top=$('.steps');if(top)scrollTo({top:top.getBoundingClientRect().top+scrollY-110,behavior:'smooth'})}
  function valid(n){
    var ok=true;
    $$('.fs[data-s="'+n+'"] [required]',form).forEach(function(el){ if(el.type==='file')return; if(!fieldOk(el))ok=false; });
    if(n===4){ $$('.fs[data-s="4"] input[type=file]',form).forEach(function(inp){ if(!fileFieldOk(inp))ok=false; }); }
    return ok;
  }
  form.addEventListener('click',function(e){
    var nx=e.target.closest('[data-next]'),pv=e.target.closest('[data-prev]');
    if(nx){ if(valid(step)){ if(step<total)show(step+1); } else { focusFirstBad($('.fs.on',form)); } }
    if(pv&&step>1)show(step-1);
  });
  function data(){var d=new FormData(form),o={};d.forEach(function(v,k){o[k]=v});return o}
  function lines(){var o=data(),L=[];var A=function(a,b,v){L.push((fr?a:b)+' : '+(v||'—'))};
    L.push('UGLC-SC — '+(fr?'DOSSIER DE CANDIDATURE':'APPLICATION FILE'));L.push((fr?'Préparé le ':'Prepared on ')+new Date().toLocaleString(fr?'fr-FR':'en-GB'));L.push('');
    L.push('['+(fr?'IDENTITÉ':'IDENTITY')+']');A('Nom','Last name',o.lastName);A('Prénom(s)','First name(s)',o.firstName);A('Date de naissance','Date of birth',o.dob);A('Lieu de naissance','Place of birth',o.pob);A('Sexe','Sex',o.sex);A('Nationalité','Nationality',o.nat);A('Email','Email',o.email);A('Téléphone','Phone',o.phone);A('Adresse','Address',o.address);L.push('');
    L.push('['+(fr?'PARCOURS':'BACKGROUND')+']');A('Baccalauréat / diplôme','Baccalaureate / diploma',o.diploma);A('Série / spécialité','Track',o.track);A('Année','Year',o.year);A('Établissement','Institution',o.school);A('Mention / moyenne','Grade / average',o.grade);L.push('');
    L.push('['+(fr?'CHOIX DE FORMATION':'PROGRAM CHOICE')+']');A('Faculté','Faculty',$('option[value="'+o.faculty+'"]',form)&&$('option[value="'+o.faculty+'"]',form).textContent);A('Département','Department',o.dept);A('Niveau','Level',o.level);A('Régime','Status',o.regime);A('Année académique','Academic year',o.acyear);L.push('');
    L.push((fr?'Motivation':'Motivation')+' :');L.push(o.motivation||'—');L.push('');
    var fnames=Object.keys(fileState).map(function(k){return fileState[k]});
    L.push('['+(fr?'PIÈCES JOINTES':'ATTACHMENTS')+']');
    L.push(fnames.length ? fnames.join(', ') : (fr?'Aucun fichier sélectionné — à joindre manuellement avant l’envoi.':'No file selected — attach manually before sending.'));
    return L.join('\n')}
  function recap(){var o=data(),el=$('#recap');if(!el)return;var fc=Object.keys(fileState).length;
    var r=[[fr?'Candidat':'Applicant',(o.firstName||'')+' '+(o.lastName||'')],['Email',o.email],[fr?'Téléphone':'Phone',o.phone],[fr?'Diplôme':'Diploma',o.diploma],[fr?'Département':'Department',o.dept],[fr?'Niveau':'Level',o.level],[fr?'Régime':'Status',o.regime],[fr?'Année':'Year',o.acyear],[fr?'Pièces jointes':'Attachments',fc+(fr?' fichier(s)':' file(s)')]];
    el.innerHTML=r.map(function(x){return '<dt>'+esc(x[0])+'</dt><dd>'+esc(x[1]||'—')+'</dd>'}).join('')}
  function file(){var b=new Blob([lines()],{type:'text/plain;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a'),o=data();a.href=u;a.download='candidature-UGLC-SC-'+((o.lastName||'dossier')+'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},500)}
  function mark(t,cls){var m=$('#apply-msg');if(!m)return;m.className='callout '+(cls||'');m.innerHTML=t;m.style.display='block'}
  form.addEventListener('submit',function(e){e.preventDefault();if(!valid(step)){focusFirstBad($('.fs.on',form));return}var pdf=$('#apply-print');
    if(CFG.endpoint){mark(fr?'Envoi en cours…':'Sending…');fetch(CFG.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data())}).then(function(r){if(!r.ok)throw 0;mark('<strong class="ok">'+(fr?'Candidature envoyée. Vous allez recevoir un e-mail de confirmation.':'Application submitted. You will receive a confirmation e-mail.')+'</strong>');try{localStorage.removeItem(KEY)}catch(_){}}).catch(function(){mark(fr?'L’envoi a échoué — utilisez le bouton « Envoyer par e-mail » ci-dessous.':'Sending failed — please use the “Send by e-mail” button below.')})}
    else mark('<strong>'+(fr?'Dossier prêt.':'File ready.')+'</strong> '+(fr?'Cliquez sur « Envoyer par e-mail » pour le transmettre au service des admissions, en y joignant les pièces ci-dessus.':'Click “Send by e-mail” to submit it to the admissions office, attaching the files above.'));
    $('#apply-actions').style.display='flex'});
  var mailBtn=$('#apply-mail'),dl=$('#apply-dl'),pr=$('#apply-print');
  if(mailBtn)mailBtn.addEventListener('click',function(){var o=data();location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent((fr?'Candidature — ':'Application — ')+(o.lastName||'')+' '+(o.firstName||''))+'&body='+encodeURIComponent(lines())});
  if(dl)dl.addEventListener('click',file);
  if(pr)pr.addEventListener('click',function(){var w=$('#print-sheet');if(w){w.textContent=lines();w.style.display='block'}print();if(w)setTimeout(function(){w.style.display='none'},400)});
  var clr=$('#apply-clear');if(clr)clr.addEventListener('click',function(){try{localStorage.removeItem(KEY)}catch(_){}form.reset();show(1)});
}

/* ---------- in-page navigation (fetch + swap, keeps real URLs for SEO) ---------- */
var busy=false;
function sameOrigin(a){return a.origin===location.origin&&/\.html?$|\/$/.test(a.pathname)}
function swap(html,url,push){
  var doc=new DOMParser().parseFromString(html,'text/html'),nb=doc.body;
  var shell=$('#shell'),ns=doc.getElementById('shell');if(!ns)throw 0;
  document.title=doc.title;document.documentElement.lang=doc.documentElement.lang;
  ['description'].forEach(function(n){var a=$('meta[name='+n+']'),b=doc.querySelector('meta[name='+n+']');if(a&&b)a.content=b.content});
  var can=$('link[rel=canonical]'),nc=doc.querySelector('link[rel=canonical]');if(can&&nc)can.href=nc.href;
  shell.innerHTML=ns.innerHTML;
  if(push)history.pushState({},'',url);
  closeMobile();afterSwap(url);
}
function afterSwap(url){
  var h=(url||location.href).split('#')[1];
  if(h&&document.getElementById(h)){var t=document.getElementById(h);if(t.classList.contains('tp'))openTab(h,false);setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:'start'})},60)}else scrollTo(0,0);
  initAll();
}
function go(u,push){
  if(busy)return;busy=true;document.body.classList.add('leaving');
  var to=setTimeout(function(){busy=false;location.href=u.href},4000);
  fetch(u.href,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){setTimeout(function(){try{swap(t,u.href,push)}catch(e){location.href=u.href;return}clearTimeout(to);document.body.classList.remove('leaving');busy=false},220)}).catch(function(){clearTimeout(to);location.href=u.href});
}
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||a.hasAttribute('data-hard'))return;
  var u;try{u=new URL(a.href,location.href)}catch(_){return}
  if(u.protocol==='file:'||!/^https?:$/.test(u.protocol)||!sameOrigin(u))return;
  if(u.pathname===location.pathname&&u.search===location.search){if(u.hash){var t=document.getElementById(u.hash.slice(1));if(t){e.preventDefault();if(t.classList.contains('tp'))openTab(t.id,true);else t.scrollIntoView({behavior:'smooth'});closeMobile()}}return}
  e.preventDefault();go(u,true);
});
addEventListener('popstate',function(){if(location.protocol==='file:')return;fetch(location.href).then(function(r){return r.text()}).then(function(t){swap(t,location.href,false)}).catch(function(){location.reload()})});

function initAll(){initLines();initTypewriter();initCount();initReveal();initTabs();initContact();initApply();init3D();var y=$('#yr');if(y)y.textContent=new Date().getFullYear()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
window.addEventListener('pageshow',function(e){if(e.persisted)document.body.classList.remove('leaving')});
})();
