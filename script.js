/* Happy Birthday Sekar — Blue & Cat Edition 🐾 */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function toast(msg, ms=2200){
  const t=$("#toast"); t.textContent=msg;
  t.classList.add("show"); clearTimeout(t._tm);
  t._tm=setTimeout(()=>t.classList.remove("show"), ms);
}
function vibrate(p=[30]){ if(navigator.vibrate) navigator.vibrate(p); }

// ------- Audio -------
let audioCtx=null, muted=false;
function ensureAudio(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
}
function playChime(){
  if(muted) return; ensureAudio();
  const now=audioCtx.currentTime;
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>{
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type="sine"; o.frequency.value=f;
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0, now+i*0.09);
    g.gain.linearRampToValueAtTime(0.16, now+i*0.09+0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now+i*0.09+0.6);
    o.start(now+i*0.09); o.stop(now+i*0.09+0.62);
  });
}
function playPop(){
  if(muted) return; ensureAudio();
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.frequency.value=880; o.type="sine";
  o.connect(g); g.connect(audioCtx.destination);
  const n=audioCtx.currentTime;
  g.gain.setValueAtTime(0.16, n);
  g.gain.exponentialRampToValueAtTime(0.001, n+0.18);
  o.start(n); o.stop(n+0.2);
}
function playBlow(){
  if(muted) return; ensureAudio();
  const bufferSize=audioCtx.sampleRate*0.6;
  const buffer=audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/bufferSize,2)*0.3;
  const src=audioCtx.createBufferSource(); src.buffer=buffer;
  const filter=audioCtx.createBiquadFilter(); filter.type="lowpass"; filter.frequency.value=1200;
  const g=audioCtx.createGain(); g.gain.value=0.20;
  src.connect(filter); filter.connect(g); g.connect(audioCtx.destination); src.start();
}
const bgMusic = $("#bgMusic");
if(bgMusic){ bgMusic.volume=0.50; bgMusic.loop=true; }
function playBgMusic(){
  if(!bgMusic||muted) return;
  bgMusic.play().catch(err=>{ console.log("Autoplay failed:", err); });
}
function pauseBgMusic(){ if(bgMusic) bgMusic.pause(); }
$("#muteBtn").addEventListener("click", ()=>{
  muted=!muted;
  $("#muteBtn").textContent= muted ? "\u266A" : "\u266C";
  if(muted){ pauseBgMusic(); toast("Suara dimatikan"); }
  else { playBgMusic(); playChime(); toast("Suara diaktifkan~ meow!"); }
});

// ------- Confetti (canvas) — blue sky palette -------
const canvas=$("#confettiCanvas"), ctx=canvas.getContext("2d");
let confettiParticles=[], confettiRAF=null;
function resizeCanvas(){ canvas.width=innerWidth*devicePixelRatio; canvas.height=innerHeight*devicePixelRatio; canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px"; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
resizeCanvas(); addEventListener("resize", resizeCanvas);
const blueColors=["#3B82F6","#60A5FA","#93C5FD","#BFDBFE","#2563EB","#FFFFFF","#1D4ED8"];
function burstConfetti({count=140, x, y, colors}={}){
  x = x ?? innerWidth/2; y = y ?? innerHeight/2.8;
  colors = colors || blueColors;
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2;
    const speed= 4 + Math.random()*9 + (Math.random()>0.85?6:0);
    confettiParticles.push({
      x, y,
      vx: Math.cos(angle)*speed + (Math.random()-0.5)*2,
      vy: Math.sin(angle)*speed - Math.random()*6 - 4,
      r: 5 + Math.random()*7,
      rot: Math.random()*360, vr: (Math.random()-0.5)*14,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: Math.random()>0.5 ? "rect" : "circle",
      life: 0, maxLife: 90 + Math.random()*50, opacity:1
    });
  }
  if(!confettiRAF) tickConfetti();
}
function emojiBurst(emojis=["🌸","🐾","🐱","🐟"], count=18){
  for(let i=0;i<count;i++){
    const el=document.createElement("div");
    el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    el.style.cssText=`position:fixed;left:${innerWidth/2+(Math.random()-0.5)*220}px;top:${innerHeight/2.6+(Math.random()-0.5)*40}px;font-size:${18+Math.random()*16}px;pointer-events:none;z-index:65;transition:transform 1.1s cubic-bezier(.2,.8,.2,1), opacity .9s ease`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform=`translate(${(Math.random()-0.5)*400}px, ${200+Math.random()*360}px) rotate(${(Math.random()-0.5)*600}deg) scale(${0.7+Math.random()*0.5})`;
      el.style.opacity="0";
    });
    setTimeout(()=>el.remove(), 1200);
  }
}
function tickConfetti(){
  confettiRAF=requestAnimationFrame(tickConfetti);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  let alive=false;
  for(const p of confettiParticles){
    p.life++; p.vy+=0.32; p.vx*=0.993; p.vy*=0.998;
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr*0.2;
    p.opacity=1-p.life/p.maxLife;
    if(p.life<p.maxLife && p.y<innerHeight+40){
      alive=true; ctx.globalAlpha=Math.max(0,p.opacity);
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;
      if(p.shape==="rect") ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.62);
      else { ctx.beginPath(); ctx.arc(0,0,p.r/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
  }
  confettiParticles=confettiParticles.filter(p=> p.life<p.maxLife && p.y<innerHeight+40);
  if(!alive){ cancelAnimationFrame(confettiRAF); confettiRAF=null; ctx.clearRect(0,0,innerWidth,innerHeight); }
}

// ------- Landing -------
const landing=$("#landing"), main=$("#mainContent"), openBtn=$("#openBtn"), envelope=$("#envelope");
openBtn.addEventListener("click", openExperience);
envelope.addEventListener("click", openExperience);
let opened=false;
function openExperience(){
  if(opened) return; opened=true;
  envelope.classList.add("open");
  ensureAudio(); playChime(); playBgMusic(); vibrate([30,40,30]);
  burstConfetti({count:180});
  emojiBurst(["🌸","🐾","🐱","🐟"], 24);
  setTimeout(()=>{
    landing.classList.add("exit");
    setTimeout(()=>{
      landing.style.display="none"; main.classList.remove("hidden");
      initTypewriter(); initRevealObserver(); updateProgress();
      toast("Scroll pelan-pelan ya, Sekar~ meow!");
      burstConfetti({count:90, y: innerHeight*0.35});
    }, 700);
  }, 650);
}
addEventListener("keydown", e=>{ if(e.key==="Enter" && !opened) openExperience(); });

// ------- Typewriter -------
const typewriterText="Semoga di umur yang baru, kamu makin bersinar, makin dicinta, dan semua doa baikmu satu-satu jadi nyata. You deserve the whole universe!";
let twStarted=false;
function initTypewriter(){
  if(twStarted) return; twStarted=true;
  const el=$("#typewriter"); let i=0;
  function tick(){
    if(i<=typewriterText.length){
      el.textContent=typewriterText.slice(0,i); i++;
      setTimeout(tick, 26 + (typewriterText[i]===","||typewriterText[i]==="."? 180:0));
    } else { $(".cursor").style.display="none"; }
  }
  tick();
}

// ------- Reveal + progress + dots -------
function initRevealObserver(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("in"); });
  }, {threshold:.14});
  $$(".reveal").forEach(el=> io.observe(el));
}
function updateProgress(){
  const onScroll=()=>{
    const h=document.documentElement;
    const scrolled=(h.scrollTop)/(h.scrollHeight-h.clientHeight);
    $("#progressBar").style.width=(scrolled*100).toFixed(2)+"%";
    const sections=["#ucapan","#galeri","#kejutan","#surat","#penutup"];
    let cur=sections[0];
    for(const id of sections){ if($(id).getBoundingClientRect().top < innerHeight*0.45) cur=id; }
    $$(".dot").forEach(d=> d.classList.toggle("active", d.getAttribute("href")===cur));
  };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
}

// ------- Galeri 9 Foto -------
const fotoFiles=[
  "assets/sekar-01.jpg","assets/sekar-02.jpg","assets/sekar-03.jpg",
  "assets/sekar-04.jpg","assets/sekar-05.jpg","assets/sekar-06.jpg",
  "assets/sekar-07.jpg","assets/sekar-08.jpg","assets/sekar-09.jpg",
];
const photos=[
  {title:"waktu karnival", date:"🐾", desc:"Nampak cantik jelita", file: fotoFiles[0]},
  {title:"selfie sendiri ga ngajak", date:"🐾", desc:"cebelaya imut cih acu", file: fotoFiles[1]},
  {title:"another fresh flower", date:"🐾", desc:"cieee dari mas zaky ya", file: fotoFiles[2]},
  {title:"akhirnya selfie berdua", date:"🐾", desc:"jangan bosen bosen ya sama aku", file: fotoFiles[3]},
  {title:"Yaa... bunga lagi", date:"🐾", desc:".......", file: fotoFiles[4]},
  {title:"another picture of us", date:"🐾", desc:"always looking beautiful", file: fotoFiles[5]},
  {title:"another selfie of \"yourself\"", date:"🐾", desc:"uluh uluh cantekna anak bunda", file: fotoFiles[6]},
  {title:"borong skincare", date:"🐾", desc:"tumbuh bareng, glowing bareng", file: fotoFiles[7]},
  {title:"My beautiful Bestieeee", date:"🐾", desc:"HAPPY BIRTHDAYYYYYY", file: fotoFiles[8]},
];
const backEmojis=["🐱","🐾","🐟","🐱","🐾","🐟","🐱","🐾","🐟"];
const grid=$("#polaroidGrid");
photos.forEach((ph, i)=>{
  const idx=i+1;
  const imgUrl = ph.file || `https://picsum.photos/seed/sekar${idx}${idx*3}/600/600`;
  const fallback=`https://picsum.photos/seed/sekar${idx}${idx*3}/600/600`;
  const webpUrl = ph.file ? ph.file.replace('.jpg','.webp') : null;
  const rotOptions=["-1.6deg","1.2deg","-0.9deg","1.4deg","-1.1deg","0.9deg","-1.3deg","1.0deg","-0.7deg"];
  const div=document.createElement("div");
  div.className="polaroid";
  div.style.setProperty("--rot", rotOptions[i%rotOptions.length]);
  div.dataset.index=i;
  div.innerHTML=`
    <div class="polaroid-inner">
      <div class="polaroid-face polaroid-front">
        <div class="polaroid-img-wrap">
          <picture>
            ${webpUrl ? `<source srcset="${webpUrl}" type="image/webp">` : ``}
            <img loading="lazy" decoding="async" src="${imgUrl}" alt="${ph.title}" onerror="this.src='${fallback}'">
          </picture>
          <span class="gift-ribbon">#${idx}</span>
        </div>
        <div class="polaroid-caption-front">
          <h4>${ph.title}</h4>
          <p>${ph.date} &bull; tap flip</p>
        </div>
      </div>
      <div class="polaroid-face polaroid-back">
        <div class="back-emoji">${backEmojis[i]}</div>
        <h4>${ph.title}</h4>
        <p>${ph.desc}</p>
        <span class="tap-hint">tap lagi untuk kembali &bull; 2x tap untuk zoom</span>
      </div>
    </div>
  `;
  let drag=false, startX=0, curX=0;
  div.addEventListener("click", ()=>{
    const now=Date.now();
    if(div._lastTap && now - div._lastTap < 320){ openLightbox(i); div._lastTap=null; return; }
    div._lastTap=now;
    if(Math.abs(curX)>8) return;
    div.classList.toggle("flipped"); playPop(); vibrate(20);
  });
  div.addEventListener("pointerdown", e=>{ drag=true; startX=e.clientX; div.setPointerCapture(e.pointerId); div.classList.add("dragging"); });
  div.addEventListener("pointermove", e=>{
    if(!drag) return; curX=e.clientX-startX;
    const rot=curX*0.08;
    div.querySelector(".polaroid-inner").style.transform = div.classList.contains("flipped") ? `rotateY(180deg) rotate(${rot}deg)` : `rotate(${rot}deg)`;
  });
  div.addEventListener("pointerup", ()=>{
    drag=false; div.classList.remove("dragging");
    div.querySelector(".polaroid-inner").style.transform="";
    if(Math.abs(curX)>60){ div.classList.toggle("flipped"); playPop(); }
    setTimeout(()=>curX=0, 100);
  });
  div.addEventListener("touchstart", ()=>{}, {passive:true});
  grid.appendChild(div);
});

// Lightbox
const lightbox=$("#lightbox"), lbImg=$("#lightboxImg"), lbTitle=$("#lightboxTitle"), lbDesc=$("#lightboxDesc"), lbDate=$("#lightboxDate");
let lbIndex=0;
function openLightbox(i){
  lbIndex=i; const ph=photos[i];
  lbImg.src= ph.file || `https://picsum.photos/seed/sekar${i+1}${(i+1)*3}/900/900`;
  lbImg.alt=ph.title; lbTitle.textContent=ph.title;
  lbDesc.textContent=ph.desc; lbDate.textContent=ph.date;
  lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden"; playChime();
}
function closeLightbox(){
  lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", ()=> openLightbox((lbIndex-1+photos.length)%photos.length));
$("#lightboxNext").addEventListener("click", ()=> openLightbox((lbIndex+1)%photos.length));
lightbox.addEventListener("click", e=>{ if(e.target===lightbox) closeLightbox(); });
addEventListener("keydown", e=>{ if(e.key==="Escape") closeLightbox(); });

// ------- Surprise #1: confetti button -------
let confettiPresses=0;
$("#secretConfettiBtn").addEventListener("click", ()=>{
  confettiPresses++;
  $("#confettiCount").textContent=`Sudah dipencet ${confettiPresses}x`;
  if(confettiPresses===1) toast("Wuhuu! Lagi dong~ meow!");
  else if(confettiPresses===3) toast("Kamu suka kejutan ya? 🐱");
  else if(confettiPresses===7) toast("Kamu resmi jadi queen of cats! 🐾");
  else if(confettiPresses%5===0) toast(`Pencetan ke-${confettiPresses}! Hujan jejak kaki kucing~`);
  burstConfetti({count: 60 + confettiPresses*6});
  emojiBurst(["🌸","🐾","🐱","🐟"], 12);
  vibrate(18); playPop();
  if(confettiPresses>=5) $("#secretConfettiBtn").textContent="Hujan kucing lagi~";
});

// ------- Easter egg: click Sekar 5x -------
let sekarClicks=0, footerClicks=0;
function triggerSecret(){
  $("#secretMessage").classList.remove("hidden");
  burstConfetti({count:160});
  emojiBurst(["🌸","🐾","🐱","🐟"], 22);
  toast("Easter egg ketemu! Kamu hebat, Sekar! 🐱");
  vibrate([30,40,30,40]); playChime();
}
$("#sekarName").addEventListener("click", ()=>{
  sekarClicks++;
  $("#sekarName").style.transform=`scale(${1+sekarClicks*0.04}) rotate(${sekarClicks%2?2:-2}deg)`;
  setTimeout(()=> $("#sekarName").style.transform="", 180);
  if(sekarClicks===2) toast("Eh kepo ya? Klik lagi dong~ 🐾");
  if(sekarClicks>=5) triggerSecret();
});
$("#easterTrigger").addEventListener("click", ()=>{
  sekarClicks++;
  if(sekarClicks>=5) triggerSecret();
  else toast(`Kurang ${5-sekarClicks}x lagi! Klik nama Sekar di atas~`);
});
$("#footerEaster").addEventListener("click", ()=>{
  footerClicks++;
  if(footerClicks>=3){
    burstConfetti({count:120, colors:["#BFDBFE","#93C5FD","#3B82F6"]});
    emojiBurst(["🌸","🐱","🐾","🐟"], 18);
    toast("Kucing & bunga khusus buat kamu, Sekar! 🌸🐱");
    footerClicks=0;
  } else {
    toast(`Kucing ${footerClicks}/3 🐱`);
    $("#footerEaster").style.transform=`scale(1.25) rotate(${footerClicks*12}deg)`;
    setTimeout(()=>$("#footerEaster").style.transform="", 200);
  }
});
$("#suratTitle").addEventListener("click", ()=>{ sekarClicks++; if(sekarClicks>=5) triggerSecret(); });

// ------- Surprise #2: Tangkap Ikan game -------
const balloonField=$("#balloonField"), startGameBtn=$("#startGameBtn"), gameScoreEl=$("#gameScore"), gameTimeEl=$("#gameTime"), gameResult=$("#gameResult");
let gameScore=0, gameTimer=null, gameTimeLeft=10, gameActive=false;
const gameEmojis=["🐟","🐟","🐟","🐟","🐟","🐱","🐾"];
function spawnBalloon(){
  if(!gameActive) return;
  const b=document.createElement("div");
  b.className="b-pop";
  b.textContent=gameEmojis[Math.floor(Math.random()*gameEmojis.length)];
  b.style.left= Math.random()*76 + 6 + "%";
  b.style.top= Math.random()*62 + 8 + "%";
  b.style.animationDelay=(Math.random()*0.6)+"s";
  b.style.fontSize=(28+Math.random()*18)+"px";
  const onPop=()=>{
    if(!gameActive) return;
    gameScore++; gameScoreEl.textContent=gameScore;
    b.style.transform="scale(1.6) rotate(12deg)"; b.style.opacity="0"; b.style.pointerEvents="none";
    playPop(); vibrate(16);
    burstConfetti({count:12, x: b.getBoundingClientRect().left+20, y: b.getBoundingClientRect().top+20});
    setTimeout(()=> b.remove(), 220);
    if(gameScore>=9) endGame(true);
    else setTimeout(()=> { if(gameActive) spawnBalloon(); }, 280);
  };
  b.addEventListener("click", onPop);
  b.addEventListener("touchstart", onPop, {passive:true});
  balloonField.appendChild(b);
  setTimeout(()=>{ if(b.parentNode && gameActive) b.style.opacity="0.9"; }, 900);
}
function startGame(){
  gameActive=true; gameScore=0; gameTimeLeft=10;
  gameScoreEl.textContent="0"; gameTimeEl.textContent="10";
  gameResult.textContent=""; balloonField.innerHTML="";
  startGameBtn.style.display="none";
  for(let i=0;i<5;i++) setTimeout(spawnBalloon, i*180);
  gameTimer=setInterval(()=>{
    gameTimeLeft--; gameTimeEl.textContent=gameTimeLeft;
    if(gameTimeLeft<=0) endGame(false);
    if(gameTimeLeft===5) toast("Semangat! 5 detik lagi! 🐟");
  }, 1000);
  toast("Game dimulai! Tangkap semua ikan!"); playChime();
}
function endGame(won){
  if(!gameActive) return;
  gameActive=false; clearInterval(gameTimer);
  startGameBtn.style.display="inline-block";
  startGameBtn.textContent= won ? "Main Lagi~" : "Coba Lagi~";
  if(won){
    gameResult.textContent="Kamu jago banget! Semua ikan tertangkap! 🐱🌸";
    gameResult.style.color="#16A34A";
    burstConfetti({count:180}); emojiBurst(["🌸","🐟","🐱","🐾"], 20);
    vibrate([40,30,40,30,60]); playChime();
  } else {
    if(gameScore>=6) gameResult.textContent=`Hampir! Kamu dapet ${gameScore}/9. Coba lagi ya~`;
    else if(gameScore>=3) gameResult.textContent=`Lumayan ${gameScore}/9! Sekali lagi pasti bisa!`;
    else gameResult.textContent=`Dapet ${gameScore}/9, coba lagi ya~`;
    gameResult.style.color="#3B82F6";
  }
  setTimeout(()=>{
    if(!gameActive) balloonField.querySelectorAll(".b-pop").forEach(b=> b.style.opacity="0.45");
  }, 200);
}
startGameBtn.addEventListener("click", startGame);

// ------- Surprise #3: Quiz -------
const quizData=[
  {q:"Apa julukan paling sering aku panggil ke Sekar?", opts:["Bestie","Bos","Sayang","Cuy"], a:0, msg:"Hehe iya bestie forever!"},
  {q:"Kalau lagi badmood, Sekar paling jago ngapain?", opts:["Ngajak makan","Ngasih meme receh","Ngajak curhat","Semua di atas!"], a:3, msg:"Betul semua! Kamu paket lengkap!"},
  {q:"Harapan terbesar aku buat Sekar di umur baru ini?", opts:["Makin kaya raya","Makin bahagia & dicinta","Makin rajin begadang","Makin jago masak"], a:1, msg:"Yes! Bahagia kamu adalah wish aku juga!"},
];
let qIndex=0, qScore=0;
const qEl=$("#quizQuestion"), optsEl=$("#quizOptions"), qProgress=$("#quizProgress"), qResult=$("#quizResult");
function renderQuiz(){
  const d=quizData[qIndex];
  qEl.textContent=`${qIndex+1}. ${d.q}`;
  optsEl.innerHTML="";
  d.opts.forEach((opt,i)=>{
    const b=document.createElement("button");
    b.className="quiz-opt"; b.textContent=opt;
    b.addEventListener("click", ()=> answerQuiz(i, b));
    optsEl.appendChild(b);
  });
  qProgress.innerHTML=quizData.map((_,i)=> `<span class="qdot ${i<qIndex?'done':''} ${i===qIndex?'active':''}"></span>`).join("");
  qResult.textContent="";
}
function answerQuiz(i){
  const correct=quizData[qIndex].a===i;
  if(correct) qScore++;
  $$(".quiz-opt").forEach((b,idx)=>{
    b.disabled=true;
    if(idx===quizData[qIndex].a) b.classList.add("correct");
    else if(idx===i && !correct) b.classList.add("wrong");
  });
  qResult.textContent= correct ? `Benar! ${quizData[qIndex].msg}` : `Hampir! Jawaban: ${quizData[qIndex].opts[quizData[qIndex].a]}`;
  qResult.style.color= correct ? "#16A34A" : "#3B82F6";
  if(correct){ playPop(); burstConfetti({count:22}); } else { vibrate(30); }
  setTimeout(()=>{
    qIndex++;
    if(qIndex<quizData.length) renderQuiz();
    else {
      qEl.textContent="Quiz selesai!";
      optsEl.innerHTML="";
      qProgress.innerHTML=quizData.map(()=> `<span class="qdot done"></span>`).join("");
      if(qScore===3){
        qResult.textContent="Sempurna 3/3! Kamu bestie sejati!";
        qResult.style.color="#16A34A";
        burstConfetti({count:120}); emojiBurst(["🌸","🐾","🐱","🐟"], 16);
      } else if(qScore>=1){
        qResult.textContent=`Kamu dapet ${qScore}/3. Yang penting hati kita tetap 100% bestie~`;
      } else {
        qResult.textContent="0/3 gapapa, nilai persahabatan kita tetap 10/10 kok!";
      }
      const replay=document.createElement("button");
      replay.className="pill-btn"; replay.style.marginTop="10px";
      replay.textContent="Ulangi Quiz~";
      replay.addEventListener("click", ()=>{ qIndex=0; qScore=0; renderQuiz(); });
      optsEl.appendChild(replay);
    }
  }, 1100);
}
renderQuiz();

// ------- Surat -------
const openLetterBtn=$("#openLetterBtn"), letterEnvelope=$("#letterEnvelope"), letterContent=$("#letterContent");
openLetterBtn.addEventListener("click", ()=>{
  letterEnvelope.style.display="none";
  letterContent.classList.remove("hidden");
  const paras=letterContent.querySelectorAll(".reveal");
  paras.forEach((p,i)=> setTimeout(()=> p.classList.add("in"), i*160));
  burstConfetti({count:80, y: letterContent.getBoundingClientRect().top+60});
  toast("Surat dibuka... baca pelan-pelan ya~");
  playChime(); vibrate(24);
  setTimeout(()=> paras.forEach(p=>p.classList.add("in")), 1200);
});
$$(".ls").forEach(el=>{
  el.addEventListener("click", ()=>{
    toast(el.dataset.msg);
    el.style.transform="scale(1.2) rotate(8deg)";
    setTimeout(()=> el.style.transform="", 220);
    burstConfetti({count:16, x: el.getBoundingClientRect().left+22, y: el.getBoundingClientRect().top+22});
    playPop(); vibrate(14);
  });
});

// ------- Tiup Lilin -------
const blowBtn=$("#blowBtn"), candles=$("#candles"), wishMessage=$("#wishMessage");
let candlesBlown=false, micStream=null, audioAnalyser=null;
function blowCandles(){
  if(candlesBlown) return; candlesBlown=true;
  candles.querySelectorAll(".candle").forEach((c,i)=> setTimeout(()=> c.dataset.lit="false", i*160));
  playBlow(); vibrate([30,50,30,60]);
  burstConfetti({count:220, y: $("#cakeWrap").getBoundingClientRect().top+40});
  emojiBurst(["🌸","🐾","🐱","🐟","🎂"], 28);
  setTimeout(()=> burstConfetti({count:160}), 420);
  setTimeout(()=> burstConfetti({count:140}), 900);
  wishMessage.classList.remove("hidden");
  blowBtn.textContent="Harapan Terkabul!";
  blowBtn.disabled=true;
  toast("Lilin padam! Wish kamu udah terbang ke langit!", 3000);
  playChime();
  if(micStream) micStream.getTracks().forEach(t=>t.stop());
}
blowBtn.addEventListener("click", blowCandles);
let micEnabled=false;
async function enableMicBlow(){
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    micStream=stream; ensureAudio();
    const src=audioCtx.createMediaStreamSource(stream);
    audioAnalyser=audioCtx.createAnalyser(); audioAnalyser.fftSize=512;
    src.connect(audioAnalyser); micEnabled=true;
    toast("Mic aktif! Coba tiup beneran ke HP kamu~"); detectBlow();
  }catch(e){ console.log("mic denied", e); }
}
function detectBlow(){
  if(!audioAnalyser||candlesBlown) return;
  const data=new Uint8Array(audioAnalyser.frequencyBinCount);
  let blowCooldown=false;
  function loop(){
    if(candlesBlown) return;
    audioAnalyser.getByteFrequencyData(data);
    let sum=0; for(let i=0;i<28;i++) sum+=data[i];
    const avg=sum/28;
    if(avg>78 && !blowCooldown){
      blowCooldown=true; setTimeout(()=> blowCooldown=false, 600);
      if(avg>88){ blowCandles(); return; }
    }
    requestAnimationFrame(loop);
  }
  loop();
}
let micRequested=false;
const cakeObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting && !micRequested) micRequested=true; });
}, {threshold:.3});
cakeObserver.observe($("#penutup"));
blowBtn.addEventListener("click", ()=>{ if(!micEnabled) enableMicBlow(); blowCandles(); }, {once:true});
$("#cakeWrap").addEventListener("click", ()=>{ if(!candlesBlown) blowCandles(); });

// ------- Replay -------
$("#replayBtn").addEventListener("click", ()=>{
  candlesBlown=false;
  candles.querySelectorAll(".candle").forEach(c=> c.dataset.lit="true");
  wishMessage.classList.add("hidden");
  blowBtn.disabled=false; blowBtn.textContent="Tiup Lilin! (Tap)";
  window.scrollTo({top:0, behavior:"smooth"});
  setTimeout(()=>{
    landing.style.display="grid"; landing.classList.remove("exit");
    envelope.classList.remove("open"); opened=false;
    main.classList.add("hidden"); toast("Mengulang kejutan~ tap amplop lagi!");
  }, 600);
});

$("#footerYear").textContent=new Date().getFullYear();
setTimeout(()=> burstConfetti({count:30, y: -10}), 600);
setInterval(()=>{
  if(!opened) openBtn.style.transform="scale(1.02)";
  setTimeout(()=> { if(!opened) openBtn.style.transform=""; }, 220);
}, 2200);

let keyBuffer="";
addEventListener("keydown", e=>{
  keyBuffer=(keyBuffer+e.key.toLowerCase()).slice(-12);
  if(keyBuffer.includes("sekar")){
    burstConfetti({count:100}); emojiBurst(["🌸","🐾","🐱","🐟"], 14);
    toast("Kamu ngetik 'sekar' ~ love you! meow!"); keyBuffer="";
  }
});

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('./sw.js').catch(()=>{}); });
}
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) { if(bgMusic && !bgMusic.paused) bgMusic._wasPlaying=true; pauseBgMusic(); }
  else { if(bgMusic && bgMusic._wasPlaying && !muted) { playBgMusic(); bgMusic._wasPlaying=false; } }
});
function preloadImages(){
  fotoFiles.forEach((src,i)=>{ if(i===0) return; const im=new Image(); im.src=src; });
}
setTimeout(preloadImages, 1800);
