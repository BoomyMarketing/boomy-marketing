import { responseBody, textReserve } from './provider.mjs';
import { reserve, settle, sha } from './state.mjs';

// Only trusted provider events invoke the advisor. The browser cannot send these events.
export function voiceAdvice(ctx, ref, onUsage = () => {}, history = []) {
  const turns = history.map(t=>({role:t.role,content:t.content}));
  const handled = new Set();
  let preference = '';
  function add(role, text) {
    if (typeof text !== 'string' || !text) return;
    const last=turns.at(-1);
    if (last?.role===role) last.content=(last.content+text).slice(-1000);
    else { turns.push({role,content:text.slice(-1000)}); if(turns.length>6)turns.shift(); }
  }
  const handle = async (event, send, active = true) => {
    if (event.type==='session.input_transcript.delta') {
      add('user',event.delta);
      const text=turns.at(-1)?.content || '';
      const optOut=/\b(spare me the pitch|no sales pitch|don.t pitch|no more questions|leave me alone|stop selling)\b/i.test(text);
      const priceOnly=/\b(just the (fee|price)|price only|just tell me (the )?(price|cost))\b/i.test(text);
      const requested=optOut?'no-pitch':priceOnly?'price-only':'';
      if (active && requested && requested!==preference) {
        preference=requested;
        send({type:'session.instructions.append',delegation_id:null,content:optOut?
          'The caller explicitly declined a pitch. Make one brief, empathetic acknowledgement and let them go. Do not ask a question or offer a call.':
          'The caller wants only the price. Give the relevant published price or say that it is custom quoted. Finish immediately, with no follow-up question.'});
      }
      return;
    }
    if (event.type==='session.output_transcript.delta') {add('assistant',event.delta);return;}
    if (!active || event.type!=='session.delegation.created' || event.delegation?.target!=='client') return;
    const id=event.delegation.id;
    if (typeof id!=='string' || !/^[a-zA-Z0-9_-]{1,160}$/.test(id) || handled.has(id)) return;
    const fallback="The team can confirm that detail. If you’d like a call, choose Request a callback and select a Toronto-time window.";
    const say=content=>send({type:'session.commentary.append',delegation_id:id,content});
    if (handled.size>=4) {say(fallback);return;}
    handled.add(id);
    // The last transcript and delegation can arrive in adjacent frames.
    await new Promise(resolve=>setTimeout(resolve,250));
    const lastUser=turns.findLastIndex(t=>t.role==='user');
    if (lastUser<0) {say('What would you most like to improve about your marketing?');return;}
    const body=responseBody(turns.slice(0,lastUser),turns[lastUser].content);
    body.instructions+='\nProvide the actual words for a sales consultant to speak now. Answer the caller directly in their language in one or two short sentences, usually under 40 words. No preamble, reading lists, promises of future research or filler. If the caller asked you to stop, acknowledge and close without a question.';
    body.max_output_tokens=200;
    const key=sha('voice-advice/'+ref+'/'+id);
    try {
      await reserve(ctx.store,key,textReserve(body),ctx.limits,ctx.clock(),40_000);
      const answer=await ctx.reply(body);
      onUsage(answer.usage);
      await settle(ctx.store,key,answer.charged);
      say(answer.reply.slice(0,650));
    } catch {
      say(fallback);
    }
  };
  handle.snapshot=()=>turns.slice(-2).map(t=>({role:t.role,content:t.content.slice(-160)}));
  return handle;
}
