(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const body=document.body, html=document.documentElement, langBtn=$('#lang');
  let language=localStorage.getItem('hx-invest-lang')||'en';

  function applyClarifications(){
    const capCard=$$('.terms article').find(card=>card.querySelector('small')?.textContent.trim()==='AGGREGATE CAP');
    const capText=capCard?.querySelector('p');
    if(capText){
      capText.innerHTML='<span class="en">maximum aggregate amount distributable to the investor pool, including the return of original invested capital — not JOD 125K profit on top of capital.</span><span class="ar">أقصى إجمالي مبلغ يمكن توزيعه على مجموعة المستثمرين، ويشمل أصل رأس المال المستثمر — وليس 125 ألف دينار أرباحاً فوق رأس المال.</span>';
    }
    const humanCopy=$('.human-head > p');
    if(humanCopy){
      humanCopy.innerHTML='<span class="en">HorizonX is not trying to remove humans. It is removing repetitive human work so people can stay focused on quality, customer relationships, sales and consequential decisions.</span><span class="ar">HorizonX لا تحاول إزالة البشر؛ بل إزالة العمل البشري المتكرر حتى يتركز دور الفريق على الجودة وعلاقات العملاء والمبيعات والقرارات المهمة.</span>';
    }
  }

  function applyLeadershipImages(){
    $$('img[alt="Abdelrhman AlQudah"]').forEach(img=>{img.src='/assets/abdullah.jpg';});
    $$('img[alt="Abdullah AlQudah"]').forEach(img=>{img.src='/assets/abdelrhman.jpg';});
  }

  function applyProductProof(){
    const proof=$('.proof-image img');
    if(proof){
      proof.src='/assets/product-proof.svg';
      proof.alt='Xability product surfaces: wallet, calendar, library, social connections, reports, approvals and campaigns';
    }
    const caption=$('.proof-image figcaption');
    if(caption){
      caption.innerHTML='<span class="en">Representative product surfaces based on current Xability client workflows: wallet & credits, content calendar, asset library, social connections, performance reports, approvals and campaigns.</span><span class="ar">واجهات تمثيلية مبنية على مسارات Xability الحالية: المحفظة والكريديت، تقويم المحتوى، مكتبة الأصول، ربط الحسابات الاجتماعية، تقارير الأداء، الموافقات والحملات.</span>';
    }
  }

  function applyLang(){
    const ar=language==='ar';
    body.classList.toggle('rtl',ar);
    html.lang=ar?'ar':'en';
    html.dir=ar?'rtl':'ltr';
    if(langBtn) langBtn.textContent=ar?'English':'العربية';
    localStorage.setItem('hx-invest-lang',language);
  }

  applyClarifications();
  applyLeadershipImages();
  applyProductProof();
  applyLang();

  const slots=$('#slots');
  for(let i=1;i<=25;i++){
    const el=document.createElement('span');
    el.textContent=String(i).padStart(2,'0');
    slots?.appendChild(el);
  }

  const slotRange=$('#slotRange'), revRange=$('#revRange'), slotOut=$('#slotOut'), revOut=$('#revOut'), investRes=$('#investRes'), poolRes=$('#poolRes'), distRes=$('#distRes');
  const fmt=n=>`JOD ${Math.round(n).toLocaleString('en-US')}`;
  let distDetail=null;
  if(distRes?.parentElement){
    distDetail=document.createElement('span');
    distDetail.className='calc-detail';
    distRes.parentElement.appendChild(distDetail);
  }

  function calc(){
    if(!slotRange||!revRange)return;
    const s=+slotRange.value, r=+revRange.value;
    const investment=s*2000;
    const pool=Math.min(r*.25,125000);
    const distribution=pool*(s/25);
    const net=distribution-investment;
    const multiple=distribution/investment;
    if(slotOut)slotOut.textContent=s;
    if(revOut)revOut.textContent=fmt(r);
    if(investRes)investRes.textContent=fmt(investment);
    if(poolRes)poolRes.textContent=fmt(pool);
    if(distRes)distRes.textContent=fmt(distribution);
    if(distDetail){
      const netText=`${net>=0?'+':'−'}${fmt(Math.abs(net))} net · ${multiple.toFixed(2)}× total cash returned`;
      const netAr=`${net>=0?'+':'−'}${fmt(Math.abs(net))} صافي · ${multiple.toFixed(2)}× إجمالي المبلغ المستلم`;
      distDetail.textContent=language==='ar'?netAr:netText;
    }
  }
  slotRange?.addEventListener('input',calc);
  revRange?.addEventListener('input',calc);
  calc();

  langBtn?.addEventListener('click',()=>{
    language=language==='en'?'ar':'en';
    applyLang();
    calc();
  });

  const meetingForm=$('#meetingForm');
  meetingForm?.addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(meetingForm);
    const lines=[
      'HorizonX Investor Meeting Request','',
      `Name: ${d.get('name')||''}`,
      `Country: ${d.get('country')||''}`,
      `Phone: ${d.get('phone')||''}`,
      `Email: ${d.get('email')||''}`,
      `Investment interest: ${d.get('interest')||''}`,'',
      `Notes: ${d.get('notes')||''}`
    ];
    const subject='HorizonX Investment Meeting Request';
    window.location.href=`mailto:digital.horizonx.tek@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });

  const canvas=$('#runner'), ctx=canvas?.getContext('2d'), overlay=$('#gameOverlay'), play=$('#play'), skip=$('#skip'), milestone=$('#milestone');
  if(!canvas||!ctx)return;

  const S={running:false,over:false,score:0,speed:7.35,frame:0,w:1100,h:320,ground:265,next:105,player:{x:175,y:219,vy:0,size:45,on:true},ghost:{x:70},obstacles:[]};
  const marks=[
    [0,'BUILD'],
    [150,'1 YEAR OF LEARNING'],
    [330,'LIVE SAAS PRODUCT'],
    [520,'125 CUSTOMER EXPERIENCES'],
    [720,'SALES TEAM READY'],
    [950,'MENA'],
    [1300,'5,000 ACTIVE CLIENT MISSION']
  ];

  function resize(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
    S.w=Math.max(320,r.width);
    S.h=Math.max(215,Math.min(335,S.w*.3));
    canvas.width=Math.round(S.w*d);canvas.height=Math.round(S.h*d);
    ctx.setTransform(d,0,0,d,0,0);S.ground=S.h-48;
    if(!S.running)S.player.y=S.ground-S.player.size;
  }
  function reset(){S.score=0;S.speed=7.35;S.frame=0;S.over=false;S.next=90;S.obstacles=[];S.player.y=S.ground-S.player.size;S.player.vy=0;S.player.on=true}
  function drawX(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.fillStyle='#091f4d';ctx.beginPath();ctx.moveTo(2,3);ctx.lineTo(15,3);ctx.lineTo(s/2,s*.37);ctx.lineTo(s-15,3);ctx.lineTo(s-2,3);ctx.lineTo(s*.62,s/2);ctx.lineTo(s-2,s-3);ctx.lineTo(s-15,s-3);ctx.lineTo(s/2,s*.63);ctx.lineTo(15,s-3);ctx.lineTo(2,s-3);ctx.lineTo(s*.38,s/2);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.font=`800 ${Math.floor(s*.25)}px Manrope`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('X',s/2,s/2);ctx.restore();
  }
  function drawGhost(x,y,t){
    ctx.save();ctx.translate(x,y+Math.sin(t/12)*4);ctx.fillStyle='#f9351a';ctx.beginPath();ctx.arc(18,18,17,Math.PI,0);ctx.lineTo(35,46);ctx.lineTo(27,40);ctx.lineTo(19,46);ctx.lineTo(10,40);ctx.lineTo(2,46);ctx.lineTo(2,18);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(12,17,3,0,Math.PI*2);ctx.arc(24,17,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#091f4d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(33,37);ctx.lineTo(49,25);ctx.stroke();ctx.strokeStyle='#757b86';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(48,25);ctx.lineTo(58,17);ctx.stroke();ctx.restore();
  }
  function spawn(){const tall=Math.random()>.55;S.obstacles.push({x:S.w+25,w:tall?22:36,h:tall?56:34,label:Math.random()>.5?'TIME':'NOISE'});S.next=S.frame+80+Math.floor(Math.random()*80)}
  function start(){reset();S.running=true;overlay?.classList.add('hidden');if(play)play.innerHTML=language==='ar'?'<span class="ar">إعادة</span>':'<span class="en">RESTART</span>'}
  function end(){S.running=false;S.over=true;overlay?.classList.remove('hidden');const b=overlay?.querySelector('b');if(b)b.innerHTML=language==='ar'?'<span class="ar">الوقت لحق بك. أعد المحاولة — أو أكمل قصة الاستثمار.</span>':'<span class="en">Time caught you. Run again — or continue the investment story.</span>'}
  function jump(){if(!S.running){start();return}if(S.player.on){S.player.vy=-12.2;S.player.on=false}}

  play?.addEventListener('click',start);
  skip?.addEventListener('click',()=>$('#why')?.scrollIntoView({behavior:'smooth'}));
  canvas.addEventListener('pointerdown',jump);
  addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump()}});
  addEventListener('resize',resize);
  resize();reset();

  function frame(){
    ctx.clearRect(0,0,S.w,S.h);
    ctx.fillStyle='rgba(2,131,147,.055)';ctx.beginPath();ctx.arc(S.w*.82,S.h*.35,80,0,Math.PI*2);ctx.fill();
    ctx.setLineDash([6,8]);ctx.strokeStyle='rgba(9,31,77,.16)';ctx.beginPath();ctx.moveTo(0,S.ground);ctx.lineTo(S.w,S.ground);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#091f4d';ctx.font='600 10px IBM Plex Mono';ctx.textAlign='right';ctx.fillText(`SCORE ${String(Math.floor(S.score)).padStart(5,'0')}`,S.w-16,25);
    drawGhost(S.ghost.x,S.ground-46,S.frame);
    for(const o of S.obstacles){ctx.fillStyle='#028393';ctx.fillRect(o.x,S.ground-o.h,o.w,o.h);ctx.fillStyle='#fff';ctx.font='700 7px IBM Plex Mono';ctx.save();ctx.translate(o.x+o.w/2,S.ground-o.h/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText(o.label,0,2);ctx.restore()}
    drawX(S.player.x,S.player.y,S.player.size);
    if(S.running){
      S.frame++;S.score+=.74+S.speed*.019;S.speed=Math.min(13.6,7.35+S.score/560);S.player.vy+=.68;S.player.y+=S.player.vy;
      if(S.player.y>=S.ground-S.player.size){S.player.y=S.ground-S.player.size;S.player.vy=0;S.player.on=true}
      if(S.frame>=S.next)spawn();
      S.obstacles.forEach(o=>o.x-=S.speed);S.obstacles=S.obstacles.filter(o=>o.x>-60);
      const px=S.player.x+5,py=S.player.y+5,ps=S.player.size-10;
      for(const o of S.obstacles){if(px<o.x+o.w&&px+ps>o.x&&py<S.ground&&py+ps>S.ground-o.h){end();break}}
      let m=marks[0][1];for(const [n,l] of marks)if(S.score>=n)m=l;if(milestone)milestone.textContent=m;
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
