import express from 'express'

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dev Tools Hub</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --border: #30363d;
      --accent: #7c3aed;
      --accent2: #06b6d4;
      --text: #e6edf3;
      --muted: #8b949e;
      --success: #3fb950;
      --error: #f85149;
      --radius: 12px;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 0;
    }

    /* ── Header ── */
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 18px 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    header .logo { font-size: 1.5rem; }
    header h1 { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.3px; }
    header span { font-size: 0.75rem; color: var(--muted); background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); padding: 2px 10px; border-radius: 20px; margin-left: 4px; }

    /* ── Layout ── */
    .layout {
      display: flex;
      min-height: calc(100vh - 61px);
    }

    /* ── Sidebar ── */
    nav {
      width: 220px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      padding: 20px 12px;
      flex-shrink: 0;
    }
    nav p { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); padding: 0 10px; margin-bottom: 8px; }
    nav button {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      background: none;
      border: none;
      border-radius: 8px;
      color: var(--muted);
      font-size: 0.875rem;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
      margin-bottom: 2px;
    }
    nav button:hover { background: rgba(255,255,255,0.05); color: var(--text); }
    nav button.active { background: rgba(124,58,237,0.15); color: var(--text); border: 1px solid rgba(124,58,237,0.25); }
    nav button .icon { font-size: 1rem; width: 20px; text-align: center; }

    /* ── Main ── */
    main {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
    }

    .tool { display: none; animation: fadeIn 0.25s ease; }
    .tool.active { display: block; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .tool-header { margin-bottom: 24px; }
    .tool-header h2 { font-size: 1.3rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }
    .tool-header p { color: var(--muted); font-size: 0.875rem; margin-top: 6px; }

    /* ── Cards ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    textarea, input[type="text"], input[type="number"] {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      padding: 12px 14px;
      outline: none;
      resize: vertical;
      transition: border 0.2s;
    }
    textarea:focus, input:focus { border-color: var(--accent); }
    textarea { min-height: 140px; }

    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .row .card { flex: 1; min-width: 240px; }

    /* ── Buttons ── */
    .btn-group { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }

    button.btn {
      padding: 9px 18px;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
    }
    button.btn:hover { opacity: 0.85; transform: translateY(-1px); }
    button.btn:active { transform: translateY(0); }
    .btn-primary { background: var(--accent); color: white; }
    .btn-secondary { background: rgba(255,255,255,0.07); color: var(--text); border: 1px solid var(--border); }
    .btn-cyan { background: var(--accent2); color: #0d1117; }
    .btn-danger { background: var(--error); color: white; }

    /* ── Output ── */
    .output {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      min-height: 60px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 14px;
      position: relative;
    }
    .output.success { border-color: var(--success); }
    .output.error   { border-color: var(--error); color: var(--error); }

    .copy-btn {
      position: absolute;
      top: 8px; right: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.75rem;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }
    .copy-btn:hover { color: var(--text); }

    /* ── Stats grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 14px;
    }
    .stat-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }
    .stat-box .val { font-size: 1.6rem; font-weight: 700; color: var(--accent); }
    .stat-box .lbl { font-size: 0.7rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.8px; }

    /* ── Password strength ── */
    .strength-bar { height: 6px; border-radius: 3px; background: var(--border); margin-top: 10px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 3px; transition: width 0.3s, background 0.3s; }

    /* ── Color tool ── */
    .color-preview {
      width: 100%;
      height: 100px;
      border-radius: 8px;
      border: 1px solid var(--border);
      margin-bottom: 14px;
      transition: background 0.2s;
    }
    input[type="color"] {
      width: 60px; height: 40px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg);
      cursor: pointer;
      padding: 2px;
    }
    .color-row { display: flex; align-items: center; gap: 12px; }

    /* ── Checkbox ── */
    .check-group { display: flex; gap: 16px; flex-wrap: wrap; margin: 12px 0; }
    .check-group label {
      display: flex; align-items: center; gap: 6px;
      text-transform: none; letter-spacing: 0;
      font-size: 0.875rem; color: var(--text);
      cursor: pointer;
    }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer; }
    input[type="range"] { width: 100%; accent-color: var(--accent); margin: 8px 0; }

    /* ── Toast ── */
    #toast {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--success); color: #0d1117;
      padding: 10px 20px; border-radius: 8px;
      font-size: 0.85rem; font-weight: 600;
      opacity: 0; transform: translateY(10px);
      transition: all 0.25s; pointer-events: none;
      z-index: 999;
    }
    #toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>

<header>
  <span class="logo">🛠️</span>
  <h1>Dev Tools Hub</h1>
  <span>5 Tools</span>
</header>

<div class="layout">
  <nav>
    <p>Tools</p>
    <button class="active" onclick="switchTool('json', this)">
      <span class="icon">{ }</span> JSON Formatter
    </button>
    <button onclick="switchTool('base64', this)">
      <span class="icon">🔐</span> Base64
    </button>
    <button onclick="switchTool('password', this)">
      <span class="icon">🔑</span> Password Gen
    </button>
    <button onclick="switchTool('text', this)">
      <span class="icon">📝</span> Text Analyzer
    </button>
    <button onclick="switchTool('color', this)">
      <span class="icon">🎨</span> Color Converter
    </button>
  </nav>

  <main>

    <!-- ── JSON Formatter ── -->
    <div class="tool active" id="tool-json">
      <div class="tool-header">
        <h2>{ } JSON Formatter & Validator</h2>
        <p>Paste any JSON to beautify, minify, or validate it instantly.</p>
      </div>
      <div class="card">
        <label>Input JSON</label>
        <textarea id="json-input" placeholder='{"name":"John","age":30,"city":"New York"}'></textarea>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="formatJSON()">✨ Beautify</button>
          <button class="btn btn-secondary" onclick="minifyJSON()">⚡ Minify</button>
          <button class="btn btn-secondary" onclick="clearJSON()">🗑 Clear</button>
        </div>
      </div>
      <div class="card">
        <label>Output</label>
        <div class="output" id="json-output">
          <button class="copy-btn" onclick="copyOutput('json-output')">Copy</button>
          <span id="json-output-text">Result will appear here...</span>
        </div>
      </div>
    </div>

    <!-- ── Base64 ── -->
    <div class="tool" id="tool-base64">
      <div class="tool-header">
        <h2>🔐 Base64 Encoder / Decoder</h2>
        <p>Encode plain text to Base64 or decode Base64 back to text.</p>
      </div>
      <div class="card">
        <label>Input Text</label>
        <textarea id="b64-input" placeholder="Type or paste text here..."></textarea>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="encodeB64()">🔒 Encode</button>
          <button class="btn btn-cyan" onclick="decodeB64()">🔓 Decode</button>
          <button class="btn btn-secondary" onclick="clearB64()">🗑 Clear</button>
        </div>
      </div>
      <div class="card">
        <label>Output</label>
        <div class="output" id="b64-output">
          <button class="copy-btn" onclick="copyOutput('b64-output')">Copy</button>
          <span id="b64-output-text">Result will appear here...</span>
        </div>
      </div>
    </div>

    <!-- ── Password Generator ── -->
    <div class="tool" id="tool-password">
      <div class="tool-header">
        <h2>🔑 Password Generator</h2>
        <p>Generate strong, random passwords with custom rules.</p>
      </div>
      <div class="card">
        <label>Length: <span id="len-val">16</span> characters</label>
        <input type="range" id="pwd-length" min="6" max="64" value="16" oninput="document.getElementById('len-val').textContent=this.value"/>
        <div class="check-group">
          <label><input type="checkbox" id="pwd-upper" checked/> Uppercase (A-Z)</label>
          <label><input type="checkbox" id="pwd-lower" checked/> Lowercase (a-z)</label>
          <label><input type="checkbox" id="pwd-numbers" checked/> Numbers (0-9)</label>
          <label><input type="checkbox" id="pwd-symbols" checked/> Symbols (!@#$)</label>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generatePassword()">⚡ Generate</button>
        </div>
        <div class="output" id="pwd-output" style="margin-top:14px; font-size:1.1rem; letter-spacing:1px;">
          <button class="copy-btn" onclick="copyOutput('pwd-output')">Copy</button>
          <span id="pwd-output-text">Click Generate...</span>
        </div>
        <div class="strength-bar"><div class="strength-fill" id="strength-fill" style="width:0%"></div></div>
        <p id="strength-label" style="font-size:0.75rem; color:var(--muted); margin-top:6px;"></p>
      </div>
    </div>

    <!-- ── Text Analyzer ── -->
    <div class="tool" id="tool-text">
      <div class="tool-header">
        <h2>📝 Text Analyzer</h2>
        <p>Paste any text to get detailed statistics instantly.</p>
      </div>
      <div class="card">
        <label>Input Text</label>
        <textarea id="text-input" placeholder="Paste your text here..." oninput="analyzeText()" style="min-height:180px;"></textarea>
      </div>
      <div class="stats-grid">
        <div class="stat-box"><div class="val" id="stat-chars">0</div><div class="lbl">Characters</div></div>
        <div class="stat-box"><div class="val" id="stat-chars-ns">0</div><div class="lbl">No Spaces</div></div>
        <div class="stat-box"><div class="val" id="stat-words">0</div><div class="lbl">Words</div></div>
        <div class="stat-box"><div class="val" id="stat-sentences">0</div><div class="lbl">Sentences</div></div>
        <div class="stat-box"><div class="val" id="stat-lines">0</div><div class="lbl">Lines</div></div>
        <div class="stat-box"><div class="val" id="stat-read">0</div><div class="lbl">Read Time</div></div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="transformText('upper')">UPPERCASE</button>
          <button class="btn btn-secondary" onclick="transformText('lower')">lowercase</button>
          <button class="btn btn-secondary" onclick="transformText('title')">Title Case</button>
          <button class="btn btn-secondary" onclick="transformText('reverse')">esreveR</button>
          <button class="btn btn-danger" onclick="document.getElementById('text-input').value='';analyzeText()">Clear</button>
        </div>
      </div>
    </div>

    <!-- ── Color Converter ── -->
    <div class="tool" id="tool-color">
      <div class="tool-header">
        <h2>🎨 Color Converter</h2>
        <p>Pick a color or enter HEX/RGB to convert between formats.</p>
      </div>
      <div class="row">
        <div class="card">
          <label>Color Picker</label>
          <div class="color-row">
            <input type="color" id="color-picker" value="#7c3aed" oninput="onColorPick(this.value)"/>
            <span id="color-hex-label" style="font-family:'JetBrains Mono',monospace; font-size:1rem;">#7c3aed</span>
          </div>
          <div class="color-preview" id="color-preview" style="background:#7c3aed; margin-top:14px;"></div>
        </div>
        <div class="card">
          <label>Enter HEX</label>
          <input type="text" id="hex-input" placeholder="#7c3aed" maxlength="7"/>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="convertHex()">Convert</button>
          </div>
          <div class="output" id="color-output" style="margin-top:14px;">
            <button class="copy-btn" onclick="copyOutput('color-output')">Copy</button>
            <span id="color-output-text">Pick a color or enter HEX...</span>
          </div>
        </div>
      </div>
    </div>

  </main>
</div>

<div id="toast">✓ Copied to clipboard!</div>

<script>
  // ── Navigation ──
  function switchTool(name, btn) {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'))
    document.getElementById('tool-' + name).classList.add('active')
    btn.classList.add('active')
  }

  // ── Copy ──
  function copyOutput(id) {
    const el = document.getElementById(id)
    const text = el.innerText.replace('Copy', '').trim()
    navigator.clipboard.writeText(text).then(() => showToast())
  }

  function showToast() {
    const t = document.getElementById('toast')
    t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2000)
  }

  // ── JSON ──
  function formatJSON() {
    const input = document.getElementById('json-input').value.trim()
    const out = document.getElementById('json-output')
    const txt = document.getElementById('json-output-text')
    try {
      const parsed = JSON.parse(input)
      txt.textContent = JSON.stringify(parsed, null, 2)
      out.className = 'output success'
    } catch(e) {
      txt.textContent = '❌ Invalid JSON: ' + e.message
      out.className = 'output error'
    }
  }

  function minifyJSON() {
    const input = document.getElementById('json-input').value.trim()
    const out = document.getElementById('json-output')
    const txt = document.getElementById('json-output-text')
    try {
      txt.textContent = JSON.stringify(JSON.parse(input))
      out.className = 'output success'
    } catch(e) {
      txt.textContent = '❌ Invalid JSON: ' + e.message
      out.className = 'output error'
    }
  }

  function clearJSON() {
    document.getElementById('json-input').value = ''
    document.getElementById('json-output-text').textContent = 'Result will appear here...'
    document.getElementById('json-output').className = 'output'
  }

  // ── Base64 ──
  function encodeB64() {
    const val = document.getElementById('b64-input').value
    document.getElementById('b64-output-text').textContent = btoa(unescape(encodeURIComponent(val)))
    document.getElementById('b64-output').className = 'output success'
  }

  function decodeB64() {
    const txt = document.getElementById('b64-output-text')
    const out = document.getElementById('b64-output')
    try {
      txt.textContent = decodeURIComponent(escape(atob(document.getElementById('b64-input').value.trim())))
      out.className = 'output success'
    } catch(e) {
      txt.textContent = '❌ Invalid Base64 string'
      out.className = 'output error'
    }
  }

  function clearB64() {
    document.getElementById('b64-input').value = ''
    document.getElementById('b64-output-text').textContent = 'Result will appear here...'
    document.getElementById('b64-output').className = 'output'
  }

  // ── Password ──
  function generatePassword() {
    const len = parseInt(document.getElementById('pwd-length').value)
    const upper = document.getElementById('pwd-upper').checked
    const lower = document.getElementById('pwd-lower').checked
    const nums  = document.getElementById('pwd-numbers').checked
    const syms  = document.getElementById('pwd-symbols').checked

    let chars = ''
    if (upper)  chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lower)  chars += 'abcdefghijklmnopqrstuvwxyz'
    if (nums)   chars += '0123456789'
    if (syms)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) { document.getElementById('pwd-output-text').textContent = '⚠️ Select at least one option'; return }

    let pwd = ''
    for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
    document.getElementById('pwd-output-text').textContent = pwd

    // Strength
    const score = [upper, lower, nums, syms].filter(Boolean).length
    const pct = Math.min(100, (len / 64) * 60 + score * 10)
    const fill = document.getElementById('strength-fill')
    const label = document.getElementById('strength-label')
    const colors = ['#f85149','#f0883e','#e3b341','#3fb950']
    const labels = ['Weak','Fair','Good','Strong']
    fill.style.width = pct + '%'
    fill.style.background = colors[score - 1] || colors[0]
    label.textContent = 'Strength: ' + (labels[score - 1] || 'Weak')
    label.style.color = colors[score - 1] || colors[0]
  }

  // ── Text Analyzer ──
  function analyzeText() {
    const text = document.getElementById('text-input').value
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const sentences = (text.match(/[.!?]+/g) || []).length
    const lines = text === '' ? 0 : text.split('\\n').length
    const readTime = Math.ceil(words / 200)

    document.getElementById('stat-chars').textContent = text.length
    document.getElementById('stat-chars-ns').textContent = text.replace(/\\s/g, '').length
    document.getElementById('stat-words').textContent = words
    document.getElementById('stat-sentences').textContent = sentences
    document.getElementById('stat-lines').textContent = lines
    document.getElementById('stat-read').textContent = readTime + ' min'
  }

  function transformText(type) {
    const el = document.getElementById('text-input')
    const t = el.value
    if (type === 'upper') el.value = t.toUpperCase()
    else if (type === 'lower') el.value = t.toLowerCase()
    else if (type === 'title') el.value = t.replace(/\\w\\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    else if (type === 'reverse') el.value = t.split('').reverse().join('')
    analyzeText()
  }

  // ── Color ──
  function onColorPick(hex) {
    document.getElementById('color-preview').style.background = hex
    document.getElementById('color-hex-label').textContent = hex
    document.getElementById('hex-input').value = hex
    showColorOutput(hex)
  }

  function convertHex() {
    const hex = document.getElementById('hex-input').value.trim()
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      document.getElementById('color-output-text').textContent = '❌ Invalid HEX. Use format: #RRGGBB'
      document.getElementById('color-output').className = 'output error'
      return
    }
    document.getElementById('color-preview').style.background = hex
    document.getElementById('color-picker').value = hex
    document.getElementById('color-hex-label').textContent = hex
    showColorOutput(hex)
  }

  function showColorOutput(hex) {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    const h = r/255, s = g/255, v = b/255
    const out = document.getElementById('color-output-text')
    out.textContent =
      'HEX : ' + hex.toUpperCase() + '\\n' +
      'RGB : rgb(' + r + ', ' + g + ', ' + b + ')\\n' +
      'RGBA: rgba(' + r + ', ' + g + ', ' + b + ', 1)\\n' +
      'HSL : hsl(' + Math.round(r/255*360) + ', ' + Math.round(g/255*100) + '%, ' + Math.round(b/255*50) + '%)'
    document.getElementById('color-output').className = 'output success'
  }
</script>
</body>
</html>`

app.get('/', (_req, res) => { 
  res.send(HTML)
})

app.listen(port, () => {
  console.info('Server started at port', port)
})
