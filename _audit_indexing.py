import os, re
with open('sitemap.xml','r',encoding='utf-8') as f:
    disk = f.read()
disk_urls = re.findall(r'<loc>([^<]+)</loc>', disk)
print(f'disk sitemap.xml URLs: {len(disk_urls)}')
print(f'disk sitemap is sitemapindex? {"sitemapindex" in disk}')

with open('_sitemap_0_live.xml','r',encoding='utf-8') as f:
    live = f.read()
live_urls = re.findall(r'<loc>([^<]+)</loc>', live)

local_in_sm = [u for u in live_urls if '/local/' in u]
print(f'sitemap local URLs: {len(local_in_sm)}')

disk_local = set()
for root, dirs, files in os.walk('local'):
    for f in files:
        if f == 'index.html':
            p = root.replace(os.sep,'/').replace('local/','',1)
            disk_local.add(p)
print(f'disk local pages: {len(disk_local)}')

sm_local_paths = set()
for u in local_in_sm:
    p = u.replace('https://boomymarketing.com/local/','').rstrip('/')
    sm_local_paths.add(p)

diff1 = sm_local_paths - disk_local
diff2 = disk_local - sm_local_paths
print(f'\nIN SITEMAP but NOT on disk: {len(diff1)}')
for x in list(diff1)[:10]: print(f'  {x}')

print(f'\nON DISK but NOT in sitemap: {len(diff2)}')
for x in list(diff2)[:10]: print(f'  {x}')

seo_urls = [u for u in live_urls if '/seo/' in u]
blog_urls = [u for u in live_urls if '/boomy-digital-marketing-blog' in u]
loc_urls = [u for u in live_urls if '/locations' in u]
print()
print(f'SEO URLs in sitemap: {len(seo_urls)} (on disk: 39)')
print(f'Blog URLs in sitemap: {len(blog_urls)} (on disk: 1)')
print(f'/locations URLs in sitemap: {len(loc_urls)} (on disk: 1)')
print(f'/services/ URLs in sitemap: {len([u for u in live_urls if "/services/" in u])} (on disk: 0)')
