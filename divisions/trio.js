(function(){
  document.querySelectorAll('.vid[data-reels]').forEach(function(box){
    var list=box.getAttribute('data-reels').split(',');
    box.innerHTML='<div class="trio">'+list.map(function(n,i){var p=n.split('|');return '<figure class="t'+i+'"><video muted playsinline loop preload="none" poster="../vid/reels/'+p[0]+'.jpg" data-src="../vid/reels/'+p[0]+'.mp4"></video><figcaption>'+(p[1]||'')+'</figcaption></figure>'}).join('')+'</div><span class="trio-tag">Shot by POV</span>';
    var vids=[].slice.call(box.querySelectorAll('video'));
    var io=new IntersectionObserver(function(es){es.forEach(function(e){vids.forEach(function(v){if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}else v.pause()})})},{threshold:.25});
    io.observe(box);
  });
})();
