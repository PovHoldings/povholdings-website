/* POV Program checkout panel: renders into every [data-pov-pay] element.
   Stitch payment links go in window.POV_PROGRAM_PAY = {launch:'',accelerate:'',dominate:''} */
(function(){
  var T={launch:{n:'Launch',w:'0–5 salespeople',r:'0–5',p:3500},accelerate:{n:'Accelerate',w:'6–12 salespeople',r:'6–12',p:5000},dominate:{n:'Dominate',w:'13+ salespeople',r:'13+',p:7500}};
  var fmt=function(n){return 'R'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')};
  var AP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C6.9 7.3 5.5 8.2 4.7 9.6c-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-3.7zM14.1 5.6c.6-.8 1.1-1.8 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3z"/></svg>';
  var G='<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9z"/></svg>';
  var MC='<svg viewBox="0 0 38 24" class="mc"><circle cx="14" cy="12" r="9" fill="#EB001B"/><circle cx="24" cy="12" r="9" fill="#F79E1B"/><path fill="#FF5F00" d="M19 4.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z"/></svg>';
  var css='.pvp{max-width:540px;margin:0 auto;border-radius:28px;background:#141417;box-shadow:0 0 0 1px rgba(255,255,255,.1),0 40px 90px -40px rgba(255,140,26,.35);padding:22px 18px 20px;font-family:Manrope,system-ui,-apple-system,sans-serif;color:#f5f2ea;text-align:left}'
  +'.pvp-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px}.pvp-h b{font:600 30px/1 "Cormorant Garamond",Georgia,serif}.pvp-h span{color:#8d8980;font:700 10.5px/1.3 Manrope,sans-serif;letter-spacing:.16em;text-transform:uppercase;text-align:right}'
  +'.pvp-t{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}'
  +'.pvp-t button{display:grid;gap:7px;justify-items:center;padding:14px 4px;border-radius:18px;border:0;background:#1b1b1f;color:#cfcbc2;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font:700 13px/1 Manrope,sans-serif;transition:box-shadow .2s,background .2s;-webkit-tap-highlight-color:transparent}'
  +'.pvp-t button b{font:600 clamp(22px,6vw,28px)/1 "Cormorant Garamond",Georgia,serif;color:#f5f2ea;white-space:nowrap}'
  +'.pvp-t button[aria-pressed=true]{color:#fff;box-shadow:inset 0 0 0 2px #ff8c1a;background:rgba(255,140,26,.12)}'
  +'.pvp-s{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}'
  +'.pvp-s button{height:50px;border-radius:16px;border:0;background:#0f0f12;color:#cfcbc2;font:700 15px Manrope,sans-serif;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);cursor:pointer;-webkit-tap-highlight-color:transparent}'
  +'.pvp-s button[aria-pressed=true]{color:#fff;box-shadow:inset 0 0 0 2px #ff8c1a}'
  +'.pvp form{display:grid;gap:10px;margin-top:10px}'
  +'.pvp input{height:54px;border-radius:16px;border:1px solid rgba(255,255,255,.1);background:#0f0f12;color:#f5f2ea;padding:0 16px;font:500 16px Manrope,sans-serif;outline:none;width:100%;box-sizing:border-box}'
  +'.pvp input:focus{border-color:#ff8c1a}'
  +'.pvp-m{min-height:1.1em;margin:0;color:#f2a08a;font-size:13.5px}'
  +'.pvp-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:60px;border-radius:999px;border:0;background:#ff8c1a;color:#0d0d0f;font:800 17px/1 Manrope,sans-serif;cursor:pointer;box-shadow:0 16px 40px -12px rgba(255,140,26,.7);transition:transform .15s}'
  +'.pvp-go:active{transform:scale(.98)}.pvp-go svg{width:19px;height:19px;fill:currentColor;position:relative;top:-1px}'
  +'.pvp-l{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin-top:14px}'
  +'.pvp-l span{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 10px;border-radius:8px;background:#fff;color:#111;font:600 13.5px/1 Manrope,sans-serif}'
  +'.pvp-l svg{height:16px;width:auto}.pvp-l .ap path{fill:#000}.pvp-l .mc{height:17px}.pvp-l em{font:600 11px/1 Manrope,sans-serif;font-style:normal;color:#111}'
  +'.pvp-l .visa{font:italic 900 15px/1 Arial,Helvetica,sans-serif;color:#1A1F71}.pvp-l .st{font:800 14px/1 Manrope,sans-serif;letter-spacing:-.02em}'
  +'@media (max-width:480px){.pvp-h{display:block}.pvp-h span{display:block;text-align:left;margin-top:8px}.pvp-h span br{display:none}}'
  +'.pvp-f{color:#8d8980;font-size:12px;text-align:center;margin:12px 0 0}.pvp-f a{color:#cfcbc2}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var root=(document.currentScript&&document.currentScript.src)?document.currentScript.src.replace(/program\/pay\.js.*$/,''):'/';
  var attr={};try{var q=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].forEach(function(k){if(q.get(k))attr[k]=q.get(k)})}catch(_){}
  function ev(name,params,fb){try{if(window.gtag)gtag('event',name,params)}catch(_){}try{if(window.fbq&&fb)fbq('track',fb,params)}catch(_){}}
  var started=false;
  function mount(box){
    var cur=box.getAttribute('data-tier')||'accelerate',dep='New vehicles';
    try{var bq=new URLSearchParams(location.search).get('buy');if(T[bq])cur=bq}catch(_){}
    box.innerHTML='<div class="pvp"><div class="pvp-h"><b>Choose &amp; pay</b><span>Per department<br> · per month · excl. VAT</span></div>'
      +'<div class="pvp-t" role="group" aria-label="Package">'+Object.keys(T).map(function(k){return '<button type="button" data-t="'+k+'">'+T[k].n+'<b>'+fmt(T[k].p)+'</b>'+T[k].r+'</button>'}).join('')+'</div>'
      +'<div class="pvp-s" role="group" aria-label="Department"><button type="button" data-d="New vehicles">New vehicles</button><button type="button" data-d="Pre-owned">Pre-owned</button></div>'
      +'<form novalidate><input data-f="dl" autocomplete="organization" placeholder="Dealership" maxlength="80" aria-label="Dealership"><input data-f="nm" autocomplete="name" placeholder="Your name" maxlength="60" aria-label="Your name"><input data-f="ph" type="tel" autocomplete="tel" placeholder="Mobile number" maxlength="20" aria-label="Mobile number">'
      +'<p class="pvp-m" aria-live="polite"></p><button class="pvp-go" type="submit">'+AP+'Pay <span class="pvp-a"></span></button></form>'
      +'<div class="pvp-l" aria-label="Payment methods"><span>'+AP.replace('<svg ','<svg class="ap" ')+'Pay</span><span>'+G+'Pay</span><span class="visa">VISA</span><span>'+MC+'<em>mastercard</em></span><span class="st">stitch</span></div>'
      +'<p class="pvp-f">Monthly · excl. VAT · <a href="'+root+'legal.html#refunds">Terms &amp; cancellations</a></p></div>';
    var $=function(s){return box.querySelector(s)};
    function pick(t){cur=t;$('.pvp-a').textContent=fmt(T[t].p);box.querySelectorAll('.pvp-t button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.t===t)})}
    function setDep(d){dep=d;box.querySelectorAll('.pvp-s button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.d===d)})}
    function begin(){if(started)return;started=true;ev('begin_checkout',{item_name:'POV Program '+T[cur].n,value:T[cur].p,currency:'ZAR'},'InitiateCheckout')}
    box.querySelectorAll('.pvp-t button').forEach(function(b){b.addEventListener('click',function(){pick(b.dataset.t);begin()})});
    box.querySelectorAll('.pvp-s button').forEach(function(b){b.addEventListener('click',function(){setDep(b.dataset.d)})});
    box.querySelectorAll('input').forEach(function(i){i.addEventListener('focus',begin)});
    pick(cur);setDep(dep);
    box._pick=pick;
    $('form').addEventListener('submit',function(e){e.preventDefault();var g=function(f){return $('[data-f='+f+']').value.trim()},m=$('.pvp-m');
      if(!g('dl')||!g('nm')||!g('ph')){m.style.color='#f2a08a';m.textContent='Please fill in all three.';return}
      m.textContent='';var x=T[cur];
      ev('add_payment_info',{item_name:'POV Program '+x.n,value:x.p,currency:'ZAR'},'AddPaymentInfo');
      var link=(window.POV_PROGRAM_PAY||{})[cur];
      if(link){location.href=link;return}
      var tag=attr.utm_campaign?'\n[ad: '+attr.utm_campaign+']':'';
      var txt='Hi POV, I want POV Program.\n\n'+x.n+' ('+x.w+') '+fmt(x.p)+'/month\n'+dep+'\nDealership: '+g('dl')+'\nName: '+g('nm')+'\nMobile: '+g('ph')+'\n\nPlease send my Apple Pay link.'+tag;
      ev('generate_lead',{method:'program_checkout',value:x.p,currency:'ZAR'},'Lead');
      window.open('https://wa.me/27786880944?text='+encodeURIComponent(txt),'_blank','noopener');
      m.style.color='#9be3b4';m.textContent='Sent. Your Apple Pay link is on its way on WhatsApp.';
    });
  }
  function init(){document.querySelectorAll('[data-pov-pay]').forEach(mount);
    // any element with data-pick="tier" selects that tier and scrolls to the panel
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-pick]');if(!a)return;var box=document.querySelector('[data-pov-pay]');if(!box)return;e.preventDefault();box._pick&&box._pick(a.getAttribute('data-pick'));box.scrollIntoView({behavior:'smooth',block:'center'})});
    try{if(new URLSearchParams(location.search).get('buy')){var b=document.querySelector('[data-pov-pay]');if(b)setTimeout(function(){b.scrollIntoView({block:'center'})},300)}}catch(_){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
