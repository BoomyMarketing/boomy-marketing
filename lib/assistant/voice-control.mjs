import WebSocket from 'ws';

export function watchVoice(upstreamId, deadline, key) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('wss://api.openai.com/v1/live/sessions/' + encodeURIComponent(upstreamId) + '/attach', {
      headers: { Authorization: 'Bearer ' + key }, handshakeTimeout: 7000, perMessageDeflate: false,
    });
    let ended = false;
    const finish = seconds => {
      if (ended) return;
      ended = true;
      clearTimeout(closeTimer);
      clearTimeout(finalTimer);
      if (socket.readyState !== WebSocket.CLOSED) socket.terminate();
      if (seconds === undefined) reject(new Error('Unconfirmed voice closure'));
      else resolve(seconds);
    };
    const close = () => { if (socket.readyState === WebSocket.OPEN) socket.send('{"type":"session.close"}'); };
    const closeTimer = setTimeout(close, Math.max(0, deadline - Date.now()));
    const finalTimer = setTimeout(() => finish(), Math.max(0, deadline - Date.now()) + 11_000);
    socket.on('open', () => { if (Date.now() >= deadline) close(); });
    socket.on('message', frame => {
      try {
        const event = JSON.parse(frame.toString());
        if (event.type === 'session.closed' && Number.isFinite(event.usage?.seconds)) finish(event.usage.seconds);
      } catch { /* Only confirmed final usage can release a spend reservation. */ }
    });
    socket.on('close', () => finish());
    socket.on('error', () => finish());
  });
}
