/* POV Holdings site tracking: Google Analytics 4 + Meta Pixel.
   Loads only after the visitor accepts cookies (POPIA). */
(function(){
  var GA='G-CQ6JYDGHRK', PX='1457818873194913';
  window.POV_GA_ID=GA; window.POV_PIXEL_ID=PX; window.dataLayer=window.dataLayer||[];
  function load(){
    if(!window.__ga){window.__ga=1;window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA);
      var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);}
    if(!window.__px){window.__px=1;
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init',PX);fbq('track','PageView');}
  }
  window.povTrack=load;
  // every WhatsApp, email and phone tap counts as a contact (only reported once tracking is on)
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';
    var m=/wa\.me|whatsapp/i.test(h)?'whatsapp':/^mailto:/i.test(h)?'email':/^tel:/i.test(h)?'phone':'';if(!m)return;
    var page=location.pathname.split('/').pop().replace('.html','')||'home';
    try{if(window.gtag)gtag('event','generate_lead',{method:m,page:page,label:(a.textContent||'').trim().slice(0,60)})}catch(_){}
    try{if(window.fbq)fbq('track','Contact',{content_name:page,method:m})}catch(_){}
  },true);
  var c=null;try{c=localStorage.getItem('pov_consent')}catch(_){}
  if(c==='all'){load();return}
  if(c)return;
  // pages without their own cookie bar get a small one
  document.addEventListener('DOMContentLoaded',function(){
    if(document.getElementById('ck'))return;
    var d=document.createElement('div');d.setAttribute('role','dialog');d.setAttribute('aria-label','Cookie choice');
    d.style.cssText='position:fixed;z-index:2147482000;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));max-width:520px;margin:0 auto;background:#1c1c20;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:16px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;box-shadow:0 20px 60px rgba(0,0,0,.6);font:500 14px/1.5 Manrope,system-ui,sans-serif;color:#cfcbc2';
    d.innerHTML='<span style="flex:1 1 240px">We use cookies to see what works on our site and improve our ads. <a href="'+(location.pathname.indexOf('/divisions/')>-1?'../':'')+'legal.html" style="color:inherit;text-decoration:underline">Privacy</a></span><span style="display:flex;gap:8px;margin-left:auto"><button data-c="essential" style="height:40px;padding:0 14px;border-radius:999px;border:0;background:none;color:#cfcbc2;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);font:700 13px Manrope,system-ui,sans-serif;cursor:pointer">Essential only</button><button data-c="all" style="height:40px;padding:0 16px;border-radius:999px;border:0;background:#ff8c1a;color:#0d0d0f;font:800 13px Manrope,system-ui,sans-serif;cursor:pointer">Accept</button></span>';
    d.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;try{localStorage.setItem('pov_consent',b.dataset.c)}catch(_){}d.remove();if(b.dataset.c==='all')load()});
    setTimeout(function(){document.body.appendChild(d)},1200);
  });
})();
