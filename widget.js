// Embed: <script src="https://YOUR-SITE/widget.js" data-bot="BOT_ID" defer></script>
(()=>{
const s=document.currentScript,bot=s&&s.dataset.bot;if(!bot)return;
const api=new URL(s.src).origin+'/.netlify/functions/chat';
const old=document.getElementById('lf-chat-host');if(old)old.remove();
fetch(api+'?botId='+encodeURIComponent(bot)).then(r=>r.ok?r.json():Promise.reject()).then(cfg=>{
 const c=/^#[0-9a-f]{6}$/i.test(cfg.color||'')?cfg.color:'#0b7a4b';
 const host=document.createElement('div');host.id='lf-chat-host';document.body.appendChild(host);
 const r=host.attachShadow({mode:'open'});
 r.innerHTML=`<style>
 *{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
 .b{position:fixed;right:16px;bottom:16px;z-index:2147483647;border:0;border-radius:28px;background:${c};color:#fff;font-size:15px;font-weight:600;padding:14px 20px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}
 .p{position:fixed;right:16px;bottom:16px;z-index:2147483647;width:340px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 32px);background:#fff;color:#14202b;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden}
 .p.o{display:flex}.b.h{display:none}
 .t{background:${c};color:#fff;padding:12px 14px;font-weight:600;display:flex;justify-content:space-between}
 .t button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;line-height:1}
 .m{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
 .m div{max-width:85%;padding:8px 11px;border-radius:12px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}
 .a{background:#eef1f4;align-self:flex-start}.u{background:${c};color:#fff;align-self:flex-end}
 form{display:flex;gap:6px;padding:10px;border-top:1px solid #d5dce3}
 input{flex:1;border:1px solid #d5dce3;border-radius:8px;padding:10px;font-size:16px}
 form button{border:0;border-radius:8px;background:${c};color:#fff;padding:0 14px;font-weight:600;cursor:pointer}
 .ft{padding:0 10px 10px;text-align:center}
 .lk{background:none;border:0;color:${c};font-size:13px;text-decoration:underline;cursor:pointer}
 .lf{display:none;flex:1;flex-direction:column;gap:8px;padding:14px;overflow-y:auto;border:0}
 .p.l .lf{display:flex}.p.l .m,.p.l .ft,.p.l>form:not(.lf){display:none}
 .lf input,.lf textarea{border:1px solid #d5dce3;border-radius:8px;padding:10px;font-size:16px;width:100%;font-family:inherit}
 .lf small{color:#5b6b7a;font-size:12px}.lf .hp{position:absolute;left:-9999px}
 .lf .r{display:flex;gap:8px}.lf .r button{flex:1;padding:10px;border-radius:8px;border:0;cursor:pointer;font-weight:600}
 .lf .s{background:${c};color:#fff}.lf .x{background:#eef1f4;color:#14202b}
 </style>
 <button class="b" aria-label="Open chat">Chat with us</button>
 <div class="p" role="dialog" aria-label="Chat"><div class="t"><span></span><button aria-label="Close chat">×</button></div><div class="m" aria-live="polite"></div>
 <form><input placeholder="Type your question" maxlength="500" aria-label="Message"><button>Send</button></form><div class="ft"><button class="lk" type="button">Leave your number for a call back</button></div>
 <form class="lf"><b>Leave your details</b><input name="n" placeholder="Your name" maxlength="80" required aria-label="Your name"><input name="p" type="tel" placeholder="Phone number" maxlength="20" required aria-label="Phone number"><textarea name="t" rows="3" placeholder="What do you need? (optional)" maxlength="300" aria-label="What do you need"></textarea><input class="hp" name="w" tabindex="-1" autocomplete="off" aria-hidden="true"><small>By sending, you agree the business may contact you about this enquiry.</small><small class="er" role="alert" style="color:#b3341e"></small><div class="r"><button type="button" class="x">Cancel</button><button class="s">Send</button></div></form></div>`;
 const $=q=>r.querySelector(q),btn=$('.b'),panel=$('.p'),list=$('.m'),inp=$('input');
 $('.t span').textContent=cfg.name||'Chat';
 const key='lfchat_'+bot;let hist=[];try{hist=JSON.parse(sessionStorage.getItem(key))||[]}catch(e){}
 const add=(role,text)=>{const d=document.createElement('div');d.className=role==='user'?'u':'a';d.textContent=text;list.appendChild(d);list.scrollTop=list.scrollHeight;return d};
 add('assistant',cfg.greeting||'Hi! How can I help you today?');
 hist.forEach(m=>add(m.role,m.content));
 const toggle=o=>{panel.classList.toggle('o',o);btn.classList.toggle('h',o);if(o)inp.focus()};
 btn.onclick=()=>toggle(true);$('.t button').onclick=()=>toggle(false);
 $('form').onsubmit=async e=>{
  e.preventDefault();const text=inp.value.trim();if(!text)return;inp.value='';
  add('user',text);hist.push({role:'user',content:text});
  const wait=add('assistant','...');
  try{
   const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({botId:bot,messages:hist})});
   const d=await res.json();
   if(!res.ok)throw new Error(d.error||'Something went wrong');
   wait.textContent=d.reply;hist.push({role:'assistant',content:d.reply});
  }catch(err){wait.textContent=err.message;hist.pop()}
  hist=hist.slice(-10);try{sessionStorage.setItem(key,JSON.stringify(hist))}catch(e){}
  list.scrollTop=list.scrollHeight;
 };

 $('.lk').onclick=()=>{panel.classList.add('l');$('.lf input').focus()};
 $('.lf .x').onclick=()=>panel.classList.remove('l');
 $('.lf').onsubmit=async e=>{
  e.preventDefault();const f=e.target,er=$('.er'),name=f.n.value.trim(),ph=f.p.value.replace(/[^\d+]/g,'');
  if(!name||ph.replace(/\D/g,'').length<9){er.textContent='Enter your name and a valid phone number.';return}
  er.textContent='';const sb=$('.lf .s');sb.disabled=true;
  try{
   const res=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'lead',botId:bot,name,phone:ph,note:f.t.value.trim(),website:f.w.value})});
   const d=await res.json();if(!res.ok)throw new Error(d.error||'Something went wrong');
   f.reset();panel.classList.remove('l');add('assistant','Thanks '+name+'! The team will contact you soon.');
  }catch(err){er.textContent=err.message}
  sb.disabled=false;
 };
}).catch(()=>{});
})();
