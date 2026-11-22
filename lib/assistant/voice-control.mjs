import WebSocket from 'ws';

export function monitorVoice(id, deadline, key, handoff, advice, role = 'primary', openSocket) {
  const started = Date.now();
  let socket, retry, finished = false, connected = false, transferred = false, hangupSent = false;
  let handoffPending=false, primaryAdvicePaused=false;
  const pendingUpdates=[];
  let onReady, onUnavailable, onDone, onFailure;
  const ready = new Promise((resolve,reject) => { onReady=resolve; onUnavailable=reject; });
  const done = new Promise((resolve,reject) => { onDone=resolve; onFailure=reject; });
  // The caller registers its waitUntil and awaits attachment in the same turn.
  ready.catch(() => {}); done.catch(() => {});
  const timers = [];
  const later = (fn,at) => { const timer=setTimeout(fn,Math.max(0,at-Date.now()));timers.push(timer);return timer; };
  const base='https://api.openai.com/v1/live/sessions/'+encodeURIComponent(id);
  const headers={Authorization:'Bearer '+key};
  let activeDeadline=handoff ? Math.min(deadline,started+240_000) : deadline;
  function finish(value,error) {
    if (finished) return;
    finished=true;
    timers.forEach(clearTimeout);clearTimeout(retry);
    if (socket && socket.readyState!==WebSocket.CLOSED) socket.terminate();
    if (!connected) onUnavailable(error || new Error('Voice attachment unavailable'));
    if (error) onFailure(error); else onDone(value);
  }
  function hangup() {
    if (finished || hangupSent) return;
    hangupSent=true;
    fetch(base+'/hangup',{method:'POST',headers,signal:AbortSignal.timeout(5000)}).catch(()=>{});
  }
  function close() {
    if (finished || transferred) return;
    if (socket?.readyState===WebSocket.OPEN) socket.send('{"type":"session.close"}');
    else if (connected) hangup();
  }
  function sendUpdate(update) {
    if (finished || transferred || primaryAdvicePaused) return;
    if (socket?.readyState===WebSocket.OPEN) socket.send(JSON.stringify(update));
    else if (pendingUpdates.length<6) pendingUpdates.push(update);
  }
  function attach() {
    if (finished) return;
    const current=openSocket ? openSocket() : new WebSocket(base.replace('https:','wss:')+'/attach',{headers,handshakeTimeout:4000,perMessageDeflate:false});
    socket=current;
    current.on('open',()=>{
      if (finished) return;
      connected=true; onReady();
      if (!transferred && Date.now()>=activeDeadline) close();
      else if (!primaryAdvicePaused) pendingUpdates.splice(0).forEach(sendUpdate);
    });
    current.on('message',raw=>{
      try {
        const e=JSON.parse(raw.toString());
        if (e.type==='session.closed' && Number.isFinite(e.usage?.seconds)) finish(e.usage.seconds);
        else if (advice) {
          advice(e,sendUpdate,!primaryAdvicePaused && !transferred).catch(()=>{});
        }
      } catch { /* Settlement requires a trusted final usage event. */ }
    });
    current.on('error',()=>{});
    current.on('close',()=>{
      if (finished || transferred || handoffPending || current!==socket) return;
      if (Date.now()>=activeDeadline) hangup();
      retry=setTimeout(attach,600);
    });
  }
  later(()=>{if (!connected) {
    if (role!=='successor') hangup();
    finish(null,new Error('Voice attachment timed out'));
  }},started+8000);
  if (handoff && deadline>started+240_000) {
    later(async ()=>{
      handoffPending=true;
      primaryAdvicePaused=true;
      try { transferred=await handoff()===true; } catch { transferred=false; }
      handoffPending=false;
      if (finished) return;
      if (transferred) { finish(null); return; }
      // A lost handoff response can hide a live successor. Avoid duplicate paid advice.
      if (socket?.readyState===WebSocket.CLOSED) {clearTimeout(retry);attach();}
    },started+150_000);
  }
  later(()=>{
    if (transferred) {
      // The succeeding invocation has a verified open sideband through the true deadline.
      finish(null);
    } else close();
  },activeDeadline);
  later(()=>{if (!finished && !transferred) hangup();},Math.max(started+6500,activeDeadline+2000));
  later(()=>finish(null,new Error('Unconfirmed voice closure')),activeDeadline+12_000);
  attach();
  return { ready,done };
}

export async function stopProviderVoice(id, key) {
  const watch=monitorVoice(id,Date.now(),key,undefined,undefined,'stop');
  await watch.ready;
  return watch.done;
}
