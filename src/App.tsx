import { useEffect, useMemo, useState } from 'react';
import { cheers, Cheer } from './cheers';

const KEY = 'micro-cheer-state-v1';
type Saved = { date: string; index: number; favorites: number[]; muted: boolean };
const dayKey = () => new Date().toISOString().slice(0,10);
const dailyIndex = () => {
  const d = dayKey().replaceAll('-', '');
  let h = 0; for (const c of d) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % cheers.length;
};

function speak(text: string) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.rate = 0.92; u.pitch = 1.02;
  const voices = window.speechSynthesis.getVoices();
  const ko = voices.find(v => v.lang.toLowerCase().startsWith('ko'));
  if (ko) u.voice = ko;
  window.speechSynthesis.speak(u);
  return true;
}

export default function App() {
  const initial = useMemo<Saved>(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.date === dayKey()) return s; } catch {}
    return { date: dayKey(), index: dailyIndex(), favorites: [], muted: false };
  }, []);
  const [state, setState] = useState(initial);
  const [voiceNotice, setVoiceNotice] = useState('');
  const cheer: Cheer = cheers[state.index];
  const liked = state.favorites.includes(state.index);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  const next = () => setState(s => ({...s, index: (s.index + 1 + Math.floor(Math.random()*(cheers.length-1))) % cheers.length}));
  const toggleLike = () => setState(s => ({...s, favorites: liked ? s.favorites.filter(i=>i!==s.index) : [...s.favorites, s.index]}));
  const play = () => {
    if (state.muted) { setState(s=>({...s, muted:false})); }
    const ok = speak(cheer.text);
    setVoiceNotice(ok ? '음성으로 읽어드릴게요.' : '이 기기에서는 음성 읽기를 지원하지 않아요.');
    setTimeout(()=>setVoiceNotice(''), 2200);
  };

  return <main className="app">
    <header className="top"><div className="brand">오늘의 한마디</div><button className="icon" aria-label="음성 설정" onClick={()=>setState(s=>({...s, muted:!s.muted}))}>{state.muted?'🔇':'🔊'}</button></header>
    <section className="hero">
      <div className="eyebrow">출근길 10초 충전</div>
      <h1>오늘도, 당신 편이에요.</h1>
      <p>생각할 것 없이 한마디만 받고 가세요.</p>
    </section>
    <section className="card" aria-live="polite">
      <div className="emoji">{cheer.emoji}</div>
      <span className="pill">{cheer.type}</span>
      <blockquote>“{cheer.text}”</blockquote>
      <div className="actions">
        <button className="round" onClick={toggleLike} aria-label="좋아요">{liked?'♥':'♡'}</button>
        <button className="voice" onClick={play}>▶ 음성으로 듣기</button>
        <button className="round" onClick={next} aria-label="다른 한마디">↻</button>
      </div>
    </section>
    <button className="primary" onClick={next}>한마디 더 받기</button>
    <p className="micro">오늘은 여기까지만 잘해도 충분해요.</p>
    {voiceNotice && <div className="toast" role="status">{voiceNotice}</div>}
  </main>
}
