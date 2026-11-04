(function(){
var B='/api/a/cristales/',map=null;
function local(im,n){
  if(!map||!n||!map[n]||im.dataset.fb==='1')return false;
  im.dataset.fb='1';im.classList.remove('failed');im.style.objectFit='contain';im.style.padding='8%';
  im.src=B+map[n];return true;
}
function nameOf(im){var c=im.closest('.card,.oracle-card'),h=c&&c.querySelector('h3');return h&&h.textContent.trim()}
/* Lecturas: siempre la foto real guardada (no depende de internet) */
function readings(){
  if(!map)return;
  document.querySelectorAll('.oracle-card img.specimen-photo').forEach(function(im){local(im,nameOf(im))});
}
fetch(B+'stones.json').then(function(r){return r.json()}).then(function(m){map=m;readings()}).catch(function(){});
new MutationObserver(readings).observe(document.documentElement,{childList:true,subtree:true});
/* Biblioteca: si una foto falla, se usa la guardada; si no existe, la piedra sale de la lista */
document.addEventListener('error',function(e){
  var im=e.target;
  if(!im||im.tagName!=='IMG'||!im.classList.contains('specimen-photo'))return;
  var card=im.closest('.card,.oracle-card');
  if(local(im,nameOf(im))){e.stopImmediatePropagation();return}
  var f=document.getElementById('filter');
  if(card&&card.classList.contains('card')&&f&&f.value==='fotos'){
    e.stopImmediatePropagation();
    card.remove();
    var c=document.getElementById('count');
    if(c){var k=parseInt((c.textContent||'').replace(/\D/g,''),10);if(k>0)c.textContent=(k-1).toLocaleString('es')+' resultados'}
  }
},true);
})();
