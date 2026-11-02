(function(){
  document.querySelectorAll('.vid[data-reels]').forEach(function(box){
    var list=box.getAttribute('data-reels').split(',');
    box.innerHTML='<div class="trio">'+list.map(function(n,i){var p=n.split('|');return '<figure class="t'+i+'"><video muted playsinline loop preload="none" poster="../vid/reels/'+p[0]+'.jpg" data-src="../vid/reels/'+p[0]+'.mp4"></video><figcaption>'+(p[1]||'')+'</figcaption></figure>'}).join('')+'</div><span class="trio-tag">Shot by POV</span>';
    var vids=[].slice.call(box.querySelectorAll('video'));
    var io=new IntersectionObserver(function(es){es.forEach(function(e){vids.forEach(function(v){if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}else v.pause()})})},{threshold:.25});
    io.observe(box);
  });
})();
(function(){
  if(!document.body.classList.contains('lux'))return;
  document.querySelectorAll('.view .block, .cta .slab, .mf p, .vid').forEach(function(el){if(!el.classList.contains('rv'))el.classList.add('rv')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  var watch=function(){document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)})};watch();
  addEventListener('hashchange',function(){setTimeout(function(){document.querySelectorAll('.view:not([hidden]) .rv').forEach(function(el){el.classList.add('in')})},60)});
})();
