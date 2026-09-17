import { useEffect, useMemo, useState } from 'react';
import { cheers, Cheer, CheerType, cheerTypes } from './cheers';

const KEY = 'micro-cheer-state-v2';
type Filter = '전체' | CheerType | '저장';
type Saved = { date:string; index:number; favorites:number[]; muted:boolean; filter:Filter; seen:number };
const dayKey=()=>new Date().toISOString().slice(0,10);
const dailyIndex=()=>{let h=0;for(const c of dayKey())h=(h*31+c.charCodeAt(0))>>>0;return h%cheers.length};
function speak(text:string){if(!('speechSynthesis'in window))return false;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.92;u.pitch=1.02;const ko=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('ko'));if(ko)u.voice=ko;window.speechSynthesis.speak(u);return true}

export default function App(){
 const initial=useMemo<Saved>(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s?.date===dayKey())return s}catch{}return{date:dayKey(),index:dailyIndex(),favorites:[],muted:false,filter:'전체',seen:1}},[]);
 const[state,setState]=useState(initial);const[notice,setNotice]=useState('');
 const filtered=useMemo(()=>state.filter==='전체'?cheers:state.filter==='저장'?cheers.filter(c=>state.favorites.includes(c.id)):cheers.filter(c=>c.type===state.filter),[state.filter,state.favorites]);
 const cheer:Cheer=cheers[state.index]||cheers[0];const liked=state.favorites.includes(cheer.id);
 useEffect(()=>localStorage.setItem(KEY,JSON.stringify(state)),[state]);
 const choose=(list:Cheer[])=>{if(!list.length){setNotice('아직 저장한 한마디가 없어요.');setTimeout(()=>setNotice(''),1800);return}const candidates=list.filter(c=>c.id!==cheer.id);const pick=(candidates.length?candidates:list)[Math.floor(Math.random()*(candidates.length||list.length))];setState(s=>({...s,index:pick.id,seen:s.seen+1}))};
 const next=()=>choose(filtered);
 const toggleLike=()=>{setState(s=>({...s,favorites:liked?s.favorites.filter(i=>i!==cheer.id):[...s.favorites,cheer.id]}));setNotice(liked?'저장에서 뺐어요.':'내 한마디에 저장했어요.');setTimeout(()=>setNotice(''),1500)};
 const play=()=>{if(state.muted)setState(s=>({...s,muted:false}));const ok=speak(cheer.text);setNotice(ok?'음성으로 읽어드릴게요.':'이 기기에서는 음성 읽기를 지원하지 않아요.');setTimeout(()=>setNotice(''),1800)};
 const setFilter=(filter:Filter)=>{const list=filter==='전체'?cheers:filter==='저장'?cheers.filter(c=>state.favorites.includes(c.id)):cheers.filter(c=>c.type===filter);setState(s=>({...s,filter,index:list[0]?.id??s.index}))};
 return <main className="app">
  <header className="top"><div><div className="brand">오늘의 한마디</div><div className="date">매일 10초, 마음 충전</div></div><button className="icon" aria-label="음성 설정" onClick={()=>setState(s=>({...s,muted:!s.muted}))}>{state.muted?'🔇':'🔊'}</button></header>
  <section className="hero"><div className="eyebrow">오늘 {state.seen}번째 응원</div><h1>오늘도, 당신 편이에요.</h1><p>지금 필요한 한마디를 골라보세요.</p></section>
  <nav className="chips" aria-label="한마디 카테고리">{(['전체',...cheerTypes,'저장'] as Filter[]).map(t=><button key={t} className={state.filter===t?'chip active':'chip'} onClick={()=>setFilter(t)}>{t==='저장'?`♥ 저장 ${state.favorites.length}`:t}</button>)}</nav>
  <section className="card" aria-live="polite"><div className="cheer-illustration"><img src="/cheer-warm.png" alt="따뜻한 응원을 전하는 일러스트" /></div><span className="pill">{cheer.type}</span><blockquote>“{cheer.text}”</blockquote><div className="actions"><button className={liked?'round liked':'round'} onClick={toggleLike} aria-label="저장">{liked?'♥':'♡'}</button><button className="voice" onClick={play}>▶ 음성으로 듣기</button><button className="round" onClick={next} aria-label="다른 한마디">↻</button></div></section>
  <button className="primary" onClick={next}>한마디 더 받기</button>
  <div className="summary"><span>오늘 받은 응원 <b>{state.seen}</b></span><span>저장한 한마디 <b>{state.favorites.length}</b></span></div>
  <p className="micro">오늘은 여기까지만 잘해도 충분해요.</p>{notice&&<div className="toast" role="status">{notice}</div>}
 </main>
}
