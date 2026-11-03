/* POV Assistant: type a question, get an instant answer. Runs fully in the browser, no server needed. */
(function(){
  if(window.__povAsk)return;window.__povAsk=1;
  const inDiv=/\/divisions\//.test(location.pathname);
  const R=inDiv?'../':'';                 // path to site root
  const page=(location.pathname.split('/').pop()||'index.html').replace('.html','');

  // remember where you are, so an outside reload (e.g. a site update) brings you back here instead of the home page
  try{
    if(page!=='index')sessionStorage.setItem('pov_last',JSON.stringify({u:location.href.split('#')[0]+(location.hash||''),t:Date.now()}));
    else sessionStorage.removeItem('pov_last');
    addEventListener('hashchange',()=>{if(page!=='index')sessionStorage.setItem('pov_last',JSON.stringify({u:location.href,t:Date.now()}))});
    document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href')||'';
      if(/(^|\/)index\.html(#.*)?$/.test(h)){sessionStorage.setItem('pov_home','1');sessionStorage.removeItem('pov_last')}},true);
  }catch(_){}
  const WA='https://wa.me/27786880944?text=';
  const L=(href,t)=>'<a href="'+R+href+'">'+t+'</a>';
  const W=(t,msg)=>'<a href="'+WA+encodeURIComponent(msg||'Hi POV, I have a question.')+'" target="_blank" rel="noopener">'+t+'</a>';

  // ---- knowledge base: k = keywords/phrases, p = pages that get a boost ----
  const KB=[
  {k:['what is pov','about pov','who are you','what do you do','pov holdings','point of view','about the company'],a:'POV Holdings is a South African dealership content company. We shoot stock imagery, video and content for <b>100+ dealerships</b> across all 9 provinces, and run six divisions: Media, Performance, Collection, Program, Growth and Meta.'},
  {k:['divisions','services','what do you offer','offer','products','everything'],a:'Six divisions:<br>\u2022 '+L('divisions/media.html','POV Media')+': photography, video and content<br>\u2022 '+L('divisions/performance.html','POV Performance')+': sales training (powered by MiLife)<br>\u2022 '+L('divisions/collection.html','POV Collection')+': the Frame Tee<br>\u2022 '+L('divisions/program.html','POV Program')+': content system for salespeople<br>\u2022 '+L('divisions/growth.html','POV Growth')+': the POV Package course<br>\u2022 '+L('divisions/meta.html','POV Meta')+': Meta ads (with ConversionCo)'},
  {k:['where','area','areas','provinces','cape town','durban','johannesburg','pretoria','gauteng','nationwide','come to','travel','location'],a:'All of South Africa. POV has worked in all nine provinces, with photographers in Gauteng, Durban and Cape Town.'},
  {k:['package','packages','launch','impact','daily','price','pricing','cost','rates','fee','media package'],p:['index','media'],a:'Media packages are quoted per department after a short chat about your stock volume:<br>\u2022 <b>Launch</b>: photographer once a week, edited images uploaded, 24-hour turnaround<br>\u2022 <b>Impact</b>: everything in Launch plus content creation and video<br>\u2022 <b>Daily</b>: photographer on site daily, same-day stock, 30 HQ reels a month, 5 statics daily<br>'+L('index.html#contact','Get a quote')+' and we reply the same working day.'},
  {k:['how fast','turnaround','same day','live','quick','when','how long does it take','speed'],a:'On the Daily package, stock is shot from 09h00, edited on site and live on your website by 16h00\u201317h00 the same day. Video and content run on a 24-hour turnaround.'},
  {k:['upload','website upload','autotrader','cars.co.za','listings','load the images'],a:'Yes. Website uploading is included, so listings go live on your site (and are ready for Autotrader and Cars.co.za) without your team touching a file.'},
  {k:['video','reels','reel','walkaround','videography','content creation','tiktok','instagram content'],a:'We shoot walkarounds, presenter-led reviews and short reels, edited within 24 hours. See our reels on the '+L('index.html#reels','home page')+'.'},
  {k:['event','events','launch night','awards','function','coverage'],a:'We cover launch nights and awards evenings. We\'ve filmed the HMG Group Awards two years running. '+W('Ask about your event','Hi POV, I\'d like a quote for event coverage.')+'.'},
  {k:['salespeople get','whatsapp group','share images','sales team images','receive the images'],a:'Finished images go into a WhatsApp group your whole sales team can use straight away.'},
  {k:['quote','get a quote','enquiry','enquire','book','booking','sign up','start'],a:'Send us your name, number and dealership on the '+L('index.html#contact','quote form')+' or '+W('WhatsApp us','Hi POV, I\'d like a quote.')+'. We reply the same working day. Quotes are valid for 7 days.'},
  {k:['contact','phone','number','call','email','whatsapp','reach','talk to someone','human','speak'],a:'Call or WhatsApp <b>078 688 0944</b>, or email <b>info@povholdings.co.za</b>. '+W('Open WhatsApp')+'.'},
  {k:['vat','tax','taxes','invoice'],a:'Any applicable taxes are shown on your quote.'},
  {k:['valid','expire','quote valid'],a:'Quotes are valid for 7 days from the date they\'re issued.'},
  {k:['performance','coaching','sales training','training','milife','coach','salesperson training','sales team training','profiling','personality'],p:['performance'],a:'<b>POV Performance</b> is personalised automotive sales training with measurable results. We profile each salesperson, develop 8 core sales skills on the floor, then keep it going on <b>MiLife</b>, our platform for online learning, daily activity tracking and weekly management reports. Quoted per dealership after an introductory meeting. '+L('divisions/performance.html','See POV Performance')+'.'},
  {k:['feedback','did salespeople like','results of training','rating','testimonials performance','what did the team say'],p:['performance'],a:'From our 29 October 2026 POV Performance session, 100% of salespeople rated it 5 out of 5, and 100% would recommend it to other dealerships. '+L('divisions/performance.html#feedback','Read what they said')+'.'},
  {k:['new salespeople','new sales executives','onboard','new talent'],p:['performance'],a:'POV Performance has a programme for new sales executives: profiling from day one, core sales skills and MiLife templates for calls, email and WhatsApp. '+L('divisions/performance.html#pricing','See programmes')+'.'},
  {k:['managers see','reporting','report','visibility','track'],p:['performance'],a:'With MiLife, management gets weekly insights into each salesperson\'s activity, development and progress. '+L('divisions/performance.html#milife','See MiLife')+'.'},
  {k:['meta','ads','facebook ads','instagram ads','advertising','leads','lead generation','conversionco','marketing','campaign'],p:['meta'],a:'<b>POV Meta</b> runs Facebook and Instagram ads with <b>ConversionCo</b>: WhatsApp leads for dealerships and sales for online stores. Flat monthly management fee; ad budget from about R100 a day for leads, R250\u2013R500 a day for stores, paid directly to Meta. '+L('divisions/meta.html','See POV Meta')+'.'},
  {k:['private shoot','private shoots','photoshoot','photo shoot','shoot my car','personal shoot','car shoot','book a shoot'],p:['media'],a:'Yes. POV does <b>private shoots</b> for car owners, creators and businesses: photos and reels you can post or run as ads. Quoted per shoot. '+L('divisions/media.html#overview','See private shoots')+' or '+W('book on WhatsApp','Hi POV, I\'d like to book a private shoot.')+'.'},
  {k:['ad budget','how much to spend','spend'],a:'From about R100 a day for lead generation. For online stores, R250 to R500 a day is a good start. The budget is paid straight to Meta.'},
  {k:['website','shopify','online store','build a site','web design','ecommerce'],a:'Websites and Shopify stores are built through our partner ConversionCo, usually live within one to two weeks of getting your content. '+L('divisions/meta.html','See POV Meta')+'.'},
  {k:['program','content system','content plan','app','ideas','what to post'],p:['program'],a:'<b>POV Program</b> is a content system for dealership salespeople: daily content plans and ideas so the team can shoot and post from their phones every day. Quoted per salesperson, dealership or group. '+L('divisions/program.html','See POV Program')+'.'},
  {k:['course','pov package','growth','learn','teach','training course','online course','r1999','r1 999','1999','price','cost','pricing'],p:['growth'],a:'<b>The POV Package</b> is Robert\'s course on earning with the camera in your pocket: 6 modules covering earning from your phone, professional content, social media, client skills and objections, Meta ads and scaling. <b>R1 999 once-off</b> (normally R2 999), instant lifetime access. '+L('divisions/growth.html','Get the POV Package')+'.'},
  {k:['modules','whats inside','what is inside','curriculum','lessons','topics'],p:['growth'],a:'Six modules: 1) Start earning from your phone 2) Professional content made easy 3) Social media that brings clients 4) Client skills & objection handling 5) Meta ads 6) Scaling a content & camera business.'},
  {k:['camera','equipment','gear','iphone','need a camera'],p:['growth'],a:'No professional camera needed. The POV Package is built around the phone you already have and covers when extra gear is worth it.'},
  {k:['mentorship','one on one','1 on 1','personal coaching','mentor'],p:['growth'],a:'The POV Package isn\'t one-on-one mentorship. It\'s a step-by-step guideline you follow at your own pace. For dealership team coaching, see '+L('divisions/performance.html','POV Performance')+'.'},
  {k:['access','lifetime','how long access','forever','updates'],p:['growth'],a:'Access is for life, including every future update to the course.'},
  {k:['tee','t-shirt','tshirt','shirt','clothing','collection','merch','frame tee','apparel','price','cost','pricing'],p:['collection'],a:'<b>The Frame Tee</b>: heavyweight, oversized, with tonal POV embroidery and a "See it differently." patch. Now <b>R599</b> (was <s>R749.99</s>). Ranges: <b>Executive</b> (black), <b>Ivory</b> (white) and <b>Greyston</b> (grey), sizes S to XL. '+L('divisions/collection.html#buy','Shop the Frame Tee')+'.'},
  {k:['size','sizes','fit','sizing','small','medium','large','xl','oversized'],p:['collection'],a:'Sizes S, M, L and XL. The Frame Tee has an oversized fit. Between sizes? '+W('WhatsApp us','Hi POV, which Frame Tee size should I get? My height is ')+' your height and usual size and we\'ll help.'},
  {k:['colour','color','colours','black','white','grey','executive','ivory','greyston','range','ranges'],p:['collection'],a:'Three ranges: <b>Executive</b> (black), <b>Ivory</b> (white) and <b>Greyston</b> (grey).'},
  {k:['delivery','shipping','courier','deliver','postage','ship','delivery cost','how much is delivery','delivery fee'],a:'We deliver anywhere in South Africa. Delivery cost and timing are confirmed with your order.'},
  {k:['return','returns','refund','refunds','exchange','money back','cancel','exchange my','return my','can i return','can i exchange'],p:['collection','growth','legal'],a:'Clothing: return unworn within 7 days of delivery for a full refund. POV Package: full refund within 7 days if you haven\'t opened the course. Services: 30 days\' notice. '+L('legal.html#refunds','Refund policy')+'.'},
  {k:['pay','payment','card','eft','checkout','how do i buy','order','buy','purchase'],a:'Tap Order or Get instant access on the product page. Your order is confirmed on WhatsApp and you pay securely. Card checkout is coming soon.'},
  {k:['team order','bulk','dealership order','uniform','staff shirts'],p:['collection'],a:'Team orders are welcome. '+W('WhatsApp us','Hi POV, I\'d like a team order of Frame Tees.')+' and we\'ll sort sizes and quantities for everyone.'},
  {k:['discount','sale','special','promo','coupon','deal','cheaper'],a:'The Frame Tee is on special at <b>R599</b> (was R749.99), and the POV Package is <b>R1 999</b> (normally R2 999).'},
  {k:['stock imagery','brands','which brands','audi','volkswagen','vw','jetour','haval','ford'],a:'We\'ve shot stock for Audi, Volkswagen, Jetour, Haval, Ford, Omoda & Jaecoo, Chery, Geely, Mazda, Suzuki and more. '+L('divisions/media.html#stock','See stock imagery')+'.'},
  {k:['clients','who have you worked','dealerships you work','references','portfolio','work with'],a:'Clients include Hatfield Motor Group (120+ departments), McCarthy Group, Fouch\u00e9 Motors Sandton, Ferrari Johannesburg, GAC & JMC, Audi Centre Hatfield and Jetour Menlyn. '+L('divisions/media.html#album','See the album')+'.'},
  {k:['robert','founder','owner','ceo','who started','denny'],a:'POV was founded by <b>Robert Denny</b>. He tried 7 business models before POV, which now has a team of 15 serving 100+ clients a month, built on word of mouth.'},
  {k:['registration','registered','company number','cipc','reg number','legal name','pty','company details'],a:'POV Holdings trades as <b>Point of View Holdings (Pty) Ltd</b>, registration number <b>2024/130036/07</b>. '+L('legal.html#company','Company info')+'.'},
  {k:['privacy','data','popia','personal information','cookies','unsubscribe'],a:'We follow POPIA and never sell your data. '+L('legal.html#privacy','Privacy policy')+' \u00b7 '+L('legal.html#cookies','Cookies')+'.'},
  {k:['book a visit','dealership visit','visit our dealership','come to our dealership','meeting','book a meeting','for dealerships','dealer principal'],p:['dealers'],a:'Book a dealership visit and we\'ll come to you: '+L('divisions/dealers.html#book','Book a visit')+'. Pick a day and what you\'re interested in, and we confirm on WhatsApp.'},
  {k:['salesperson','i sell cars','car salesman','sales executive','for salespeople','which one is for me'],p:['sales'],a:'For salespeople: '+L('divisions/program.html','POV Program')+' for daily content and leads, the '+L('divisions/growth.html','POV Package')+' course (R1 999) to earn from your phone, and the '+L('divisions/collection.html','Frame Tee')+' (R599). '+L('divisions/sales.html#pick','Find your lane')+'.'},
  {k:['review','reviews','testimonial','feedback'],a:'Read or leave a review on the '+L('index.html#reviews','home page')+'.'},
  {k:['job','jobs','work for','vacancy','apply','photographer job','join the team'],a:'Want to work with POV? '+W('WhatsApp us','Hi POV, I\'d like to work with POV.')+' with a bit about yourself and your work.'},
  {k:['hello','hi','hey','howzit','good morning','good afternoon','sawubona','molo'],a:'Hi! Ask me anything about POV: packages, the POV Package course, the Frame Tee, delivery, coaching or ads.'},
  {k:['thanks','thank you','cool','awesome','great','shot'],a:'Pleasure! Anything else? You can also '+W('chat to the team on WhatsApp')+'.'}
  ];
  const SUG={index:['What do your packages cost?','How fast do cars go live?','What is the POV Package?','How do I get a quote?'],
    media:['What do your packages cost?','Do you upload to our website?','Which areas do you cover?'],
    performance:['What is POV Performance?','What is MiLife?','What do managers see?'],
    collection:['What sizes do you have?','Do you deliver?','Can I return it?','Is there a discount?'],
    program:['What is POV Program?','How do I get a quote?'],
    growth:['What\'s inside the course?','Do I need a camera?','Can I get a refund?','How long is access?'],
    meta:['How much ad budget do I need?','Do you build websites?','What is POV Meta?'],
    dealers:['How do I book a visit?','What do your packages cost?','Which areas do you cover?'],
    sales:['Which one is for me?','What is the POV Package?','What is POV Program?'],
    legal:['How do refunds work?','How do you use my data?']};

  const norm=t=>(' '+t.toLowerCase().replace(/[\u2019']/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ')+' ');
  const STOP=new Set('a an the is are do does you your i me my we our it to of for on in and or can how what whats which who where when with about there have has be any much get'.split(' '));
  function answer(q){
    const n=norm(q),words=n.trim().split(' ').filter(w=>w&&!STOP.has(w));let best=null,bs=0;
    KB.forEach(e=>{let s=0;
      e.k.forEach(k=>{const kn=norm(k);if(kn.trim().includes(' ')){if(n.includes(kn))s+=4}else{const kw=kn.trim();if(n.includes(' '+kw+' '))s+=2.4;else if(kw.length>4&&words.some(w=>w.startsWith(kw.slice(0,5))||kw.startsWith(w)&&w.length>3))s+=1.2}});
      if(s&&e.p&&e.p.includes(page))s+=1.5;
      if(s>bs){bs=s;best=e}});
    return bs>=1.2?best.a:null;
  }

  // ---- UI ----
  const css=`.pa-btn{position:fixed;z-index:70;right:18px;bottom:calc(22px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:10px;height:54px;padding:0 20px 0 16px;border-radius:999px;border:0;cursor:pointer;background:#0d0d0f;color:#fff;font:700 14px/1 Manrope,system-ui,sans-serif;box-shadow:0 0 0 1px #ff8c1a,0 0 22px -4px rgba(255,140,26,.6),0 16px 40px -10px rgba(0,0,0,.8);transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.pa-btn:hover{transform:translateY(-2px)}.pa-btn svg{width:22px;height:22px;stroke:#ff8c1a;fill:none;stroke-width:1.8}
.pa-btn i{position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:#ff8c1a;box-shadow:0 0 0 3px #0d0d0f;font-style:normal}
body:has(.sbar) .pa-btn,body:has(.mbar) .pa-btn{bottom:calc(92px + env(safe-area-inset-bottom,0px))}
@media (max-width:820px){.pa-btn{bottom:calc(92px + env(safe-area-inset-bottom,0px));right:14px;height:50px;padding:0 16px 0 14px}.pa-btn span{display:none}}
.pa{position:fixed;z-index:90;right:18px;bottom:calc(22px + env(safe-area-inset-bottom,0px));width:min(390px,calc(100vw - 24px));height:min(600px,calc(100vh - 120px));display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:#111114;box-shadow:0 0 0 1px rgba(255,140,26,.55),0 30px 90px rgba(0,0,0,.75);opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .3s,transform .35s cubic-bezier(.2,.8,.2,1);font-family:Manrope,system-ui,sans-serif}
.pa.on{opacity:1;transform:none;pointer-events:auto}
@media (max-width:560px){.pa{right:12px;left:12px;width:auto;bottom:calc(12px + env(safe-area-inset-bottom,0px));height:min(78vh,620px)}}
.pa-h{display:flex;align-items:center;gap:12px;padding:16px 16px 14px;border-bottom:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,#18181c,#111114)}
.pa-av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#0d0d0f;box-shadow:0 0 0 1px #ff8c1a;font:600 15px/1 Georgia,serif;color:#fff}
.pa-h b{display:block;color:#fff;font-size:15px}.pa-h small{color:#8fd19e;font-size:12px}.pa-h small::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#5fd27a;margin-right:6px}
.pa-x{margin-left:auto;width:36px;height:36px;border-radius:50%;border:0;background:#1d1d21;color:#fff;font-size:20px;cursor:pointer}
.pa-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.pa-m{max-width:86%;padding:11px 14px;border-radius:18px;font-size:14.5px;line-height:1.5;color:#e8e4da;background:#1c1c21;border-bottom-left-radius:6px;animation:paIn .3s cubic-bezier(.2,.8,.2,1)}
.pa-m.me{align-self:flex-end;background:#ff8c1a;color:#0d0d0f;font-weight:600;border-radius:18px;border-bottom-right-radius:6px}
.pa-m a{color:#ffb066;text-decoration:underline;text-underline-offset:3px}
.pa-m s{color:#8d8980}
.pa-dots{display:inline-flex;gap:4px}.pa-dots i{width:6px;height:6px;border-radius:50%;background:#8d8980;animation:paD 1s infinite}.pa-dots i:nth-child(2){animation-delay:.15s}.pa-dots i:nth-child(3){animation-delay:.3s}
@keyframes paD{0%,60%,100%{opacity:.3}30%{opacity:1}}@keyframes paIn{from{opacity:0;transform:translateY(6px)}}
.pa-sug{display:flex;gap:8px;flex-wrap:wrap;padding:0 16px 10px}
.pa-sug button{border:0;cursor:pointer;padding:9px 12px;border-radius:999px;background:transparent;color:#e8e4da;font:600 12.5px/1 Manrope,system-ui,sans-serif;box-shadow:0 0 0 1px rgba(255,140,26,.45)}
.pa-sug button:hover{background:rgba(255,140,26,.12)}
.pa-f{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08);background:#0d0d0f}
.pa-f input{flex:1;min-width:0;height:48px;border-radius:999px;border:0;background:#1c1c21;color:#fff;padding:0 18px;font:500 16px Manrope,system-ui,sans-serif;outline:none;box-shadow:0 0 0 1px rgba(255,255,255,.1)}
.pa-f input:focus{box-shadow:0 0 0 1px #ff8c1a}
.pa-f button{width:48px;height:48px;border-radius:50%;border:0;cursor:pointer;background:#ff8c1a;display:grid;place-items:center}
.pa-f button svg{width:20px;height:20px;stroke:#0d0d0f;fill:none;stroke-width:2.2}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const btn=document.createElement('button');btn.className='pa-btn';btn.type='button';btn.setAttribute('aria-label','Ask POV a question');
  btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg><span>Ask POV</span><i></i>';
  const box=document.createElement('div');box.className='pa';box.setAttribute('role','dialog');box.setAttribute('aria-label','Ask POV');box.setAttribute('aria-hidden','true');
  box.innerHTML='<div class="pa-h"><span class="pa-av">POV</span><div><b>Ask POV</b><small>Instant answers</small></div><button class="pa-x" type="button" aria-label="Close">\u00d7</button></div><div class="pa-log" aria-live="polite"></div><div class="pa-sug"></div><form class="pa-f"><input type="text" placeholder="Type your question\u2026" aria-label="Your question" maxlength="200" autocomplete="off"><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></form>';
  document.body.appendChild(btn);document.body.appendChild(box);
  const log=box.querySelector('.pa-log'),sug=box.querySelector('.pa-sug'),inp=box.querySelector('input');
  const add=(h,me)=>{const d=document.createElement('div');d.className='pa-m'+(me?' me':'');if(me)d.textContent=h;else d.innerHTML=h;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
  const track=(e,p)=>{try{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:e},p||{}))}catch(_){}};
  let greeted=false;
  const open=()=>{box.classList.add('on');box.setAttribute('aria-hidden','false');btn.style.display='none';
    if(!greeted){greeted=true;add('Hi! I\'m the POV assistant. Ask me anything about our packages, the POV Package course, the Frame Tee, delivery, coaching or ads.');
      sug.innerHTML=(SUG[page]||SUG.index).map(s=>'<button type="button">'+s+'</button>').join('');
      sug.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>ask(b.textContent)))}
    setTimeout(()=>inp.focus({preventScroll:true}),250);track('assistant_open',{page})};
  const close=()=>{box.classList.remove('on');box.setAttribute('aria-hidden','true');btn.style.display=''};
  function ask(q){q=q.trim();if(!q)return;add(q,true);inp.value='';sug.innerHTML='';
    const t=add('<span class="pa-dots"><i></i><i></i><i></i></span>');
    setTimeout(()=>{const a=answer(q);
      t.innerHTML=a||('Good question. I don\'t have that answer yet, but the team does. '+W('Ask it on WhatsApp',"Hi POV, "+q)+' and we\'ll reply the same working day.');
      log.scrollTop=log.scrollHeight;track('assistant_question',{page,answered:!!a})},380)}
  btn.addEventListener('click',open);box.querySelector('.pa-x').addEventListener('click',close);
  box.querySelector('form').addEventListener('submit',e=>{e.preventDefault();ask(inp.value)});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('on'))close()});
  window.POVAsk={open,ask,answer};
})();
