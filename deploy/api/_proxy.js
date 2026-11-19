const APPS={
maestros:'https://oraculo-maestros-desde-la-red.vercel.app',
cristales:'https://cristales-desde-la-red.vercel.app',
runas:'https://runas.desdelared.net',
codigos:'https://codigos.desdelared.net',
pinaculo:'https://pinaculo.desdelared.net',
dones:'https://dones.desdelared.net',
dharma:'https://dharma.desdelared.net',
interior:'https://interior.desdelared.net',
web:'https://www.desdelared.net'};
const GH='https://raw.githubusercontent.com/HelonUniverse/hub/main/dlr/pages/';
const PAGES={biodec:'biodec.html',codigos:'codigos.html',pinaculo:'pinaculo.html',tarot:'tarot.html'};
const OVR={runas:'runas.css'};
const OVJ={cristales:'cristales-fix.js'};
const TYPES={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json'};
const gh=async(name,res)=>{const r=await fetch(GH+name);if(!r.ok){res.status(404).send('No existe');return}res.setHeader('content-type',TYPES[name.split('.').pop()]||'text/plain');res.setHeader('cache-control','public,s-maxage=60,stale-while-revalidate=300');res.status(200).send(Buffer.from(await r.arrayBuffer()))};
module.exports=async(req,res)=>{
  try{
    const u=new URL(req.url,'https://x');
    const m=u.pathname.match(/^\/api\/a\/([^\/]+)\/?(.*)$/)||[];
    const id=m[1]||'';const p=u.searchParams.get('p')||m[2]||'';u.searchParams.delete('p');
    if(id==='cristales'){const sf=u.searchParams.get('s');u.searchParams.delete('s');if(p===''&&!sf&&req.method==='GET'&&(req.headers.accept||'').includes('text/html')){res.setHeader('location','/api/a/cristales/?s=1');res.status(302).send('');return}}
    if(p.startsWith('__dlr/')){const n=p.slice(6);if(!/^[\w.-]+$/.test(n)){res.status(404).send('No existe');return}return gh(n,res)}
    if(PAGES[id]&&(p===''||p==='index.html'))return gh(PAGES[id],res);
    const base=APPS[id];if(!base){res.status(404).send('No existe');return}
    const q=u.searchParams.toString();
    const target=base+'/'+p+(q?'?'+q:'');
    const init={method:req.method,headers:{accept:req.headers.accept||'*/*','user-agent':req.headers['user-agent']||'dlr'}};
    if(req.method!=='GET'&&req.method!=='HEAD'){
      init.headers['content-type']=req.headers['content-type']||'application/json';
      init.body=typeof req.body==='string'||Buffer.isBuffer(req.body)?req.body:JSON.stringify(req.body||{});
    }
    const r=await fetch(target,init);
    const ct=r.headers.get('content-type')||'';
    res.setHeader('content-type',ct);
    if(ct.includes('text/html')){
      let h=await r.text();const P='/api/a/'+id;
      h=h.replace(/<div id="dlr-global-brand">[\s\S]*?<\/a><\/div>/,'');
      h=h.replace(/(\s(?:src|href|action)=)(["'])\/(?!\/|api\/a\/)/g,'$1$2'+P+'/');
      h=h.replace(/(["'`])\/(?!\/|api\/a\/)([\w\-]+(?:\/[\w\-.]+)*\.(?:webp|jpg|jpeg|png|svg|gif|mp3|mp4|js|json|css|woff2?))\1/g,'$1'+P+'/$2$1');
      h=h.replace(/(["'`])\.\/([\w\-]+(?:\/[\w\-.]+)*\.(?:webp|jpg|jpeg|png|svg|gif|mp3|mp4|js|json|css))\1/g,'$1'+P+'/$2$1');
      h=h.replace(/(["'`])\/cards\/\1/g,'$1'+P+'/cards/$1');
      h=h.replace(/url\((["']?)\/(?!\/|api\/a\/)/g,'url($1'+P+'/');
      h=h.replace(/<html([^>]*)>/i,'<html$1 data-dlr-app="'+id+'">');
      h=h.replace(/<head([^>]*)>/i,'<head$1><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"><script src="/unify.js"></script><link rel="stylesheet" href="/unify.css">'+(OVR[id]?'<link rel="stylesheet" href="/api/a/'+id+'/__dlr/'+OVR[id]+'">':'')+(OVJ[id]?'<script defer src="/api/a/'+id+'/__dlr/'+OVJ[id]+'"></script>':''));
      res.setHeader('cache-control','public,s-maxage=60,stale-while-revalidate=300');
      res.status(r.status).send(h);return;
    }
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader('cache-control',req.method==='GET'?'public,s-maxage=300':'no-store');
    res.status(r.status).send(buf);
  }catch(e){res.status(502).send('Error: '+e.message)}
};
