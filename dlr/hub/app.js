const CDN='https://cdn.jsdelivr.net/gh/HelonUniverse/hub@5233d2791d1133947b96ff4ddc152df009199a4d/dlr/tiles/';
const API='https://app.desdelared.net';
const A=[
{id:'maestros',g:'oraculos',n:'Oráculo de los Maestros',u:API+'/api/a/maestros'},
{id:'cristales',g:'oraculos',n:'Cristales',u:API+'/api/a/cristales'},
{id:'runas',g:'oraculos',n:'Runas',u:API+'/api/a/runas'},
{id:'codigos',g:'oraculos',n:'Códigos Sagrados',u:API+'/api/a/codigos'},
{id:'pinaculo',g:'oraculos',n:'Pináculo',u:API+'/api/a/pinaculo'},
{id:'tarot',g:'oraculos',n:'Tarot',u:API+'/api/a/tarot',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@186bfd9fca4ac346c7c92e3933c4306a82ff0461/dlr/tiles/tarot.webp'},
{id:'angeles',g:'oraculos',n:'Números angelicales',u:API+'/api/a/angeles/__dlr/angeles.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/angeles.webp'},
{id:'luna',g:'oraculos',n:'Luna del día',u:API+'/api/a/luna/__dlr/luna.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/luna.webp'},
{id:'sino',g:'oraculos',n:'Tarot de sí o no',u:API+'/api/a/sino/__dlr/sino.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/sino.webp'},
{id:'astral',g:'oraculos',n:'Carta astral',u:API+'/api/a/astral/__dlr/astral.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/astral.webp'},
{id:'semana',g:'oraculos',n:'Carta del día',u:API+'/api/a/semana/__dlr/semana.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/semana.webp'},
{id:'respira',g:'oraculos',n:'Respira conmigo',u:API+'/api/a/respira/__dlr/respira.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/respira.webp'},
{id:'afirmacion',g:'oraculos',n:'Afirmación del día',u:API+'/api/a/afirmacion/__dlr/afirmacion.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c5a36e7c83a867b82e22b92569fd942a1e1372be/dlr/tiles/afirmacion.webp'},
{id:'dones',g:'estudio',n:'Despierta tus dones',u:API+'/api/a/dones'},
{id:'dharma',g:'estudio',n:'Camino del Dharma',u:API+'/api/a/dharma'},
{id:'biodec',g:'estudio',n:'Biodecodificación',u:API+'/api/a/biodec',img:CDN+'interior.webp'},
{id:'musica',g:'estudio',n:'Música',d:'Álbumes para conectar contigo',tab:'musica',wide:1,img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@84c5533e88f7bd244db79121a8a9f7400cd8c58d/dlr/tiles/musica.webp'}];
const SB=supabase.createClient('https://xjmgtzlezsmpxfnyjrli.supabase.co','sb_publishable_kp75fFYItrQgpr47V5xpMQ_l-_AzCSz');
let USER=null;const D={notes:[],saved:[],fav:{}};
const $=i=>document.getElementById(i);
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800)}

function tile(a){const b=document.createElement('button');b.className='tile'+(a.wide?' wide':'');b.innerHTML='<span class="art"></span><span class="sh"></span><span class="t"></span><span class="ar">→</span>';b.querySelector('.art').style.setProperty('--i','url('+(a.img||CDN+a.id+'.webp')+')');if(a.wide){const d=document.createElement('span');d.className='d';d.textContent=a.d;b.append(d)}b.querySelector('.t').textContent=a.n;b.onclick=()=>a.tab?show(a.tab):openApp(a.id);return b}
const GR=[['Hoy para ti','Un momento rápido para empezar bien',['afirmacion','luna','respira'],1],['Pregúntale a las cartas','Cuando necesitas una respuesta',['tarot','sino','semana']],['Conócete','Tu mapa, tus números, tu código',['astral','angeles','codigos','pinaculo']],['Guías y energía','Mensajes, piedras y símbolos',['maestros','cristales','runas']],['Aprende','Estudio a tu ritmo',['dones','dharma','biodec']],['Escucha','Música para conectar',['musica']]];
GR.forEach(([t,sub,ids,big])=>{const w=document.createElement('div');w.className='grp';const h=document.createElement('div');h.className='gh';h.innerHTML='<b></b><small></small>';h.querySelector('b').textContent=t;h.querySelector('small').textContent=sub;const g=document.createElement('div');g.className='tiles'+(big?' feat':'');g.append(...ids.map(i=>A.find(a=>a.id===i)).filter(Boolean).map(tile));w.append(h,g);$('tiles').append(w)});
['oraculos','estudio'].forEach(g=>$('g-'+g).append(...A.filter(a=>a.g===g).map(tile)));

const tabs=[...document.querySelectorAll('nav [data-t]')];let cur='inicio';
function show(t){closeApp();if(!$('s-'+t))t='inicio';cur=t;document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!=='s-'+t);tabs.forEach(b=>b.classList.toggle('on',b.dataset.t===t));history.replaceState(null,'','#'+t);scrollTo(0,0);if(t==='yo')renderYo()}
function ovDones(doc){if(doc.getElementById('dlr-ov'))return;const IM='https://cdn.jsdelivr.net/gh/HelonUniverse/hub@fe6a7d636dd7593fca607f3a90ad09af6f3ca6f7/dlr/dones/';
const st=doc.createElement('style');st.id='dlr-ov';st.textContent='section.hero{position:relative;background:linear-gradient(180deg,rgba(7,14,50,.15) 0%,rgba(7,14,50,.55) 55%,rgba(7,14,50,.92) 100%),url('+IM+'dones-header.webp) center 30%/cover no-repeat!important;border-radius:22px;min-height:340px;box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 0 1px rgba(190,170,255,.35)}.dlr-ban{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:center 40%;border-radius:18px;border:1px solid rgba(234,203,136,.5);box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 30px rgba(140,110,255,.35);margin:0 0 14px}';
doc.head.append(st);
const fix=()=>{const s=doc.getElementById('lessonStep');if(!s)return;const m=/Ense[ñn]anza\s+(\d)/i.exec(s.textContent||'');const p=s.closest('.panel');if(!p)return;let im=p.querySelector('.dlr-ban');const n=m?+m[1]:0;const src=n===1?'dones-leccion1.webp':n===2?'dones-leccion2.webp':n===3?'dones-leccion3.webp':'';if(!src){if(im)im.remove();return}if(!im){im=doc.createElement('img');im.className='dlr-ban';im.alt='';p.prepend(im)}const u=IM+src;if(im.getAttribute('src')!==u)im.src=u};
new MutationObserver(fix).observe(doc.body,{childList:true,subtree:true,characterData:true});fix()}
function ovDharma(doc){if(doc.getElementById('dlr-ov'))return;const st=doc.createElement('style');st.id='dlr-ov';st.textContent='section.hero{position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(8,12,40,.15) 0%,rgba(8,12,40,.55) 55%,rgba(8,12,40,.92) 100%),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@5c043da3db0086ffa109d7050a8cde85eecff8e6/dlr/dharma/header.webp) 70% 20%/cover!important;min-height:300px;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid rgba(190,170,255,.45)!important;border-radius:24px;box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 40px rgba(140,110,255,.25)}section.hero h1{text-shadow:0 0 28px rgba(150,120,255,.6)}.pill{background:rgba(234,203,136,.12)!important;border:1px solid rgba(234,203,136,.5)!important;color:#f3e2b8!important}article.card{background:radial-gradient(circle at 90% 0%,rgba(150,120,255,.3),transparent 60%),linear-gradient(165deg,rgba(35,50,140,.7),rgba(8,20,60,.95))!important;border:1px solid rgba(190,170,255,.4)!important;border-radius:20px;box-shadow:0 10px 26px rgba(0,0,0,.45)}article.card .num{color:#eacb88!important;letter-spacing:.2em}article.card h3,#lesson h2,#lesson h3{font-family:\'Instrument Serif\',Georgia,serif;font-weight:400}article.card h3{font-size:24px;color:#fff}.panel{background:radial-gradient(ellipse at 50% 0%,rgba(140,110,255,.22),transparent 62%),linear-gradient(160deg,rgba(21,60,120,.55),rgba(8,24,60,.88))!important;border:1px solid rgba(190,170,255,.4)!important}.button{background:linear-gradient(135deg,#f6e3ae,#d9b45f)!important;color:#1a1230!important;border:0!important;box-shadow:0 6px 22px rgba(234,203,136,.35)}#lesson{border-radius:24px;border:1px solid rgba(234,203,136,.4);padding-top:min(52vw,300px)!important;background:linear-gradient(180deg,rgba(8,12,40,0) 0,rgba(8,20,70,.25) 38%,rgba(8,20,70,.9) 64%),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@5c043da3db0086ffa109d7050a8cde85eecff8e6/dlr/dharma/fondo.webp) top center/100% auto no-repeat,#08143c!important;box-shadow:0 14px 40px rgba(0,0,0,.5)}#refl{min-height:420px;display:flex;flex-direction:column;justify-content:space-between;border-radius:24px;border:1px solid rgba(234,203,136,.4)!important;background:linear-gradient(180deg,rgba(8,20,70,.9) 0,rgba(8,20,70,.55) 32%,rgba(8,20,70,.1) 60%,rgba(8,20,70,.55) 100%),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@f71c19214985fe617b6605a7ef8b9adc7011159e/dlr/dharma/camino.webp) center 40%/cover!important}#refl .button{align-self:flex-start}#lesson .option{background:rgba(30,40,120,.6)!important;border:1px solid rgba(190,170,255,.4)!important}';doc.head.append(st);const q=[...doc.querySelectorAll('.card.panel')].find(e=>/reflexi/i.test(e.innerText));if(q)q.id='refl'}
function ovCrist(doc){if(doc.getElementById('dlr-ov'))return;const st=doc.createElement('style');st.id='dlr-ov';st.textContent='.home-heading{background:linear-gradient(180deg,rgba(7,14,50,.1) 0%,rgba(7,14,50,.55) 55%,rgba(7,14,50,.92) 100%),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@6281c37097dded0e5e4040d6dd9c7d38729924de/dlr/cristales/header.webp) center/cover no-repeat;border-radius:22px;padding:90px 20px 26px!important;box-shadow:0 14px 40px rgba(0,0,0,.5),0 0 0 1px rgba(190,170,255,.35);text-align:center}.photo-pending{background:linear-gradient(180deg,transparent 55%,rgba(6,10,40,.85)),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@f687975534766b6435fc63ead3aae0c01f8b527c/dlr/cristales/ficha.webp) center/cover no-repeat!important;color:#e9defc!important;display:flex!important;align-items:flex-end;justify-content:center;padding-bottom:8px;font-size:11px;letter-spacing:.08em}.path-oraculo{background:linear-gradient(90deg,rgba(6,12,44,.97) 0%,rgba(6,12,44,.7) 45%,rgba(6,12,44,0) 75%),url(https://cdn.jsdelivr.net/gh/HelonUniverse/hub@f687975534766b6435fc63ead3aae0c01f8b527c/dlr/cristales/mandala.webp) right center/auto 220% no-repeat!important}.path-oraculo .path-art{display:none!important}';doc.head.append(st)}
let SY=0;function backHere(){const y=SY;closeApp();requestAnimationFrame(()=>scrollTo(0,y))}
function openApp(id){const a=A.find(x=>x.id===id);if(!a||!a.u)return;if(!$('viewer').classList.contains('open'))SY=scrollY;$('vname').textContent=a.n;$('load').style.display='grid';$('frame').onload=()=>{$('load').style.display='none';try{if(id==='dones')ovDones($('frame').contentDocument);if(id==='cristales')ovCrist($('frame').contentDocument);if(id==='dharma')ovDharma($('frame').contentDocument)}catch(e){}};$('frame').src=a.u;$('viewer').classList.add('open');history.pushState({app:id},'','#app-'+id)}
function closeApp(){if($('viewer').classList.contains('open')){$('viewer').classList.remove('open');$('frame').removeAttribute('src')}}
tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));$('back').onclick=()=>{if(history.state&&history.state.app)history.back();else backHere()};
addEventListener('popstate',()=>{const h=location.hash.slice(1);if(h.startsWith('app-'))openApp(h.slice(4));else if($('viewer').classList.contains('open')&&(!h||h===cur))backHere();else show(h||cur)});

const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const now=new Date(),hh=now.getHours();
$('hello').textContent=hh<12?'Buenos días':hh<19?'Buenas tardes':'Buenas noches';
$('date').textContent=DIAS[now.getDay()]+' '+now.getDate()+' de '+MESES[now.getMonth()];
let CARDS=[],today=null;window.__t=()=>today;const dkey=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
Promise.resolve(CARDS_DATA).then(c=>{CARDS=c;let seed=0;for(const ch of dkey)seed=(seed*31+ch.charCodeAt(0))>>>0;today=CARDS[seed%CARDS.length];
$('msgc').style.backgroundImage='url('+API+'/api/a/maestros/cards/'+today.i+'.webp)';$('msgn').textContent=today.n;$('msgv').textContent=today.v;$('msgs').textContent=today.s;{const k=document.querySelector('#msg .k');if(k)k.textContent='Mensaje del día · por Natalia'}updSave()}).catch(()=>{$('msgn').textContent='Tu mensaje te espera';$('msgs').textContent='Abre el Oráculo de los Maestros.'});
$('msg').onclick=()=>{if(NAT)return abrirNatalia();if(!today)return openApp('maestros');const m=document.createElement('div');m.className='ob on';m.style.justifyContent='flex-start';m.style.paddingTop='calc(30px + env(safe-area-inset-top))';
const card=document.createElement('div');card.className='msg';card.style.cssText='display:block;width:auto;max-width:360px;margin-top:14px;text-align:center;cursor:default;padding-bottom:16px';
card.innerHTML='<div class="eb">MENSAJE DEL DÍA</div><div class="c" style="margin:12px auto;width:140px;transform:none"></div><div class="n" style="font-size:28px"></div><div class="v"></div><p class="s" style="font-size:15px;line-height:1.55;margin:8px 0 0"></p>';
card.querySelector('.c').style.backgroundImage='url('+API+'/api/a/maestros/cards/'+today.i+'.webp)';card.querySelector('.n').textContent=today.n;card.querySelector('.v').textContent=today.v;card.querySelector('.s').textContent=today.m;
const q=document.createElement('p');q.className='lead';q.style.cssText='margin-top:14px;font-style:italic';q.textContent='“'+today.s+'”';
const bt=document.createElement('button');bt.className='btn';bt.style.marginTop='18px';bt.textContent='Cerrar';bt.onclick=()=>m.remove();
m.append(card,q,bt);document.body.append(m)};
function updSave(){const s=D.saved;const on=today&&s.some(x=>x.d===dkey);$('save-msg').textContent=(on?'♥ Guardado':'♡ Guardar mensaje');$('save-msg').classList.toggle('on',!!on)}
$('save-msg').onclick=async()=>{const today=NAT?{i:0,n:NAT.titulo||'Mensaje de Natalia',v:'Natalia',s:NAT.texto.slice(0,120),m:NAT.texto}:window.__t();if(!today||!USER)return;if(D.saved.some(x=>x.d===dkey)){D.saved=D.saved.filter(x=>x.d!==dkey);updSave();toast('Quitado de tus guardados');await SB.from('guardados').delete().eq('usuario',USER.id).eq('dia',dkey)}else{D.saved.unshift({d:dkey,i:today.i,n:today.n,v:today.v,s:today.s,m:today.m});updSave();toast('Guardado en Mi espacio');await SB.from('guardados').upsert({usuario:USER.id,dia:dkey,carta:today.i,nombre:today.n,virtud:today.v,frase:today.s,mensaje:today.m},{onConflict:'usuario,dia'})}};
function openAlb(on){$('albs').hidden=on;$('albv').hidden=!on;scrollTo(0,0)}$('alb-mantras').onclick=()=>openAlb(true);$('albback').onclick=()=>openAlb(false);$('go-music').onclick=()=>{show('musica');openAlb(true);if(!playing)toggle()};

const AU='https://raw.githubusercontent.com/HelonUniverse/hub/3682399b9f8ac2f825fd36f7d229a1dc1523d96d/dlr/audio/';
const T=[
{f:'kodoish-pulso-sagrado-desde-la-red',n:'Kodoish',d:'Pulso Sagrado · 3:40',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/kodoish.webp',pos:'center 45%'},
{f:'waheguru-pulso-de-luz',n:'Waheguru',d:'Pulso de Luz · 3:33',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/waheguru.webp'},
{f:'gayatri-mantra-pulso-de-luz',n:'Gayatri Mantra',d:'Pulso de Luz · 3:32',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/gayatri.webp',pos:'center 24%'},
{f:'om-namah-shivaya-pulso-de-serenidad',n:'Om Namah Shivaya',d:'Pulso de Serenidad · 3:11',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/shivaya.webp',pos:'center 26%'},
{f:'om-gam-ganapataye-namaha-pulso-de-apertura',n:'Om Gam Ganapataye Namaha',d:'Pulso de Apertura · 3:14',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/ganapati.webp',pos:'center 22%'},
{f:'om-hanumate-namaha-pulso-de-valenti-a',n:'Om Hanumate Namaha',d:'Pulso de Valentía · 3:33',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/hanuman.webp',pos:'center 2%'},
{f:'hare-krishna-pulso-de-devocio-n',n:'Hare Krishna',d:'Pulso de Devoción · 3:46',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/krishna.webp',pos:'center 8%'},
{f:'om-tare-tuttare-ture-soha-desde-la-red',n:'Om Tare Tuttare Ture Soha',d:'Desde la Red · 3:10',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/tara.webp',pos:'center 8%'},
{f:'om-namo-bhagavate-vasudevaya-desde-la-red',n:'Om Namo Bhagavate Vasudevaya',d:'Desde la Red · 3:34',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/vasudeva.webp',pos:'center 8%'},
{f:'om-namo-narayanaya-desde-la-red',n:'Om Namo Narayanaya',d:'Desde la Red · 3:33',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/narayana.webp',pos:'center 30%'},
{f:'nombres-sagrados-pulso-celestial-desde-la-red',n:'Nombres Sagrados',d:'Pulso Celestial · 5:50',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@a7df994115639bdcea1857bbe9837b02d65eb648/dlr/tiles/nombres.webp',pos:'center 40%'}];
let fav=D.fav,ti=-1,shuf=false,playing=false;const AUD=new Audio();AUD.preload='none';
function row(t,i){const d=document.createElement('div');d.className='tr';d.innerHTML='<span class="p">▶</span><b><span></span><small></small></b><button class="h" aria-label="Favorito">♡</button>';if(t.img){d.classList.add('im');d.style.setProperty('--im','url('+t.img+')');if(t.pos)d.style.setProperty('--pos',t.pos)}d.querySelector('b span').textContent=t.n;d.querySelector('small').textContent=t.d;const h=d.querySelector('.h');const paint=()=>{h.textContent=fav[t.f]?'♥':'♡';h.classList.toggle('on',!!fav[t.f])};paint();
h.onclick=async e=>{e.stopPropagation();fav[t.f]=!fav[t.f];paint();toast(fav[t.f]?'Agregado a favoritos':'Quitado de favoritos');if(cur==='yo')renderYo();if(!USER)return;if(fav[t.f])await SB.from('favoritos').upsert({usuario:USER.id,pista:t.f});else await SB.from('favoritos').delete().eq('usuario',USER.id).eq('pista',t.f)};d.onclick=()=>playAt(i);return d}
T.forEach((t,i)=>$('list').append(row(t,i)));
function setPlaying(p){playing=p;$('mp').textContent=p?'❚❚':'▶';$('play').textContent=p?'❚❚':'▶';mark()}
AUD.onplay=()=>setPlaying(true);AUD.onpause=()=>setPlaying(false);AUD.onended=next;AUD.onerror=()=>{if(ti>=0)toast('No se pudo cargar el audio')};
function mark(){document.querySelectorAll('.tr').forEach(d=>{d.classList.toggle('on',ti>=0&&d.dataset.f===T[ti].f);d.querySelector('.p').textContent=(ti>=0&&d.dataset.f===T[ti].f&&playing)?'❚❚':'▶'})}
function playAt(i){ti=i;const t=T[i];$('thumb').style.backgroundImage=t.img?'url('+t.img+')':'';$('mini').classList.add('on');$('mt').textContent=t.n;AUD.src=AU+t.f+'.mp3';AUD.play().catch(()=>{});mark();
if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:t.n,artist:'Desde la Red',album:'Pulsos de Luz',artwork:[{src:t.img||'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@8cfad65811dcf15e4b7250dbd1116e1c4bdc7209/dlr/tiles/icon-512.png',sizes:'512x512',type:t.img?'image/webp':'image/png'}]});navigator.mediaSession.setActionHandler('play',()=>AUD.play());navigator.mediaSession.setActionHandler('pause',()=>AUD.pause());navigator.mediaSession.setActionHandler('nexttrack',next);navigator.mediaSession.setActionHandler('previoustrack',()=>playAt((ti-1+T.length)%T.length))}catch(e){}}}
function toggle(){if(ti<0)return playAt(shuf?Math.random()*T.length|0:0);AUD.paused?AUD.play():AUD.pause()}
function next(){if(shuf){let j;do{j=Math.random()*T.length|0}while(j===ti&&T.length>1);playAt(j)}else playAt((ti+1)%T.length)}
$('play').onclick=toggle;$('mp').onclick=toggle;$('mn').onclick=next;$('mx').onclick=()=>{AUD.pause();AUD.removeAttribute('src');ti=-1;$('mini').classList.remove('on');mark()};
$('mi').onclick=()=>{show('musica');openAlb(true)};$('thumb').onclick=()=>{show('musica');openAlb(true)};
$('shuf').onclick=()=>{shuf=!shuf;$('shuf').classList.toggle('on',shuf)};
setInterval(()=>{if(ti<0)return;const d=AUD.duration||0,c=AUD.currentTime||0;$('pb').style.width=(d?c/d*100:0)+'%'},500);
document.querySelectorAll('#list .tr').forEach((d,i)=>d.dataset.f=T[i].f);

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fdate(k){const [y,m,d]=k.split('-');return d+' de '+MESES[m-1]+' '+y}
function renderYo(){if(USER){$('who-n').textContent=USER.user_metadata&&USER.user_metadata.nombre||'Tu espacio';$('who-e').textContent=USER.email||'';$('av').textContent=((USER.user_metadata&&USER.user_metadata.nombre)||USER.email||'·').trim().charAt(0).toUpperCase()}const notes=D.notes;$('notes').innerHTML=notes.length?notes.map((n,i)=>'<div class="entry"><time>'+esc(n.t)+'</time><p>'+esc(n.x)+'</p><button data-i="'+i+'">Borrar</button></div>').join(''):'<p class="empty">Todavía no has escrito nada.</p>';
$('notes').querySelectorAll('button').forEach(b=>b.onclick=async()=>{const n=D.notes.splice(+b.dataset.i,1)[0];renderYo();if(n&&n.id&&USER)await SB.from('diario').delete().eq('id',n.id)});
const s=D.saved;$('saved').innerHTML=s.length?s.map((m,i)=>'<div class="entry"><time>'+fdate(m.d)+' · '+esc(m.n)+'</time><p>'+esc(m.m)+'</p><button data-i="'+i+'">Quitar</button></div>').join(''):'<p class="empty">Guarda el mensaje del día desde Inicio.</p>';
$('saved').querySelectorAll('button').forEach(b=>b.onclick=async()=>{const m=D.saved.splice(+b.dataset.i,1)[0];renderYo();updSave();if(m&&USER)await SB.from('guardados').delete().eq('usuario',USER.id).eq('dia',m.d)});
const f=T.map((t,i)=>fav[t.f]?i:-1).filter(i=>i>=0);$('favs').innerHTML='';if(f.length)f.forEach(i=>{const r=row(T[i],i);r.dataset.f=T[i].f;$('favs').append(r)});else $('favs').innerHTML='<p class="empty">Toca el corazón en Música para guardar tus mantras.</p>';mark()}
function ft(d){d=new Date(d);return d.getDate()+' de '+MESES[d.getMonth()]+' '+d.getFullYear()+', '+d.toTimeString().slice(0,5)}
$('note-save').onclick=async()=>{const x=$('note').value.trim();if(!x||!USER)return;const t=new Date();const e={t:ft(t),x};D.notes.unshift(e);$('note').value='';renderYo();toast('Guardado en tu diario');const {data}=await SB.from('diario').insert({usuario:USER.id,texto:x}).select('id').single();if(data)e.id=data.id};

window.addEventListener('message',async e=>{if(e.origin!==location.origin)return;const d=e.data;if(!d||d.dlr!=='diario'||typeof d.texto!=='string')return;const x=d.texto.trim().slice(0,1800);if(!x)return;if(!USER){toast('Entra a tu cuenta para guardar');return}const t=new Date();const en={t:ft(t),x};D.notes.unshift(en);if(cur==='yo')renderYo();toast('Guardado en tu diario');const {data}=await SB.from('diario').insert({usuario:USER.id,texto:x}).select('id').single();if(data)en.id=data.id});
async function loadAll(){if(!USER)return;const [n,g,f]=await Promise.all([SB.from('diario').select('id,texto,creado').eq('usuario',USER.id).order('creado',{ascending:false}),SB.from('guardados').select('*').eq('usuario',USER.id).order('creado',{ascending:false}),SB.from('favoritos').select('pista').eq('usuario',USER.id)]);
D.notes=(n.data||[]).map(r=>({id:r.id,t:ft(r.creado),x:r.texto}));D.saved=(g.data||[]).map(r=>({d:r.dia,i:r.carta,n:r.nombre,v:r.virtud,s:r.frase,m:r.mensaje}));for(const k in fav)delete fav[k];(f.data||[]).forEach(r=>fav[r.pista]=true);document.querySelectorAll('#list .tr .h').forEach(h=>{const k=h.closest('.tr').dataset.f;h.textContent=fav[k]?'♥':'♡';h.classList.toggle('on',!!fav[k])});updSave();if(cur==='yo')renderYo()}
/* cuenta */
let mode='in',inReset=false;
function amode(m){mode=m;const cd=m==='code'||m==='rcode';$('a-nombre').style.display=m==='up'?'block':'none';$('a-pass').style.display=(m==='reset'||m==='code')?'none':'block';$('a-code').style.display=cd?'block':'none';$('a-resend').style.display=cd?'inline':'none';$('a-forgot').style.display=cd?'none':'inline';
$('at').textContent=m==='up'?'Crea tu cuenta':m==='reset'?'Recuperar contraseña':m==='code'?'Confirma tu correo':m==='rcode'?'Contraseña nueva':'Entra a tu espacio';
$('al').textContent=m==='up'?'Con tu cuenta, tu diario y tus favoritos te siguen a donde vayas.':m==='reset'?'Te enviamos un código a tu correo para crear una contraseña nueva.':m==='code'?'Escribe el código que te enviamos a tu correo.':m==='rcode'?'Escribe el código que te enviamos y elige tu contraseña nueva.':'Tu cuenta guarda tu diario, tus mensajes y tus favoritos.';
$('a-go').textContent=m==='up'?'Crear cuenta':m==='reset'?'Enviar código':m==='code'?'Confirmar':m==='rcode'?'Guardar contraseña':'Entrar';
$('a-sw').firstElementChild.textContent=cd?'':m==='in'?'¿No tienes cuenta?':'¿Ya tienes cuenta?';$('a-toggle').textContent=cd?'Volver':m==='in'?'Crear cuenta':'Entrar';
$('a-pass').placeholder=m==='rcode'?'Contraseña nueva':'Contraseña';$('a-pass').autocomplete=(m==='up'||m==='rcode')?'new-password':'current-password';$('a-code').value='';$('a-err').textContent=''}
$('a-toggle').onclick=()=>amode(mode==='in'?'up':'in');$('a-forgot').onclick=()=>amode('reset');
$('af').onsubmit=async e=>{e.preventDefault();const em=$('a-email').value.trim().toLowerCase(),pw=$('a-pass').value,nm=$('a-nombre').value.trim();$('a-err').textContent='';$('a-go').disabled=true;
try{const ok=t=>{$('a-err').style.color='#9ff0c8';$('a-err').textContent=t},cod=$('a-code').value.trim();
if(mode==='reset'){const {error}=await SB.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});if(error)throw error;amode('rcode');ok('Listo. Escribe el código que llegó a tu correo.')}
else if(mode==='up'){if(!nm)throw new Error('Escribe tu nombre.');if(pw.length<6)throw new Error('La contraseña debe tener al menos 6 caracteres.');const {data,error}=await SB.auth.signUp({email:em,password:pw,options:{data:{nombre:nm}}});if(error)throw error;if(!data.session){amode('code');ok('Te enviamos un código a tu correo. Escríbelo aquí.')}}
else if(mode==='code'){if(!cod)throw new Error('Escribe el código.');const {error}=await SB.auth.verifyOtp({email:em,token:cod,type:'signup'});if(error)throw error}
else if(mode==='rcode'){if(!cod)throw new Error('Escribe el código.');if(pw.length<6)throw new Error('La contraseña debe tener al menos 6 caracteres.');inReset=true;const {error}=await SB.auth.verifyOtp({email:em,token:cod,type:'recovery'});if(error){inReset=false;throw error}const r=await SB.auth.updateUser({password:pw});inReset=false;if(r.error)throw r.error;toast('Contraseña actualizada')}
else{const {error}=await SB.auth.signInWithPassword({email:em,password:pw});if(error)throw error}}
catch(err){$('a-err').style.color='#ffb3c1';const m=(err.message||'')+'';if(/Email not confirmed/i.test(m)&&mode==='in'){await SB.auth.resend({type:'signup',email:em});amode('code');$('a-err').style.color='#9ff0c8';$('a-err').textContent='Falta confirmar tu correo. Te enviamos un código nuevo.'}
else $('a-err').textContent=/Invalid login/i.test(m)?'Correo o contraseña incorrectos.':/already registered/i.test(m)?'Ese correo ya tiene cuenta. Entra con tu contraseña.':/expired|invalid/i.test(m)&&(mode==='code'||mode==='rcode')?'El código no es correcto o ya venció. Toca "Reenviar código".':/rate limit/i.test(m)?'Demasiados intentos. Espera un momento.':m||'No se pudo completar.'}
$('a-go').disabled=false};
$('a-resend').onclick=async()=>{const em=$('a-email').value.trim().toLowerCase();if(!em){$('a-err').style.color='#ffb3c1';$('a-err').textContent='Escribe tu correo.';return}try{if(mode==='rcode')await SB.auth.resetPasswordForEmail(em);else await SB.auth.resend({type:'signup',email:em});$('a-err').style.color='#9ff0c8';$('a-err').textContent='Te enviamos un código nuevo.'}catch(e){$('a-err').style.color='#ffb3c1';$('a-err').textContent='No se pudo reenviar. Espera un momento.'}};
$('logout').onclick=async()=>{await SB.auth.signOut()};
SB.auth.onAuthStateChange((ev,session)=>{USER=session?session.user:null;chequeaDueno();if(USER){$('auth').classList.remove('on');loadAll();if(ev==='PASSWORD_RECOVERY'&&!inReset){const p=prompt('Escribe tu contraseña nueva (mínimo 6 caracteres):');if(p&&p.length>=6)SB.auth.updateUser({password:p}).then(()=>toast('Contraseña actualizada'))}}else{D.notes=[];D.saved=[];for(const k in fav)delete fav[k];amode('in');$('auth').classList.add('on')}});

const OB=[['Bienvenida a Desde la Red','Un espacio para explorar, escuchar y volver a ti. Muchas voces, una misma red.'],['Elige tu puerta','Oráculos, cristales, runas, códigos y más. Toca una puerta y entra a tu ritmo.'],['Tu mensaje y tu música','Cada día te espera un mensaje. Los mantras siguen sonando mientras navegas, y en "Yo" guardas tu diario y favoritos.']];let obi=0;
function ob(){const o=OB[obi];$('obt').textContent=o[0];$('obp').textContent=o[1];$('obd').innerHTML=OB.map((_,i)=>'<i class="'+(i===obi?'on':'')+'"></i>').join('');$('obn').textContent=obi<OB.length-1?'Siguiente':'Empezar'}
$('obn').onclick=()=>{if(obi<OB.length-1){obi++;ob()}else{$('ob').classList.remove('on');LS.set('dlr-ob',1)}};$('obs').onclick=()=>{$('ob').classList.remove('on');LS.set('dlr-ob',1)};
$('tour').onclick=()=>{obi=0;ob();$('ob').classList.add('on')};
if(!LS.get('dlr-ob',0)){ob();$('ob').classList.add('on')}

{const h=location.hash.slice(1);h.startsWith('app-')?openApp(h.slice(4)):show(h||'inicio')}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
let deferred=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const b=document.createElement('button');b.className='btn';b.textContent='Instalar ahora';b.style.marginTop='8px';b.onclick=()=>deferred.prompt();$('inst').after(b)});

(function(){const c=$('dlr-bg'),x=c.getContext('2d'),rm=matchMedia('(prefers-reduced-motion:reduce)');let W,H,S=[];
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);S=Array.from({length:Math.min(80,Math.max(28,W*H/14000|0))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:.7+Math.random()*1.1,p:Math.random()*6.3}))}
function dr(t){x.clearRect(0,0,W,H);const D=Math.min(150,Math.max(95,W*.18));S.forEach((a,i)=>{if(!rm.matches){a.x=(a.x+a.vx+W)%W;a.y=(a.y+a.vy+H)%H}for(let j=i+1;j<S.length;j++){const b=S[j],q=Math.hypot(a.x-b.x,a.y-b.y);if(q<D){x.strokeStyle='rgba(115,222,239,'+(.26*(1-q/D)).toFixed(3)+')';x.lineWidth=.7;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}x.fillStyle='rgba(185,245,252,'+(.45+.3*Math.sin(t*.0007+a.p)).toFixed(2)+')';x.beginPath();x.arc(a.x,a.y,a.r,0,6.3);x.fill()});if(!rm.matches)requestAnimationFrame(dr)}
addEventListener('resize',rs);rs();requestAnimationFrame(dr)})();

/* ===== Mensaje del día de Natalia ===== */
let NAT=null,ES_DUENO=false;
function elx(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function isoHoy(){const n=new Date();return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')}
async function cargarNatalia(){try{const r=await SB.from('dia_mensajes').select('*').eq('publicado',true).eq('dia',isoHoy()).order('creado',{ascending:false}).limit(1);NAT=r.data&&r.data[0]||null}catch(e){NAT=null}
 if(NAT){const c=$('msgc');if(NAT.media_tipo==='imagen'&&NAT.media_url)c.style.backgroundImage='url('+NAT.media_url+')';$('msgn').textContent=NAT.titulo||'Mensaje de Natalia';$('msgv').textContent='Con cariño, Natalia';$('msgs').textContent=NAT.texto.length>110?NAT.texto.slice(0,107)+'…':NAT.texto;const k=document.querySelector('#msg .k');if(k)k.textContent='Mensaje del día · por Natalia';if(NAT.media_tipo==='video'){c.style.backgroundImage='';c.classList.add('vid');c.textContent='▶'}}}
async function chequeaDueno(){ES_DUENO=false;if(USER){try{const r=await SB.rpc('es_dueno');ES_DUENO=r.data===true}catch(e){}}renderAdminNatalia()}
function abrirNatalia(){const m=elx('div','ob on');m.style.justifyContent='flex-start';m.style.paddingTop='calc(30px + env(safe-area-inset-top))';m.style.alignItems='center';
 const card=elx('div','msg');card.style.cssText='display:block;width:100%;max-width:380px;text-align:center;cursor:default;padding:0 0 16px;overflow:hidden';
 card.append(elx('div','eb','MENSAJE DEL DÍA · POR NATALIA'));
 if(NAT.media_url&&NAT.media_tipo==='imagen'){const im=new Image();im.src=NAT.media_url;im.alt='';im.style.cssText='width:100%;border-radius:16px;margin:12px 0;display:block';card.append(im)}
 if(NAT.media_url&&NAT.media_tipo==='video'){const v=document.createElement('video');v.src=NAT.media_url;v.controls=true;v.playsInline=true;v.preload='metadata';v.style.cssText='width:100%;border-radius:16px;margin:12px 0;background:#000;display:block';card.append(v)}
 if(NAT.titulo){const n=elx('div','n',NAT.titulo);n.style.fontSize='28px';card.append(n)}
 const tx=elx('p','s',NAT.texto);tx.style.cssText='font-size:15px;line-height:1.6;margin:10px 14px 0;text-align:left;white-space:pre-wrap';card.append(tx);
 if(NAT.mantra){const i=T.findIndex(t=>t.f===NAT.mantra);if(i>=0){const b=elx('button','btn ghost','♪ Escuchar: '+T[i].n);b.style.cssText='margin:14px auto 0;width:auto';b.onclick=()=>playAt(i);card.append(b)}}
 const cm=elx('div','');cm.style.cssText='text-align:left;margin:18px 14px 0';card.append(cm);
 const bp=elx('button','btn ghost','Escribirle a Natalia (privado)');bp.style.cssText='margin:14px auto 0;width:auto';bp.onclick=()=>escribirNatalia();card.append(bp);
 const bt=elx('button','btn','Cerrar');bt.style.marginTop='14px';bt.onclick=()=>{const v=m.querySelector('video');if(v)v.pause();m.remove()};
 m.append(card,bt);document.body.append(m);pintaComentarios(cm)}
async function pintaComentarios(box){box.textContent='';box.append(elx('h3','','Comentarios'));const lista=elx('div','');box.append(lista);
 const r=await SB.from('dia_comentarios').select('*').eq('mensaje',NAT.id).order('creado',{ascending:true}).limit(100);const L=(r.data||[]);
 if(!L.length)lista.append(elx('p','empty','Sé la primera persona en comentar.'));
 L.forEach(c=>{const e=elx('div','entry');if(c.oculto)e.style.opacity='.5';e.append(elx('time','',(c.nombre||'Persona')+(c.oculto?' · oculto':'')));e.append(elx('p','',c.texto));
  const acts=elx('div','');acts.style.cssText='display:flex;gap:12px;margin-top:4px';
  if(USER&&c.usuario!==USER.id){const rp=elx('button','','Reportar');rp.onclick=async()=>{await SB.from('dia_reportes').insert({comentario:c.id});rp.textContent='Reportado';rp.disabled=true;toast('Gracias, lo revisaremos')};acts.append(rp)}
  if(USER&&(c.usuario===USER.id||ES_DUENO)){const bd=elx('button','','Borrar');bd.onclick=async()=>{await SB.from('dia_comentarios').delete().eq('id',c.id);pintaComentarios(box)};acts.append(bd)}
  if(ES_DUENO){const oc=elx('button','',c.oculto?'Mostrar':'Ocultar');oc.onclick=async()=>{await SB.from('dia_comentarios').update({oculto:!c.oculto}).eq('id',c.id);pintaComentarios(box)};acts.append(oc)}
  e.append(acts);lista.append(e)});
 if(!USER){const b=elx('button','btn ghost','Entra para comentar');b.style.cssText='width:auto;margin-top:10px';b.onclick=()=>$('auth').classList.add('on');box.append(b);return}
 const ta=document.createElement('textarea');ta.placeholder='Escribe un comentario con respeto…';ta.maxLength=600;ta.style.cssText='width:100%;margin-top:10px;min-height:70px';box.append(ta);
 const bs=elx('button','btn','Comentar');bs.style.cssText='width:auto;margin-top:8px';bs.onclick=async()=>{const t=ta.value.trim();if(!t)return;bs.disabled=true;const nom=(USER.user_metadata&&USER.user_metadata.nombre)||'Persona';const x=await SB.from('dia_comentarios').insert({mensaje:NAT.id,nombre:nom,texto:t});bs.disabled=false;if(x.error)return toast('No se pudo enviar');ta.value='';pintaComentarios(box)};box.append(bs)}
function escribirNatalia(){if(!USER){$('auth').classList.add('on');return}const m=elx('div','ob on');const h=elx('h1','','Escríbele a Natalia');const p=elx('p','','Solo ella lo leerá.');const ta=document.createElement('textarea');ta.maxLength=1500;ta.placeholder='Tu mensaje…';ta.style.cssText='width:100%;max-width:360px;min-height:140px';
 const bs=elx('button','btn','Enviar');bs.style.marginTop='12px';bs.onclick=async()=>{const t=ta.value.trim();if(!t)return;bs.disabled=true;const nom=(USER.user_metadata&&USER.user_metadata.nombre)||'Persona';const x=await SB.from('dia_privados').insert({mensaje:NAT?NAT.id:null,nombre:nom,texto:t});if(x.error){bs.disabled=false;return toast('No se pudo enviar')}toast('Enviado a Natalia');m.remove()};
 const bc=elx('button','btn ghost','Cancelar');bc.style.marginTop='10px';bc.onclick=()=>m.remove();m.append(h,p,ta,bs,bc);document.body.append(m)}
function renderAdminNatalia(){let box=document.getElementById('nat-admin');if(box)box.remove();if(!ES_DUENO)return;const host=document.querySelector('#s-yo');box=elx('div','card');box.id='nat-admin';
 box.append(elx('h3','','Publicar mensaje del día'));
 const f=document.createElement('div');f.innerHTML='<input class="in" id="na-fecha" type="date"><input class="in" id="na-tit" placeholder="Título (opcional)" maxlength="80"><textarea id="na-txt" placeholder="Tu mensaje…" maxlength="2000" style="min-height:110px"></textarea><label class="sub" style="display:block;margin-top:8px">Imagen o video (opcional, hasta 60 MB)</label><input id="na-file" type="file" accept="image/*,video/*" style="width:100%;margin-top:4px"><label class="sub" style="display:block;margin-top:10px">Mantra (opcional)</label><select class="in" id="na-man"><option value="">Sin mantra</option></select><div class="err" id="na-err"></div>';
 box.append(f);const sel=f.querySelector('#na-man');T.forEach(t=>{const o=document.createElement('option');o.value=t.f;o.textContent=t.n;sel.append(o)});f.querySelector('#na-fecha').value=isoHoy();
 const bp=elx('button','btn','Publicar');bp.style.marginTop='10px';box.append(bp);
 const rec=elx('div','');rec.style.marginTop='14px';box.append(rec);
 const inb=elx('div','');inb.style.marginTop='14px';box.append(inb);
 bp.onclick=async()=>{const er=f.querySelector('#na-err');er.textContent='';const txt=f.querySelector('#na-txt').value.trim();if(!txt)return er.textContent='Escribe el mensaje.';bp.disabled=true;bp.textContent='Publicando…';
  let url=null,tipo=null;const fl=f.querySelector('#na-file').files[0];
  if(fl){if(fl.size>62914560){bp.disabled=false;bp.textContent='Publicar';return er.textContent='El archivo pesa más de 60 MB.'}tipo=fl.type.startsWith('video')?'video':'imagen';const ext=(fl.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'');const path=Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
   const up=await SB.storage.from('dia').upload(path,fl,{contentType:fl.type,upsert:false});if(up.error){bp.disabled=false;bp.textContent='Publicar';return er.textContent='No se pudo subir el archivo.'}url=SB.storage.from('dia').getPublicUrl(path).data.publicUrl}
  const x=await SB.from('dia_mensajes').insert({dia:f.querySelector('#na-fecha').value||isoHoy(),titulo:f.querySelector('#na-tit').value.trim()||null,texto:txt,media_url:url,media_tipo:tipo,mantra:sel.value||null});
  bp.disabled=false;bp.textContent='Publicar';if(x.error)return er.textContent='No se pudo publicar.';
  f.querySelector('#na-txt').value='';f.querySelector('#na-tit').value='';f.querySelector('#na-file').value='';toast('Mensaje publicado');await cargarNatalia();pintaRec()};
 async function pintaRec(){rec.textContent='';rec.append(elx('h3','','Tus mensajes recientes'));const r=await SB.from('dia_mensajes').select('id,dia,titulo,texto,publicado').order('creado',{ascending:false}).limit(8);(r.data||[]).forEach(mm=>{const e=elx('div','entry');e.append(elx('time','',mm.dia+(mm.publicado?'':' · oculto')+(mm.titulo?' · '+mm.titulo:'')));e.append(elx('p','',mm.texto.slice(0,120)));const b=elx('button','','Borrar');b.onclick=async()=>{if(!confirm('¿Borrar este mensaje?'))return;await SB.from('dia_mensajes').delete().eq('id',mm.id);await cargarNatalia();pintaRec()};e.append(b);rec.append(e)});
  inb.textContent='';inb.append(elx('h3','','Mensajes para ti'));const q=await SB.from('dia_privados').select('*').order('creado',{ascending:false}).limit(20);const Q=q.data||[];if(!Q.length)inb.append(elx('p','empty','Aún no hay mensajes.'));Q.forEach(pm=>{const e=elx('div','entry');e.append(elx('time','',(pm.nombre||'Persona')+' · '+new Date(pm.creado).toLocaleDateString('es')+(pm.leido?'':' · nuevo')));e.append(elx('p','',pm.texto));if(!pm.leido){const b=elx('button','','Marcar leído');b.onclick=async()=>{await SB.from('dia_privados').update({leido:true}).eq('id',pm.id);pintaRec()};e.append(b)}inb.append(e)})}
 const first=host.querySelector('.card');host.insertBefore(box,first);pintaRec()}

cargarNatalia();

/* ===== Elige tu puerta: portales con mensajes de Natalia al azar ===== */
const PUERTAS=[{n:'Primera puerta',s:'Para lo que sientes hoy',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c0922367ec97c2acb5239272cc822d3eae8a90ba/dlr/tiles/puerta-1.webp'},{n:'Segunda puerta',s:'Para lo que buscas',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c0922367ec97c2acb5239272cc822d3eae8a90ba/dlr/tiles/puerta-2.webp'},{n:'Tercera puerta',s:'Para lo que viene',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@c0922367ec97c2acb5239272cc822d3eae8a90ba/dlr/tiles/puerta-3.webp'}];
function lastDoor(p){try{return localStorage.getItem('dlr_pt'+p)}catch(e){return null}}
function setLastDoor(p,id){try{localStorage.setItem('dlr_pt'+p,id)}catch(e){}}
function vistosLS(p){try{return JSON.parse(localStorage.getItem('dlr_pv'+p)||'[]')}catch(e){return[]}}
function guardaVistos(p,v){try{localStorage.setItem('dlr_pv'+p,JSON.stringify(v.slice(-400)))}catch(e){}}
/* rotacion: nadie repite hasta ver todos los de su puerta; entre usuarios se reparte por los menos entregados */
async function mensajeDePuerta(p){let vis=vistosLS(p);try{const r=await SB.rpc('puerta_sacar',{p:p,vistos:vis});const m=(r.data||[])[0];if(!m)return null;if(vis.includes(m.id))vis=[];vis.push(m.id);guardaVistos(p,vis);return m}catch(e){return null}}
function abrirPuertas(){
 const o=elx('div','pt');o.innerHTML='<div class="pt-in"><div class="eb">DESDE LA RED</div><h2>Elige tu puerta</h2><p class="lead">Respira. Elige la que te llame. Tu mensaje es solo para ti.</p><div class="pt-doors"></div><div class="pt-msg" hidden></div><button class="btn ghost pt-x">Cerrar</button></div>';
 const ds=o.querySelector('.pt-doors'),mg=o.querySelector('.pt-msg');
 PUERTAS.forEach((d,i)=>{const b=elx('button','pt-door');b.setAttribute('aria-label',d.n);b.innerHTML='<span class="arc"></span>'+(d.img?'<span class="leaf"></span>':'')+'<b></b><small></small>';b.querySelector('b').textContent=d.n;b.querySelector('small').textContent=d.s;if(d.img){b.classList.add('im');b.style.setProperty('--im','url('+d.img+')')}
  b.onclick=async()=>{ds.querySelectorAll('.pt-door').forEach((x,j)=>x.classList.toggle('sel',j===i));b.classList.add('open');mg.hidden=false;mg.className='pt-msg load';mg.textContent='';
   const m=await mensajeDePuerta(i+1);await new Promise(r=>setTimeout(r,1250));mg.className='pt-msg show';mg.textContent='';
   if(!m){mg.append(elx('p','','Tu mensaje está en camino. Vuelve pronto.'))}else{mg.append(elx('div','k','Mensaje para ti · por Natalia'));const p=elx('p','',m.texto);mg.append(p);const ot=elx('button','btn ghost','Elegir otra puerta');ot.onclick=()=>{mg.hidden=true;ds.querySelectorAll('.pt-door').forEach(x=>x.classList.remove('sel','open'));o.querySelector('.pt-in').scrollTo(0,0)};mg.append(ot)}
   mg.scrollIntoView({behavior:'smooth',block:'center'})};ds.append(b)});
 o.querySelector('.pt-x').onclick=()=>o.remove();document.body.append(o);requestAnimationFrame(()=>o.classList.add('on'))}
(()=>{const h=document.querySelector('#s-inicio .hero');if(!h)return;h.style.cursor='pointer';h.setAttribute('role','button');h.setAttribute('tabindex','0');const go=elx('span','pt-go','Entrar →');h.append(go);h.onclick=abrirPuertas;h.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')abrirPuertas()}})();
/* admin: mensajes de las puertas */
const _rAN=renderAdminNatalia;renderAdminNatalia=function(){_rAN();if(!ES_DUENO)return;const host=document.getElementById('nat-admin');if(!host||host.querySelector('#pt-admin'))return;
 const c=elx('div','');c.id='pt-admin';c.style.marginTop='22px';c.append(elx('h3','','Mensajes de las puertas'));const sub=elx('p','sub','Cada persona recibe uno al azar de la puerta que elija.');c.append(sub);
 const sel=document.createElement('select');sel.className='in';PUERTAS.forEach((d,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent=d.n;sel.append(o)});
 const ta=document.createElement('textarea');ta.placeholder='Escribe un mensaje. Para agregar varios a la vez, sepáralos con una línea en blanco.';ta.maxLength=2000;ta.style.minHeight='90px';const er=elx('div','err');const bt=elx('button','btn','Agregar a la puerta');bt.style.marginTop='10px';const lst=elx('div','');lst.style.marginTop='12px';c.append(sel,ta,er,bt,lst);host.append(c);
 async function pinta(){lst.textContent='';const r=await SB.from('puerta_mensajes').select('id,puerta,texto,activo').order('creado',{ascending:false});(r.data||[]).filter(x=>String(x.puerta)===sel.value).forEach(x=>{const row=elx('div','');row.style.cssText='border-top:1px solid rgba(255,255,255,.12);padding:10px 0';row.append(elx('p','',x.texto));const a=elx('div','');a.style.cssText='display:flex;gap:12px;margin-top:6px;font-size:13px';const t=elx('button','',x.activo?'Pausar':'Activar');t.onclick=async()=>{await SB.from('puerta_mensajes').update({activo:!x.activo}).eq('id',x.id);pinta()};const d=elx('button','','Borrar');d.onclick=async()=>{await SB.from('puerta_mensajes').delete().eq('id',x.id);pinta()};[t,d].forEach(b=>{b.style.cssText='background:none;border:0;color:#7fe3f5;padding:0;font:inherit'});a.append(t,d);row.append(a);if(!x.activo)row.style.opacity='.55';lst.append(row)});const n=(r.data||[]).filter(x=>String(x.puerta)===sel.value&&x.activo).length;lst.prepend(elx('p','sub',n?n+' mensajes activos en esta puerta.':'Aún no hay mensajes en esta puerta.'))}
 sel.onchange=pinta;bt.onclick=async()=>{er.textContent='';const vs=ta.value.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);if(!vs.length)return er.textContent='Escribe el mensaje.';bt.disabled=true;const r=await SB.from('puerta_mensajes').insert(vs.map(t=>({puerta:+sel.value,texto:t})));bt.disabled=false;if(r.error)return er.textContent='No se pudo guardar.';ta.value='';toast(vs.length>1?vs.length+' mensajes agregados':'Agregado');pinta()};pinta()};
renderAdminNatalia();

/* ===== Reproductor ampliado: imagen grande + explicación ===== */
const EXPL={
'kodoish-pulso-sagrado-desde-la-red':'Un pulso para la quietud profunda. Baja el ruido de la mente y te devuelve a tu centro, sin esfuerzo.',
'waheguru-pulso-de-luz':'Trabaja la gratitud y el asombro. Abre espacio para sentirte parte de algo más grande que tu día a día.',
'gayatri-mantra-pulso-de-luz':'Trabaja la claridad mental y la intuición. Ideal para empezar el día con enfoque y la mente despejada.',
'om-namah-shivaya-pulso-de-serenidad':'Trabaja la calma interior y el soltar lo que ya no necesitas. Una transformación suave, desde adentro.',
'om-gam-ganapataye-namaha-pulso-de-apertura':'Trabaja los comienzos. Ayuda a remover bloqueos, abrir camino y arrancar algo nuevo con confianza.',
'om-hanumate-namaha-pulso-de-valenti-a':'Trabaja la fuerza, el coraje y la constancia. Para cuando algo se siente grande y necesitas sostenerte.',
'hare-krishna-pulso-de-devocio-n':'Trabaja el corazón: la alegría, la ternura y la conexión con quienes amas y con lo que te inspira.',
'om-tare-tuttare-ture-soha-desde-la-red':'Trabaja la protección y la compasión. Acompaña cuando sientes miedo, prisa o necesitas amabilidad contigo.',
'om-namo-bhagavate-vasudevaya-desde-la-red':'Trabaja la confianza y el sostén. Te recuerda que no tienes que cargarlo todo sola.',
'om-namo-narayanaya-desde-la-red':'Trabaja la paz y el equilibrio. Ayuda a mantener la calma aunque todo alrededor se mueva.',
'nombres-sagrados-pulso-celestial-desde-la-red':'Una pieza larga para meditar. La repetición suave te lleva al silencio y a una sensación de amplitud.'};
function fmt(s){s=Math.max(0,s|0);return (s/60|0)+':'+String(s%60).padStart(2,'0')}
function prev(){if(AUD.currentTime>4)return AUD.currentTime=0;playAt((ti-1+T.length)%T.length)}
let NP=null;
function pintaNP(){if(!NP||ti<0)return;const t=T[ti];NP.querySelector('.np-img').style.backgroundImage='url('+(t.img||'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@84c5533e88f7bd244db79121a8a9f7400cd8c58d/dlr/tiles/cover-pulsos.webp')+')';NP.querySelector('h2').textContent=t.n;NP.querySelector('.np-d').textContent=t.d;NP.querySelector('.np-x').textContent=EXPL[t.f]||'';NP.querySelector('.np-pl').textContent=playing?'❚❚':'▶'}
function tickNP(){if(!NP)return;const d=AUD.duration||0,c=AUD.currentTime||0;NP.querySelector('.np-bar i').style.width=(d?c/d*100:0)+'%';NP.querySelector('.np-t1').textContent=fmt(c);NP.querySelector('.np-t2').textContent=fmt(d)}
function abrirNP(){if(ti<0||NP)return;const o=elx('div','np');o.innerHTML='<div class="np-grab"></div><button class="np-c" aria-label="Cerrar">⌄</button><div class="np-in"><div class="np-img" role="img"></div><div class="np-hd"><h2></h2><div class="np-d"></div></div><div class="np-k">Lo que trabaja</div><p class="np-x"></p><div class="np-bar"><i></i></div><div class="np-tt"><span class="np-t1">0:00</span><span class="np-t2">0:00</span></div><div class="np-ct"><button class="np-pv" aria-label="Anterior">⏮</button><button class="np-pl big" aria-label="Reproducir">▶</button><button class="np-nx" aria-label="Siguiente">⏭</button></div></div>';
 o.querySelector('.np-c').onclick=cerrarNP;o.querySelector('.np-pl').onclick=toggle;o.querySelector('.np-nx').onclick=next;o.querySelector('.np-pv').onclick=prev;
 o.querySelector('.np-bar').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();if(AUD.duration)AUD.currentTime=(e.clientX-r.left)/r.width*AUD.duration};
 arrastraNP(o);NP=o;document.body.append(o);pintaNP();tickNP();requestAnimationFrame(()=>o.classList.add('on'))}
function arrastraNP(o){let y0=0,dy=0,on=false,t0=0;
 o.addEventListener('touchstart',e=>{if(e.target.closest('.np-bar'))return;if(o.scrollTop>0)return;y0=e.touches[0].clientY;dy=0;on=true;t0=Date.now()},{passive:true});
 o.addEventListener('touchmove',e=>{if(!on)return;dy=e.touches[0].clientY-y0;if(dy<=0||o.scrollTop>0){dy=0;o.style.transition='';o.style.transform='';return}o.style.transition='none';o.style.transform='translateY('+dy+'px)'},{passive:true});
 o.addEventListener('touchend',()=>{if(!on)return;on=false;o.style.transition='';const v=dy/Math.max(1,Date.now()-t0);if(dy>110||(dy>40&&v>.5)){o.style.transform='';cerrarNP()}else o.style.transform=''},{passive:true})}
(()=>{const m=$('mini');let y0=0,dy=0,on=false;
 m.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;dy=0;on=true},{passive:true});
 m.addEventListener('touchmove',e=>{if(on)dy=e.touches[0].clientY-y0},{passive:true});
 m.addEventListener('touchend',()=>{if(on&&dy<-35){m._sw=Date.now();abrirNP()}on=false},{passive:true});
 const oi=$('mi').onclick;[$('mi'),$('thumb')].forEach(el=>{el.onclick=()=>{if(Date.now()-(m._sw||0)<400)return;abrirNP()}})})();
function cerrarNP(){if(!NP)return;const o=NP;NP=null;o.classList.remove('on');setTimeout(()=>o.remove(),280)}
$('mi').onclick=abrirNP;$('thumb').onclick=abrirNP;
(()=>{const b=elx('button','','⌃');b.id='mup';b.setAttribute('aria-label','Ampliar');b.onclick=abrirNP;$('mini').insertBefore(b,$('mp'))})();
AUD.addEventListener('timeupdate',tickNP);AUD.addEventListener('loadedmetadata',tickNP);AUD.addEventListener('play',pintaNP);AUD.addEventListener('pause',pintaNP);AUD.addEventListener('loadstart',()=>{pintaNP();tickNP()});
