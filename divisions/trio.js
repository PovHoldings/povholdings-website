(function(){
  document.querySelectorAll('.vid[data-reels]').forEach(function(box){
    var list=box.getAttribute('data-reels').split(',');
    var wrap=document.createElement('div');wrap.className='trio';
    var vids=list.map(function(n,i){var p=n.split('|');
      var fig=document.createElement('figure');fig.className='t'+i;
      var v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.playsInline=true;v.loop=true;v.autoplay=true;
      v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('preload','metadata');
      v.poster='../vid/reels/'+p[0]+'.jpg';v.dataset.src='../vid/reels/'+p[0]+'.mp4';
      var c=document.createElement('figcaption');c.textContent=p[1]||'';
      fig.appendChild(v);fig.appendChild(c);wrap.appendChild(fig);return v});
    box.innerHTML='';box.appendChild(wrap);
    var tag=document.createElement('span');tag.className='trio-tag';tag.textContent='Shot by POV';box.appendChild(tag);
    var play=function(v){if(!v.getAttribute('src')){v.src=v.dataset.src;v.load()}v.muted=true;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})};
    var on=false;
    var io=new IntersectionObserver(function(es){es.forEach(function(e){on=e.isIntersecting;vids.forEach(function(v){if(on)play(v);else v.pause()})})},{threshold:.15});
    io.observe(box);
    var kick=function(){if(on)vids.forEach(function(v){if(v.paused)play(v)})};
    ['touchstart','click','scroll'].forEach(function(ev){addEventListener(ev,kick,{passive:true})});
  });
})();(function(){
  if(!document.body.classList.contains('lux'))return;
  document.querySelectorAll('.view .block, .cta .slab, .mf p, .vid').forEach(function(el){if(!el.classList.contains('rv'))el.classList.add('rv')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  var watch=function(){document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)})};watch();
  addEventListener('hashchange',function(){setTimeout(function(){document.querySelectorAll('.view:not([hidden]) .rv').forEach(function(el){el.classList.add('in')})},60)});
})();
