(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const actions=$('.actions');
  if(!actions || $('#currencySelect')) return;

  const style=document.createElement('style');
  style.textContent=`
    .currency-switch{display:flex;align-items:center;gap:6px;padding:5px 7px 5px 10px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.46)}
    .currency-label{font:700 8px "IBM Plex Mono",monospace;color:var(--muted);letter-spacing:.05em;text-transform:uppercase}
    .currency-switch select{border:0;background:transparent;color:var(--ink);font:800 10px Manrope,system-ui;outline:0;padding:3px 14px 3px 2px}
    .fx-note{display:block;margin-top:10px;font-size:8px;line-height:1.55;color:var(--muted)}
    .rtl .currency-switch{padding:5px 10px 5px 7px}
    @media(max-width:760px){.currency-label{display:none}.currency-switch{padding:5px 6px}.currency-switch select{padding-right:9px}.topbar .actions{gap:5px}.lang{padding:8px 9px}}
  `;
  document.head.appendChild(style);

  const box=document.createElement('label');
  box.className='currency-switch';
  box.innerHTML='<span class="currency-label"><span class="en">Currency</span><span class="ar">العملة</span></span><select id="currencySelect" aria-label="Display currency"><option value="JOD">JOD</option><option value="USD">USD</option><option value="EUR">EUR</option></select>';
  actions.insertBefore(box,$('#lang'));

  const select=$('#currencySelect');
  const saved=localStorage.getItem('hx-invest-currency');
  if(['JOD','USD','EUR'].includes(saved)) select.value=saved;

  let rates={JOD:1,USD:1.4104,EUR:1.20};

  const convert=(amount,c)=>c==='JOD'?amount:amount*rates[c];
  const money=(value,c)=>c==='JOD'?`JOD ${Math.round(value).toLocaleString('en-US')}`:`${c==='USD'?'$':'€'}${Math.round(value).toLocaleString('en-US')}`;
  const compact=(value,c)=>{
    if(c==='JOD') return `JOD ${(value/1000).toFixed(value%1000?1:0)}K`;
    const symbol=c==='USD'?'$':'€';
    return `${symbol}${(value/1000).toFixed(1)}K`;
  };

  function renderStatic(c){
    const hero=$('.hero-stats > span:first-child > b');
    if(hero) hero.textContent=compact(convert(50000,c),c);

    const roundTotal=$('.round-hero h2');
    if(roundTotal) roundTotal.textContent=money(convert(50000,c),c);

    const slotPrice=$('.slot-price b');
    if(slotPrice) slotPrice.textContent=money(convert(2000,c),c);

    const slotMath=$('.slot-price > span');
    if(slotMath){
      const each=money(convert(2000,c),c);
      const total=money(convert(50000,c),c);
      slotMath.textContent=`25 × ${each} = ${total}`;
    }

    const cap=$$('.terms article').find(a=>a.querySelector('small')?.textContent.trim()==='AGGREGATE CAP')?.querySelector('b');
    if(cap) cap.textContent=money(convert(125000,c),c);

    const allocation=[30000,7500,5000,5000,2500];
    $$('.alloc article small').forEach((el,i)=>{
      if(allocation[i]!=null) el.textContent=money(convert(allocation[i],c),c);
    });
  }

  function renderCalculator(c){
    const slotRange=$('#slotRange'), revRange=$('#revRange');
    if(!slotRange||!revRange) return;
    const slots=Number(slotRange.value||1);
    const revenueJod=Number(revRange.value||300000);
    const investmentJod=slots*2000;
    const poolJod=Math.min(revenueJod*.25,125000);
    const distributionJod=poolJod*(slots/25);
    const netJod=distributionJod-investmentJod;
    const multiple=distributionJod/investmentJod;

    const revOut=$('#revOut'), investRes=$('#investRes'), poolRes=$('#poolRes'), distRes=$('#distRes');
    if(revOut) revOut.textContent=money(convert(revenueJod,c),c);
    if(investRes) investRes.textContent=money(convert(investmentJod,c),c);
    if(poolRes) poolRes.textContent=money(convert(poolJod,c),c);
    if(distRes) distRes.textContent=money(convert(distributionJod,c),c);

    const detail=distRes?.parentElement?.querySelector('.calc-detail');
    if(detail){
      const net=money(Math.abs(convert(netJod,c)),c);
      detail.textContent=document.body.classList.contains('rtl')
        ? `${netJod>=0?'+':'−'}${net} صافي · ${multiple.toFixed(2)}× إجمالي المبلغ المستلم`
        : `${netJod>=0?'+':'−'}${net} net · ${multiple.toFixed(2)}× total cash returned`;
    }
  }

  function render(){
    const c=select.value;
    localStorage.setItem('hx-invest-currency',c);
    renderStatic(c);
    renderCalculator(c);
    window.hxDisplayCurrency=c;
    window.hxFxRates=rates;
  }

  select.addEventListener('change',render);
  $('#slotRange')?.addEventListener('input',()=>setTimeout(render,0));
  $('#revRange')?.addEventListener('input',()=>setTimeout(render,0));
  $('#lang')?.addEventListener('click',()=>setTimeout(render,0));
  render();

  const note=document.createElement('small');
  note.className='fx-note';
  note.innerHTML='<span class="en">Investment terms remain denominated in JOD. USD/EUR values are display conversions only.</span><span class="ar">تبقى شروط الاستثمار مقوّمة بالدينار الأردني. قيم الدولار واليورو هي تحويلات للعرض فقط.</span>';
  ($('#round .wrap')||$('#round'))?.appendChild(note);

  fetch('https://open.er-api.com/v6/latest/JOD',{cache:'no-store'})
    .then(r=>r.ok?r.json():Promise.reject())
    .then(data=>{
      if(data?.rates?.USD&&data?.rates?.EUR){
        rates={JOD:1,USD:Number(data.rates.USD),EUR:Number(data.rates.EUR)};
        render();
      }
    })
    .catch(()=>{});
})();
