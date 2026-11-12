/* In-page buttons (Pricing, Overview, #anything): switch tab if needed and land the target in the middle of the screen. */
(function(){
  window.__navjs=true;
  var views=[].slice.call(document.querySelectorAll('[data-view]'));
  function bounds(){
    var hd=document.querySelector('header'),mb=document.querySelector('.mbar'),hr=hd?hd.getBoundingClientRect():null;
    var top=hr&&getComputedStyle(hd).position!=='static'&&hr.bottom>0?hr.bottom:0;
    var bot=innerHeight;if(mb&&getComputedStyle(mb).display!=='none'){var r=mb.getBoundingClientRect();if(r.top>innerHeight*.5)bot=r.top}
    return [top+12,bot-12];
  }
  function target(id){
    var v=views.filter(function(x){return x.dataset.view===id})[0];
    if(v){return v.querySelector('[data-pov-pay]')||v.querySelector('.pp-panel')||v.querySelector('.block')||v}
    return document.getElementById(id);
  }
  function land(id,smooth){
    var el=target(id);if(!el)return;
    var go=function(beh){var r=el.getBoundingClientRect(),b=bounds(),space=b[1]-b[0],y;
      if(r.height<=space)y=scrollY+r.top-(b[0]+(space-r.height)/2);else y=scrollY+r.top-b[0];
      scrollTo({top:Math.max(0,y),behavior:beh})};
    go(smooth?'smooth':'auto');
    // content can still be settling (fonts, images, lazy panels): re-aim quietly
    var n=0,fix=function(){if(n++>2)return;var r=el.getBoundingClientRect(),b=bounds(),space=b[1]-b[0],want=r.height<=space?b[0]+(space-r.height)/2:b[0];if(Math.abs(r.top-want)>8)go('smooth');setTimeout(fix,700)};
    setTimeout(fix,smooth?800:300);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a||e.defaultPrevented||a.hasAttribute('data-pick'))return;
    var id=a.getAttribute('href').slice(1);if(!id||!target(id)&&!views.some(function(x){return x.dataset.view===id}))return;
    e.preventDefault();
    if(location.hash!=='#'+id){history.pushState(null,'','#'+id);window.dispatchEvent(new HashChangeEvent('hashchange'))}
    setTimeout(function(){land(id,true)},40);
  });
  // arriving with a hash (e.g. from the home page): land it once the page has drawn
  var h=(location.hash||'').slice(1);
  if(h&&target(h))addEventListener('load',function(){setTimeout(function(){land(h,true)},150)});
})();
