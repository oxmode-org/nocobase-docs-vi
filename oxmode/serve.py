"""Static server mimicking the planned Caddy config for the docs:
  /tai-lieu-nocobase-3/*: try_files {path} {path}/index.html, else /tai-lieu-nocobase-3/404.html with status 404
  /tai-lieu-nocobase and /tai-lieu-nocobase/*: 301 to the same path under /tai-lieu-nocobase-3/
usage: serve.py <release-root> [port]"""
import http.server, os, re, sys, urllib.parse
ROOT = sys.argv[1]; PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8790
OLD = re.compile(r'^/tai-lieu-nocobase(/.*)?$')
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
    def send_head(s):
        sp = urllib.parse.urlsplit(s.path); path = urllib.parse.unquote(sp.path)
        if path == '/tai-lieu-nocobase-3':
            s.send_response(308); s.send_header('Location', '/tai-lieu-nocobase-3/'); s.end_headers(); return None
        m = OLD.match(sp.path)
        if m:
            s.send_response(301); s.send_header('Location', '/tai-lieu-nocobase-3' + (m.group(1) or '/') + (('?' + sp.query) if sp.query else '')); s.end_headers(); return None
        fs = os.path.join(ROOT, path.lstrip('/'))
        for cand in (fs, os.path.join(fs, 'index.html')):
            if os.path.isfile(cand):
                s.path = '/' + os.path.relpath(cand, ROOT); return super().send_head()
        f = open(os.path.join(ROOT, 'tai-lieu-nocobase-3/404.html'), 'rb')
        s.send_response(404); s.send_header('Content-Type', 'text/html; charset=utf-8'); s.end_headers(); return f
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
