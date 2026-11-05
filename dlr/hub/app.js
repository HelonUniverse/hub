const CDN='https://cdn.jsdelivr.net/gh/HelonUniverse/hub@5233d2791d1133947b96ff4ddc152df009199a4d/dlr/tiles/';
const API='https://app.desdelared.net';
const A=[
{id:'maestros',g:'oraculos',n:'Oráculo de los Maestros',u:API+'/api/a/maestros'},
{id:'cristales',g:'oraculos',n:'Cristales',u:API+'/api/a/cristales'},
{id:'runas',g:'oraculos',n:'Runas',u:API+'/api/a/runas'},
{id:'codigos',g:'oraculos',n:'Códigos Sagrados',u:API+'/api/a/codigos'},
{id:'pinaculo',g:'oraculos',n:'Pináculo',u:API+'/api/a/pinaculo'},
{id:'tarot',g:'oraculos',n:'Tarot',u:API+'/api/a/tarot',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@186bfd9fca4ac346c7c92e3933c4306a82ff0461/dlr/tiles/tarot.webp'},
{id:'angeles',g:'oraculos',n:'Números angelicales',u:API+'/api/a/angeles/__dlr/angeles.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@31080a5ebaac6866ada4a97512f0aba8fede3b28/dlr/tiles/angeles.webp'},
{id:'luna',g:'oraculos',n:'Luna del día',u:API+'/api/a/luna/__dlr/luna.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@7ac3c3a019008bac6735160697a929eb62121022/dlr/tiles/luna.webp'},
{id:'sino',g:'oraculos',n:'Tarot de sí o no',u:API+'/api/a/sino/__dlr/sino.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@7ac3c3a019008bac6735160697a929eb62121022/dlr/tiles/sino.webp'},
{id:'astral',g:'oraculos',n:'Carta astral',u:API+'/api/a/astral/__dlr/astral.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@afcaf657547a88494731621e4355d8c4ccb1c1a8/dlr/tiles/astral.webp'},
{id:'semana',g:'oraculos',n:'Carta de la semana',u:API+'/api/a/semana/__dlr/semana.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@7ac3c3a019008bac6735160697a929eb62121022/dlr/tiles/semana.webp'},
{id:'respira',g:'oraculos',n:'Respira conmigo',u:API+'/api/a/respira/__dlr/respira.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@7ac3c3a019008bac6735160697a929eb62121022/dlr/tiles/respira.webp'},
{id:'afirmacion',g:'oraculos',n:'Afirmación del día',u:API+'/api/a/afirmacion/__dlr/afirmacion.html',img:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@7ac3c3a019008bac6735160697a929eb62121022/dlr/tiles/afirmacion.webp'},
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
$('tiles').append(...A.map(tile));
['oraculos','estudio'].forEach(g=>$('g-'+g).append(...A.filter(a=>a.g===g).map(tile)));

const tabs=[...document.querySelectorAll('nav [data-t]')];let cur='inicio';
function show(t){closeApp();if(!$('s-'+t))t='inicio';cur=t;document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!=='s-'+t);tabs.forEach(b=>b.classList.toggle('on',b.dataset.t===t));history.replaceState(null,'','#'+t);scrollTo(0,0);if(t==='yo')renderYo()}
function openApp(id){const a=A.find(x=>x.id===id);if(!a||!a.u)return;$('vname').textContent=a.n;$('load').style.display='grid';$('frame').onload=()=>$('load').style.display='none';$('frame').src=a.u;$('viewer').classList.add('open');history.pushState({app:id},'','#app-'+id)}
function closeApp(){if($('viewer').classList.contains('open')){$('viewer').classList.remove('open');$('frame').removeAttribute('src')}}
tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));$('back').onclick=()=>{if(history.state&&history.state.app)history.back();else show(cur)};
addEventListener('popstate',()=>{const h=location.hash.slice(1);h.startsWith('app-')?openApp(h.slice(4)):show(h||cur)});

const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const now=new Date(),hh=now.getHours();
$('hello').textContent=hh<12?'Buenos días':hh<19?'Buenas tardes':'Buenas noches';
$('date').textContent=DIAS[now.getDay()]+' '+now.getDate()+' de '+MESES[now.getMonth()];
let CARDS=[],today=null;const dkey=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
Promise.resolve(CARDS_DATA).then(c=>{CARDS=c;let seed=0;for(const ch of dkey)seed=(seed*31+ch.charCodeAt(0))>>>0;today=CARDS[seed%CARDS.length];
$('msgc').style.backgroundImage='url('+API+'/api/a/maestros/cards/'+today.i+'.webp)';$('msgn').textContent=today.n;$('msgv').textContent=today.v;$('msgs').textContent=today.s;updSave()}).catch(()=>{$('msgn').textContent='Tu mensaje te espera';$('msgs').textContent='Abre el Oráculo de los Maestros.'});
$('msg').onclick=()=>{if(!today)return openApp('maestros');const m=document.createElement('div');m.className='ob on';m.style.justifyContent='flex-start';m.style.paddingTop='calc(30px + env(safe-area-inset-top))';
const card=document.createElement('div');card.className='msg';card.style.cssText='display:block;width:auto;max-width:360px;margin-top:14px;text-align:center;cursor:default;padding-bottom:16px';
card.innerHTML='<div class="eb">MENSAJE DEL DÍA</div><div class="c" style="margin:12px auto;width:140px;transform:none"></div><div class="n" style="font-size:28px"></div><div class="v"></div><p class="s" style="font-size:15px;line-height:1.55;margin:8px 0 0"></p>';
card.querySelector('.c').style.backgroundImage='url('+API+'/api/a/maestros/cards/'+today.i+'.webp)';card.querySelector('.n').textContent=today.n;card.querySelector('.v').textContent=today.v;card.querySelector('.s').textContent=today.m;
const q=document.createElement('p');q.className='lead';q.style.cssText='margin-top:14px;font-style:italic';q.textContent='“'+today.s+'”';
const bt=document.createElement('button');bt.className='btn';bt.style.marginTop='18px';bt.textContent='Cerrar';bt.onclick=()=>m.remove();
m.append(card,q,bt);document.body.append(m)};
function updSave(){const s=D.saved;const on=today&&s.some(x=>x.d===dkey);$('save-msg').textContent=(on?'♥ Guardado':'♡ Guardar mensaje');$('save-msg').classList.toggle('on',!!on)}
$('save-msg').onclick=async()=>{if(!today||!USER)return;if(D.saved.some(x=>x.d===dkey)){D.saved=D.saved.filter(x=>x.d!==dkey);updSave();toast('Quitado de tus guardados');await SB.from('guardados').delete().eq('usuario',USER.id).eq('dia',dkey)}else{D.saved.unshift({d:dkey,i:today.i,n:today.n,v:today.v,s:today.s,m:today.m});updSave();toast('Guardado en Mi espacio');await SB.from('guardados').upsert({usuario:USER.id,dia:dkey,carta:today.i,nombre:today.n,virtud:today.v,frase:today.s,mensaje:today.m},{onConflict:'usuario,dia'})}};
function openAlb(on){$('albs').hidden=on;$('albv').hidden=!on;scrollTo(0,0)}$('alb-mantras').onclick=()=>openAlb(true);$('albback').onclick=()=>openAlb(false);$('go-music').onclick=()=>{show('musica');openAlb(true);if(!playing)toggle()};

const AU='https://raw.githubusercontent.com/HelonUniverse/hub/3682399b9f8ac2f825fd36f7d229a1dc1523d96d/dlr/audio/';
const T=[
{f:'kodoish-pulso-sagrado-desde-la-red',n:'Kodoish',d:'Pulso Sagrado · 3:40'},
{f:'waheguru-pulso-de-luz',n:'Waheguru',d:'Pulso de Luz · 3:33'},
{f:'gayatri-mantra-pulso-de-luz',n:'Gayatri Mantra',d:'Pulso de Luz · 3:32'},
{f:'om-namah-shivaya-pulso-de-serenidad',n:'Om Namah Shivaya',d:'Pulso de Serenidad · 3:11'},
{f:'om-gam-ganapataye-namaha-pulso-de-apertura',n:'Om Gam Ganapataye Namaha',d:'Pulso de Apertura · 3:14'},
{f:'om-hanumate-namaha-pulso-de-valenti-a',n:'Om Hanumate Namaha',d:'Pulso de Valentía · 3:33'},
{f:'hare-krishna-pulso-de-devocio-n',n:'Hare Krishna',d:'Pulso de Devoción · 3:46'},
{f:'om-tare-tuttare-ture-soha-desde-la-red',n:'Om Tare Tuttare Ture Soha',d:'Desde la Red · 3:10'},
{f:'om-namo-bhagavate-vasudevaya-desde-la-red',n:'Om Namo Bhagavate Vasudevaya',d:'Desde la Red · 3:34'},
{f:'om-namo-narayanaya-desde-la-red',n:'Om Namo Narayanaya',d:'Desde la Red · 3:33'},
{f:'nombres-sagrados-pulso-celestial-desde-la-red',n:'Nombres Sagrados',d:'Pulso Celestial · 5:50'}];
let fav=D.fav,ti=-1,shuf=false,playing=false;const AUD=new Audio();AUD.preload='none';
function row(t,i){const d=document.createElement('div');d.className='tr';d.innerHTML='<span class="p">▶</span><b><span></span><small></small></b><button class="h" aria-label="Favorito">♡</button>';d.querySelector('b span').textContent=t.n;d.querySelector('small').textContent=t.d;const h=d.querySelector('.h');const paint=()=>{h.textContent=fav[t.f]?'♥':'♡';h.classList.toggle('on',!!fav[t.f])};paint();
h.onclick=async e=>{e.stopPropagation();fav[t.f]=!fav[t.f];paint();toast(fav[t.f]?'Agregado a favoritos':'Quitado de favoritos');if(cur==='yo')renderYo();if(!USER)return;if(fav[t.f])await SB.from('favoritos').upsert({usuario:USER.id,pista:t.f});else await SB.from('favoritos').delete().eq('usuario',USER.id).eq('pista',t.f)};d.onclick=()=>playAt(i);return d}
T.forEach((t,i)=>$('list').append(row(t,i)));
function setPlaying(p){playing=p;$('mp').textContent=p?'❚❚':'▶';$('play').textContent=p?'❚❚':'▶';mark()}
AUD.onplay=()=>setPlaying(true);AUD.onpause=()=>setPlaying(false);AUD.onended=next;AUD.onerror=()=>{if(ti>=0)toast('No se pudo cargar el audio')};
function mark(){document.querySelectorAll('.tr').forEach(d=>{d.classList.toggle('on',ti>=0&&d.dataset.f===T[ti].f);d.querySelector('.p').textContent=(ti>=0&&d.dataset.f===T[ti].f&&playing)?'❚❚':'▶'})}
function playAt(i){ti=i;const t=T[i];$('mini').classList.add('on');$('mt').textContent=t.n;AUD.src=AU+t.f+'.mp3';AUD.play().catch(()=>{});mark();
if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:t.n,artist:'Desde la Red',album:'Pulsos de Luz',artwork:[{src:'https://cdn.jsdelivr.net/gh/HelonUniverse/hub@8cfad65811dcf15e4b7250dbd1116e1c4bdc7209/dlr/tiles/icon-512.png',sizes:'512x512',type:'image/png'}]});navigator.mediaSession.setActionHandler('play',()=>AUD.play());navigator.mediaSession.setActionHandler('pause',()=>AUD.pause());navigator.mediaSession.setActionHandler('nexttrack',next);navigator.mediaSession.setActionHandler('previoustrack',()=>playAt((ti-1+T.length)%T.length))}catch(e){}}}
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
SB.auth.onAuthStateChange((ev,session)=>{USER=session?session.user:null;if(USER){$('auth').classList.remove('on');loadAll();if(ev==='PASSWORD_RECOVERY'&&!inReset){const p=prompt('Escribe tu contraseña nueva (mínimo 6 caracteres):');if(p&&p.length>=6)SB.auth.updateUser({password:p}).then(()=>toast('Contraseña actualizada'))}}else{D.notes=[];D.saved=[];for(const k in fav)delete fav[k];amode('in');$('auth').classList.add('on')}});

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
