(function(){
var B='/api/a/cristales/',map=null;
fetch(B+'stones.json').then(function(r){return r.json()}).then(function(m){map=m}).catch(function(){});
document.addEventListener('error',function(e){
  var im=e.target;
  if(!im||im.tagName!=='IMG'||!im.classList.contains('specimen-photo'))return;
  var card=im.closest('.card,.oracle-card'),h=card&&card.querySelector('h3'),n=h&&h.textContent.trim();
  if(map&&n&&map[n]&&im.dataset.fb!=='1'){
    e.stopImmediatePropagation();
    im.dataset.fb='1';im.classList.remove('failed');im.style.objectFit='contain';im.style.padding='8%';
    im.src=B+map[n];return;
  }
  var f=document.getElementById('filter');
  if(card&&card.classList.contains('card')&&f&&f.value==='fotos'){
    e.stopImmediatePropagation();
    card.remove();
    var c=document.getElementById('count');
    if(c){var k=parseInt((c.textContent||'').replace(/\D/g,''),10);if(k>0)c.textContent=(k-1).toLocaleString('es')+' resultados'}
  }
},true);
})();
