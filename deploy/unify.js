(function(){var id=document.documentElement.getAttribute('data-dlr-app');if(!id)return;var P='/api/a/'+id;
function fix(u){return typeof u==='string'&&u.charAt(0)==='/'&&u.charAt(1)!=='/'&&u.indexOf(P+'/')!==0?P+u:u}
var f=window.fetch;window.fetch=function(i,o){if(typeof i==='string')i=fix(i);return f.call(this,i,o)};
var x=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){arguments[1]=fix(u);return x.apply(this,arguments)};
})();
document.addEventListener('DOMContentLoaded',function(){var id=document.documentElement.getAttribute('data-dlr-app');
if(id==='runas'){var h=document.getElementById('home');if(h&&!h.querySelector('.dlr-hero')){var d=document.createElement('div');d.className='dlr-hero';d.innerHTML='<img src="/logo.webp" alt="Desde la Red"><h1>Runas</h1><p>Oráculo del Futhark Antiguo</p>';h.prepend(d)}}
if(id==='codigos'){var i=document.querySelector('header.nav .brand img');if(i)i.src='/logo.webp'}
});
