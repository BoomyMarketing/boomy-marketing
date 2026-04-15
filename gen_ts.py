import re, os, json

def clean(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('&amp;', '&').replace('&rarr;', '->').replace('&#8594;', '->').replace('&nbsp;', ' ')
    s = s.replace('&#39;', "'").replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>')
    s = s.replace('\u2014', '--').replace('\u2013', '-').replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"')
    s = s.replace('\ufffd', '-')  # replacement char from windows encoding
    return ' '.join(s.split()).strip()

def escape_ts(s):
    """Escape for TypeScript string (double quoted)"""
    return s.replace('\\', '\\\\').replace('"', '\\"')

base = 'C:/Users/Zver/projects/boomy-marketing/services'

all_files = [
    'ai-automations.html',
    'ai-development.html',
    'ai-outbound.html',
    'content-marketing.html',
    'ecommerce-seo.html',
    'email-marketing.html',
    'geo.html',
    'google-ads.html',
    'meta-ads.html',
    'ppc.html',
    'saas-products.html',
    'social-media.html',
    'voice-ai.html',
    'web-design.html',
]

all_results = []

for f in all_files:
    with open(os.path.join(base, f), 'r', encoding='utf-8') as fh:
        c = fh.read()

    d = {}
    d['slug'] = f.replace('.html','')

    m = re.search(r'<title>(.*?)</title>', c)
    d['title'] = clean(m.group(1)) if m else ''

    m = re.search(r'<meta name="description" content="(.*?)"', c)
    d['metaDescription'] = m.group(1).replace('&amp;', '&') if m else ''

    m = re.search(r'<link rel="canonical" href="(.*?)"', c)
    d['canonical'] = m.group(1) if m else ''

    m = re.search(r'class="hero-badge">(.*?)</div>', c)
    d['heroBadge'] = clean(m.group(1)) if m else ''

    m = re.search(r'class="page-hero-inner".*?<h1>(.*?)</h1>', c, re.DOTALL)
    d['heroH1'] = m.group(1).strip() if m else ''

    m = re.search(r'class="page-hero-inner".*?<h1>.*?</h1>\s*<p>(.*?)</p>', c, re.DOTALL)
    d['heroP'] = clean(m.group(1)) if m else ''

    stats = re.findall(r'<div class="stat-box"><span class="stat-num">(.*?)</span><div class="stat-lbl">(.*?)</div></div>', c)
    d['heroStats'] = [{'num': clean(n), 'label': clean(l)} for n,l in stats]

    hv = re.findall(r'<div class="hv-item"><div class="hv-icon">(.*?)</div><div class="hv-text"><strong>(.*?)</strong><span>(.*?)</span></div></div>', c)
    d['heroVisualItems'] = [{'icon': clean(i), 'title': clean(t), 'sub': clean(s)} for i,t,s in hv]

    sections = re.findall(r'<section[^>]*>(.*?)</section>', c, re.DOTALL)
    labelled = []
    for sec in sections:
        lbs = re.findall(r'<div class="section-label">(.*?)</div>', sec)
        if lbs:
            labelled.append((clean(lbs[0]), sec))

    # whatIs: first labelled section (get text paragraphs from left column, and right-side stat cards)
    if labelled:
        wi_lbl, wi_sec = labelled[0]
        d['whatIsLabel'] = wi_lbl
        m = re.search(r'<h2 class="section-title">(.*?)</h2>', wi_sec)
        d['whatIsTitle'] = clean(m.group(1)) if m else ''

        wi_paras = re.findall(r'<p style="color:var\(--text-sec\)[^"]*">(.*?)</p>', wi_sec, re.DOTALL)
        d['whatIsText'] = [clean(p) for p in wi_paras]

        if not d['whatIsText']:
            m2 = re.search(r'<p class="section-sub">(.*?)</p>', wi_sec)
            d['whatIsText'] = [clean(m2.group(1))] if m2 else []

        # inline stat/highlight cards with padding:20px
        wi_cards_raw = re.findall(r'<div class="card" style="padding:20px">.*?<strong[^>]*>(.*?)</strong><p[^>]*>(.*?)</p>', wi_sec, re.DOTALL)
        d['whatIsCards'] = [{'icon': '', 'title': clean(t), 'text': clean(txt)} for t, txt in wi_cards_raw]
    else:
        d['whatIsLabel'] = ''
        d['whatIsTitle'] = ''
        d['whatIsText'] = []
        d['whatIsCards'] = []

    # services section: find section with 4+ cards-grid cards
    svc_lbl = ''
    svc_title = ''
    svc_sub = ''
    main_cards = []

    for lbl, sec in labelled:
        cards_raw = re.findall(r'<div class="card">\s*<div class="card-icon">(.*?)</div>\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', sec, re.DOTALL)
        if len(cards_raw) >= 4:
            m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
            m_s = re.search(r'<p class="section-sub">(.*?)</p>', sec)
            svc_lbl = lbl
            svc_title = clean(m_t.group(1)) if m_t else ''
            svc_sub = clean(m_s.group(1)) if m_s else ''
            main_cards = [{'icon': clean(i), 'title': clean(t), 'text': clean(p)} for i,t,p in cards_raw]
            break

    # For ecommerce-seo: the main services section is "What We Do", not "The Opportunity"
    # The first section with 6 cards is "The Opportunity" which contains market stats, not services
    # We need the SECOND 6-card section
    if d['slug'] == 'ecommerce-seo':
        card_sections = [(lbl, sec) for lbl, sec in labelled
                        if len(re.findall(r'<div class="card">\s*<div class="card-icon">(.*?)</div>\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', sec, re.DOTALL)) >= 4]
        if len(card_sections) >= 2:
            lbl, sec = card_sections[1]  # second one = What We Do
            m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
            m_s = re.search(r'<p class="section-sub">(.*?)</p>', sec)
            svc_lbl = lbl
            svc_title = clean(m_t.group(1)) if m_t else ''
            svc_sub = clean(m_s.group(1)) if m_s else ''
            cards_raw = re.findall(r'<div class="card">\s*<div class="card-icon">(.*?)</div>\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', sec, re.DOTALL)
            main_cards = [{'icon': clean(i), 'title': clean(t), 'text': clean(p)} for i,t,p in cards_raw]

    d['servicesSectionLabel'] = svc_lbl
    d['servicesSectionTitle'] = svc_title
    d['servicesSectionSub'] = svc_sub
    d['cards'] = main_cards

    # process steps
    process_lbl = ''
    process_title = ''
    process_sub = ''
    steps = []
    for lbl, sec in labelled:
        s_raw = re.findall(r'<div class="step-num">(.*?)</div>\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>', sec, re.DOTALL)
        if s_raw:
            m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
            m_s = re.search(r'<p class="section-sub">(.*?)</p>', sec)
            process_lbl = lbl
            process_title = clean(m_t.group(1)) if m_t else ''
            process_sub = clean(m_s.group(1)) if m_s else ''
            steps = [{'num': clean(n), 'title': clean(t), 'text': clean(p)} for n,t,p in s_raw]
            break

    # content-marketing has process as cards, not steps
    if d['slug'] == 'content-marketing' and not steps:
        for lbl, sec in labelled:
            if 'process' in lbl.lower() or 'content process' in lbl.lower():
                cards_raw = re.findall(r'<div class="card">\s*<div class="card-icon">(.*?)</div>\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</div>', sec, re.DOTALL)
                if cards_raw:
                    m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
                    m_s = re.search(r'<p class="section-sub">(.*?)</p>', sec)
                    process_lbl = lbl
                    process_title = clean(m_t.group(1)) if m_t else ''
                    process_sub = clean(m_s.group(1)) if m_s else ''
                    steps = [{'num': str(i+1), 'title': clean(t), 'text': clean(p)} for i,(ic,t,p) in enumerate(cards_raw)]
                    break

    d['processLabel'] = process_lbl
    d['processTitle'] = process_title
    d['processSub'] = process_sub
    d['steps'] = steps

    # results section
    res_lbl = ''
    res_title = ''
    res_sub = ''
    results_list = []
    result_cards = re.findall(r'<div class="result-card"><div class="result-num">(.*?)</div><div class="result-label">(.*?)</div></div>', c)
    if result_cards:
        for lbl, sec in labelled:
            if re.search(r'result-card', sec):
                m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
                m_s = re.search(r'<p class="section-sub">(.*?)</p>', sec)
                res_lbl = lbl
                res_title = clean(m_t.group(1)) if m_t else ''
                res_sub = clean(m_s.group(1)) if m_s else ''
                break
        results_list = [{'num': clean(n), 'label': clean(l)} for n,l in result_cards]

    d['resultsLabel'] = res_lbl
    d['resultsTitle'] = res_title
    d['resultsSub'] = res_sub
    d['results'] = results_list

    # FAQ
    faq_lbl = ''
    faq_title = ''
    faqs = []
    questions = re.findall(r'<button class="faq-q"[^>]*>(.*?)<span class="icon">', c, re.DOTALL)
    answers = re.findall(r'<div class="faq-a">(.*?)</div>', c, re.DOTALL)
    if questions:
        for lbl, sec in labelled:
            if 'faq' in lbl.lower() or 'question' in lbl.lower():
                m_t = re.search(r'<h2 class="section-title">(.*?)</h2>', sec)
                faq_lbl = lbl
                faq_title = clean(m_t.group(1)) if m_t else ''
                break
        faqs = [{'q': clean(q), 'a': clean(a)} for q,a in zip(questions, answers)]

    d['faqLabel'] = faq_lbl
    d['faqTitle'] = faq_title
    d['faqs'] = faqs

    # CTA band (last one)
    cta_parts = c.split('<div class="cta-band">')
    if len(cta_parts) > 1:
        last_cta = cta_parts[-1]
        m_h = re.search(r'<h2>(.*?)</h2>', last_cta)
        m_p = re.search(r'<p>(.*?)</p>', last_cta)
        btns = re.findall(r'<a href="([^"]+)" class="btn[^"]+">(.*?)</a>', last_cta)
        d['ctaH2'] = clean(m_h.group(1)) if m_h else ''
        d['ctaP'] = clean(m_p.group(1)) if m_p else ''
        d['ctaBtn1'] = {'text': clean(btns[0][1]), 'href': btns[0][0]} if len(btns) > 0 else {}
        d['ctaBtn2'] = {'text': clean(btns[1][1]), 'href': btns[1][0]} if len(btns) > 1 else {}
    else:
        d['ctaH2'] = ''
        d['ctaP'] = ''
        d['ctaBtn1'] = {}
        d['ctaBtn2'] = {}

    all_results.append(d)

# Generate TypeScript
def obj_to_ts(obj, indent=0):
    ind = '  ' * indent
    ind1 = '  ' * (indent + 1)

    if isinstance(obj, dict):
        items = []
        for k, v in obj.items():
            items.append(f'{ind1}{k}: {obj_to_ts(v, indent + 1)}')
        return '{\n' + ',\n'.join(items) + f'\n{ind}}}'
    elif isinstance(obj, list):
        if not obj:
            return '[]'
        items = [f'{ind1}{obj_to_ts(v, indent + 1)}' for v in obj]
        return '[\n' + ',\n'.join(items) + f'\n{ind}]'
    elif isinstance(obj, str):
        escaped = escape_ts(obj)
        return f'"{escaped}"'
    elif isinstance(obj, bool):
        return 'true' if obj else 'false'
    elif obj is None:
        return 'null'
    else:
        return str(obj)

ts_items = [obj_to_ts(item, 1) for item in all_results]
ts_output = 'export const SERVICES_DATA = [\n' + ',\n'.join(f'  {item}' for item in ts_items) + '\n] as const;\n'

print(ts_output)
