"""Run a one-shot SEOnaut audit on the ephemeral CI instance, then export evidence.
No production configuration changes, persistent account or external messages.
"""
import csv
import http.cookiejar
import io
import json
import re
import secrets
import subprocess
import time
import urllib.parse
import urllib.request
from pathlib import Path

base = 'http://localhost:9000'
compose = ['docker', 'compose', '-f', 'ops/seo/seonaut.compose.yml']
reports = Path('reports/seonaut')
reports.mkdir(parents=True, exist_ok=True)
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

def request(route, data=None):
    payload = urllib.parse.urlencode(data).encode() if data is not None else None
    with client.open(base + route, data=payload, timeout=60) as response:
        return response.read().decode()

for attempt in range(120):
    try:
        request('/signin')
        break
    except Exception:
        if attempt == 119:
            raise
        time.sleep(2)
request('/signup', {'email': 'seo-audit@example.com', 'password': secrets.token_urlsafe(32)})
request('/project/add', {'url': 'https://www.zubware.com/', 'crawl_sitemap': 'true'})
projects = request('/')
match = re.search(r'/crawl/start\?pid=(\d+)', projects)
if not match:
    raise RuntimeError('SEOnaut project creation failed')
pid = int(match[1])
request(f'/crawl/start?pid={pid}')
summary = None
for _ in range(150):
    query = f'SELECT total_urls,total_issues,critical_issues,alert_issues,warning_issues,issues_end IS NOT NULL FROM crawls WHERE project_id={pid} ORDER BY id DESC LIMIT 1'
    result = subprocess.run(compose + ['exec', '-T', 'db', 'mysql', '-useonaut', '-pephemeral-seo-user', '-N', 'seonaut', '-e', query], capture_output=True, text=True, check=True)
    row = result.stdout.strip().split('\t')
    if len(row) == 6 and row[-1] == '1':
        summary = dict(zip(['pages','issues','critical','alerts','warnings'], map(int,row[:5])))
        break
    time.sleep(10)
if summary is None:
    raise RuntimeError('SEOnaut did not finish within 25 minutes')
if summary['pages'] == 0:
    raise RuntimeError('SEOnaut completed without crawling any pages')
export = request(f'/export/csv?pid={pid}')
if '<html' in export.lower() or len(list(csv.reader(io.StringIO(export)))) < 2:
    raise RuntimeError('SEOnaut did not return page CSV data')
(reports/'pages.csv').write_text(export)
(reports/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
(reports/'issues.html').write_text(request(f'/issues?pid={pid}'))
print(json.dumps(summary))
