"""Static server mimicking the planned Caddy block: try_files {path} {path}/index.html /tai-lieu-nocobase/404.html (404 status on fallback)."""
import http.server, os, sys, urllib.parse
ROOT = sys.argv[1]; PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8790
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
    def send_head(s):
        path = urllib.parse.unquote(urllib.parse.urlsplit(s.path).path)
        fs = os.path.join(ROOT, path.lstrip('/'))
        for cand in (fs, os.path.join(fs, 'index.html')):
            if os.path.isfile(cand):
                s.path = '/' + os.path.relpath(cand, ROOT); return super().send_head()
        f = open(os.path.join(ROOT, 'tai-lieu-nocobase/404.html'), 'rb')
        s.send_response(404); s.send_header('Content-Type', 'text/html; charset=utf-8'); s.end_headers(); return f
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
