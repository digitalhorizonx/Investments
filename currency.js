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
  const targets=[];
  const add=(selector,amount,format)=>$$(selector).forEach(el=>targets.push({el,amount,format}));

  add('.hero-stats > span:first-child > b',50000,(v,c)=>c==='JOD'?'JOD 50K':`${c} ${(v/1000).toFixed(1)}K`);
  add('.round-hero h2 em',50000);
  add('.terms article:nth-child(1) h3',2000);
  add('.terms article:nth-child(4) h3',125000);

  const fundValues=[22500,10000,7500,5000,5000];
  $$('.funds article b').forEach((el,i)=>{if(fundValues[i]!=null)targets.push({el,amount:fundValues[i]});});

  const convert=(amount,c)=>c==='JOD'?amount:amount*rates[c];
  const money=(value,c)=>c==='JOD'?`JOD ${Math.round(value).toLocaleString('en-US')}`:`${c==='USD'?'$':'€'}${Math.round(value).toLocaleString('en-US')}`;

  function render(){
    const c=select.value;
    localStorage.setItem('hx-invest-currency',c);
    targets.forEach(t=>{
      const v=convert(t.amount,c);
      t.el.textContent=t.format?t.format(v,c):money(v,c);
    });
    window.hxDisplayCurrency=c;
    window.hxFxRates=rates;
    window.dispatchEvent(new CustomEvent('hx-currency-change',{detail:{currency:c,rates}}));
  }

  select.addEventListener('change',render);
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
