import { field, requireValue } from './state.mjs';

const zone = 'America/Toronto';
const clock = new Intl.DateTimeFormat('en-CA', {
  timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
});
const dateLabel = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
});
const bands = [
  { key: 'am', from: 9, label: '9 am–12 pm' },
  { key: 'pm', from: 13, label: '1–4 pm' },
];

export function callbackWindows(now) {
  const parts = Object.fromEntries(clock.formatToParts(now).map(p => [p.type, p.value]));
  const day = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day, 12));
  const options = [];
  for (let offset = 0; options.length < 3; offset++, day.setUTCDate(day.getUTCDate() + 1)) {
    if ([0, 6].includes(day.getUTCDay())) continue;
    for (const band of bands) {
      if (offset === 0 && +parts.hour >= band.from) continue;
      const id = day.toISOString().slice(0, 10) + '-' + band.key;
      options.push({ id, label: dateLabel.format(day) + ', ' + band.label + ' Toronto time', timeZone: zone });
      if (options.length === 3) break;
    }
  }
  return options;
}

const line = (value, max) => field(value,max).replace(/\s+/g,' ').trim();

export function callbackHistory(previous, live) {
  const newest = previous?.history?.length && (previous.count || 0) >= (live?.count || 0) ? previous : live;
  const history = newest?.history?.length ? newest.history : previous?.history || [];
  return history.slice(-4).map(turn=>({role:turn.role,content:turn.content.slice(0,220)}));
}

export function callbackFields(body, now) {
  requireValue(body.consent === true);
  const phone = line(body.phone,40), digits = phone.replace(/\D/g,'');
  requireValue(/^\+?[\d(). -]+$/.test(phone) &&
    (phone.startsWith('+') ? /^[1-9]\d{7,14}$/.test(digits) : /^(?:1\d{10}|\d{10})$/.test(digits)));
  const normalizedPhone = phone.startsWith('+') || digits.length === 11 ? '+' + digits : '+1' + digits;
  const email = line(body.email,160).toLowerCase();
  requireValue(/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email));
  const window = callbackWindows(now).find(w => w.id === body.windowId);
  requireValue(window, 400, 'window');
  return { name: line(body.name,80), phone: normalizedPhone, email, businessType: line(body.businessType,120),
    serviceInterest: line(body.serviceInterest,160), goal: line(body.goal,800), windowId:window.id, windowLabel:window.label,
    location: body.location ? line(body.location,100) : '', budget: body.budget ? line(body.budget,80) : '',
    timeline: body.timeline ? line(body.timeline,100) : '', voiceSummary: body.voiceSummary ? field(body.voiceSummary,1000) : '' };
}

export function callbackEmail(record) {
  const qualification = [record.location && 'market: '+record.location,record.budget && 'budget: '+record.budget,
    record.timeline && 'timeline: '+record.timeline].filter(Boolean);
  const brief = record.name+' represents '+record.businessType+' and is interested in '+record.serviceInterest+
    '. Their goal is '+record.goal+(qualification.length ? '. Additional details: '+qualification.join(', ') : '')+
    '. Call '+record.phone+' during '+record.windowLabel+' to discuss fit and next steps.';
  const text = ['CALL REQUEST '+record.reference,'Name: '+record.name,'Phone: '+record.phone,'Email: '+record.email,
    'Business: '+record.businessType,'Service interest: '+record.serviceInterest,'Callback window: '+record.windowLabel+
    ' (America/Toronto)','', 'Sales brief',brief,'','Conversation summary',...record.topics];
  if (record.voiceSummary) text.push('Visitor-provided voice transcript excerpt:',record.voiceSummary);
  if (!record.topics.length && !record.voiceSummary) text.push('No transcript was attached to this request.');
  return { subject:'CALL REQUEST '+record.reference, text:text.join('\n') };
}
