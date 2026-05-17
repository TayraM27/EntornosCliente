<template>
  <div id="ce-app">
    <div class="scanlines"></div>

    <h1 class="titulo-parpadeo">⏣ Cyber Escape</h1>
    <p class="subtitulo">[ SISTEMA DE SEGURIDAD — ACCESO RESTRINGIDO ]</p>

    <div class="progress-bar">
      <div v-for="n in total" :key="n" class="progress-dot"
        :class="{ completado: progreso.includes(n), activo: n === actual }">{{ n }}</div>
    </div>

    <p class="sys-msg console-line info" ref="sysMsg"></p>

    <!-- PANEL DE PISTAS -->
    <div v-if="hintsUnlocked.length > 0" class="panel-pistas">
      <button class="btn-toggle-pistas" @click="mostrarPistas = !mostrarPistas">
        {{ mostrarPistas ? '▼' : '▶' }} Pistas desbloqueadas ({{ hintsUnlocked.length }})
      </button>
      <div v-show="mostrarPistas" class="pistas-contenido">
        <p v-for="n in hintsUnlocked" :key="n" class="console-line hint-box">
          Puzzle {{ n }}: {{ textosPista[n - 1] }}
        </p>
      </div>
    </div>

    <!-- MODO REVISIÓN -->
    <div v-if="vistaPrevia > 0" class="terminal-box preview-banner">
      <p class="console-line info" style="margin:0;">
        Modo revisi&oacute;n — Puzzle {{ vistaPrevia }}
        <button @click="continuar" class="btn-continuar">[ Continuar ]</button>
      </p>
    </div>

    <Transition name="puzzle" mode="out-in">
      <!-- HISTORIA -->
      <div v-if="inicio" key="story" class="terminal-box">
        <h2>⧩ ACCESO AL SISTEMA</h2>
        <p class="prompt">Has sido detectado como una amenaza y confinado en un sistema de seguridad gubernamental de alto nivel. Los cortafuegos te mantienen atrapado.</p>
        <p class="prompt">Para escapar, debes superar <strong>5 protocolos</strong> de seguridad. Cada nivel contiene pistas que te guiar&aacute;n al siguiente.</p>
        <p class="prompt">No hay margen de error. El sistema registra cada intento.</p>
        <p class="console-line info">¿Est&aacute;s listo para intentar la fuga?</p>
        <button @click="iniciarSistema">[ Acceder al sistema ]</button>
      </div>

      <!-- PUZZLE 1 -->
      <div v-else-if="actual === 1" key="p1" class="terminal-box">
        <span id="3" style="display:none;">json</span>
        <h2>⧩ Puzzle 1 — Nodo Oculto</h2>
        <p class="prompt">Has accedido al primer m&oacute;dulo del sistema. Para continuar, identifica la t&eacute;cnica que usamos en clase para extraer informaci&oacute;n de p&aacute;ginas web.</p>
        <p class="prompt">¿C&oacute;mo se llama la t&eacute;cnica usada para extraer informaci&oacute;n de p&aacute;ginas web?</p>
        <input v-model="p1Input" @keyup.enter="verificarP1" placeholder="tu respuesta..." />
        <button @click="verificarP1">[ Verificar ]</button>
        <p class="console-line" ref="p1Result" style="margin-top:10px;"></p>
        <p class="console-line" ref="p1Hint" style="margin-top:10px;display:none;"></p>
        <div class="nav-btns">
          <button class="btn-sgte" v-if="p1Hecho" @click="siguiente(1)">[ Siguiente → ]</button>
        </div>
      </div>

      <!-- PUZZLE 2 -->
      <div v-else-if="actual === 2" key="p2" class="terminal-box">
        <h2>⧩ Puzzle 2 — Completar</h2>
        <p class="prompt">Completa la palabra que falta. Recuerda lo que viste en el nodo del puzzle anterior.</p>
        <code>fetch('puzzle2-data.json')<br />&nbsp;&nbsp;.then(res =&gt; res.<span class="hueco">{{ p2Json || '?' }}</span>())<br />&nbsp;&nbsp;.then(data =&gt; console.log(data))</code>
        <input v-model="p2Json" placeholder="completar" @keyup.enter="verificarP2" />
        <button @click="verificarP2">[ Validar ]</button>
        <p class="console-line" ref="p2Result" style="margin-top:8px;"></p>
        <p class="console-line info" ref="p2Hint" style="margin-top:8px;display:none;"></p>
        <div class="nav-btns">
          <button class="btn-volver" @click="volver">[ ← Volver ]</button>
          <button class="btn-sgte" v-if="p2Hecho" @click="siguiente(2)">[ Siguiente → ]</button>
        </div>
      </div>

      <!-- PUZZLE 3 -->
      <div v-else-if="actual === 3" key="p3" class="terminal-box">
        <h2>⧩ Puzzle 3 — Petici&oacute;n al servidor</h2>
        <p class="prompt">Elige el m&eacute;todo HTTP correcto:</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <button @click="elegirMetodo('GET')" :class="{ 'btn-selected': p3Metodo === 'GET' }">GET</button>
          <button @click="elegirMetodo('POST')" :class="{ 'btn-selected': p3Metodo === 'POST' }">POST</button>
          <button @click="elegirMetodo('PUT')" :class="{ 'btn-selected': p3Metodo === 'PUT' }">PUT</button>
        </div>
        <button @click="ejecutarP3" :disabled="!p3Metodo || p3Hecho || p3Cargando">[ Ejecutar ]</button>
        <div v-if="p3Cargando" style="margin:10px 0;"><span class="loader"></span> <span style="font-size:.8rem;">interceptando...</span></div>
        <p class="console-line" ref="p3Result" style="margin-top:8px;"></p>
        <div class="nav-btns">
          <button class="btn-volver" @click="volver">[ ← Volver ]</button>
          <button class="btn-sgte" v-if="p3Hecho" @click="siguiente(3)">[ Siguiente → ]</button>
        </div>
      </div>

      <!-- PUZZLE 4 -->
      <div v-else-if="actual === 4" key="p4" class="terminal-box">
        <h2>⧩ Puzzle 4 — Cookie del sistema</h2>
        <p class="prompt">Completa la l&iacute;nea de c&oacute;digo usando la duraci&oacute;n obtenida anteriormente (60 minutos).</p>
        <code>document.cookie = "escape=true; max-age=<span class="hueco">{{ p4Input || '?' }}</span>";</code>
        <input v-model="p4Input" placeholder="completar" @keyup.enter="verificarP4" />
        <button @click="verificarP4">[ Configurar ]</button>
        <p class="console-line" ref="p4Result" style="margin-top:8px;"></p>
        <div class="nav-btns">
          <button class="btn-volver" @click="volver">[ ← Volver ]</button>
          <button class="btn-sgte" v-if="p4Hecho" @click="siguiente(4)">[ Siguiente → ]</button>
        </div>
      </div>

      <!-- PUZZLE 5 -->
      <div v-else-if="actual === 5" key="p5" class="terminal-box">
        <h2>⧩ Puzzle 5 — Pipeline de despliegue (CI/CD)</h2>
        <p class="prompt">El sistema est&aacute; preparado, pero el pipeline de despliegue est&aacute; incompleto. Falta el paso clave.</p>
        <code>stage('Deploy') &#123;<br />&nbsp;&nbsp;&nbsp;&nbsp;steps &#123;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sh '<span class="hueco">{{ p5Input || '?' }}</span>'<br />&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />&#125;</code>
        <input v-model="p5Input" placeholder="______ ______" @keyup.enter="verificarP5" />
        <button @click="verificarP5">[ Desplegar ]</button>
        <p class="console-line" ref="p5Result" style="margin-top:8px;"></p>
        <div class="nav-btns">
          <button class="btn-volver" @click="volver">[ ← Volver ]</button>
          <button class="btn-sgte" v-if="p5Hecho" @click="siguiente(5)">[ Siguiente → ]</button>
        </div>
      </div>

      <!-- FINAL -->
      <div v-else-if="completado" key="final" class="terminal-box final">
        <p class="console-line info">[OK] Cortafuegos desactivado</p>
        <p class="console-line info">[OK] Sistema liberado</p>
        <p class="console-line">[OK] Todos los niveles superados</p>
        <h1 class="texto-glitch" data-text="Has escapado de Cyber Escape">Has escapado de Cyber Escape</h1>
        <button @click="reiniciar" style="margin-top:14px;display:block;margin-left:auto;margin-right:auto;">[ Reiniciar ]</button>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'CyberEscape',
  data() {
    const saved = JSON.parse(localStorage.getItem('ce-progreso-vue') || '[]');
    return {
      total: 5,
      progreso: saved,
      completado: false,
      inicio: saved.length === 0,
      mostrarPistas: false,
      hintsUnlocked: JSON.parse(localStorage.getItem('ce-hints') || '[]'),
      vistaPrevia: 0,
      textosPista: [
        'La informaci\u00f3n importante no siempre est\u00e1 en pantalla. Ya sabes qu\u00e9 herramienta usamos para mirar m\u00e1s profundo.',
        'Este m\u00e9todo solo sirve para obtener informaci\u00f3n, no para modificarla.',
        'Si necesitas la informaci\u00f3n, ya sabes d\u00f3nde buscarla.',
        'El sistema trabaja en segundos, no en minutos.',
        'Solo falta el paso que libera el sistema.'
      ],
      p1Hecho: false,
      p2Hecho: false,
      p4Hecho: false,
      p5Hecho: false,
      p1Input: '',
      p2Json: '',
      p3Metodo: '',
      p3Cargando: false,
      p3Hecho: false,
      p4Input: '',
      p5Input: '',
    };
  },
  computed: {
    actual() {
      if (this.completado) return 0;
      if (this.vistaPrevia > 0) return this.vistaPrevia;
      return this.progreso.length + 1;
    }
  },
  methods: {
    guardar() {
      localStorage.setItem('ce-progreso-vue', JSON.stringify(this.progreso));
    },
    typeWriter(el, text, speed = 25, cb) {
      if (!el) return;
      let i = 0;
      el.textContent = '';
      el.style.display = 'block';
      const t = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) { clearInterval(t); if (cb) cb(); }
      }, speed);
    },
    sysMsg(text, cb) {
      this.typeWriter(this.$refs.sysMsg, text, 25, cb);
    },
    iniciarSistema() {
      const el = this.$refs.sysMsg;
      if (el) {
        el.textContent = '[SISTEMA] Accediendo al sistema...';
        el.style.display = 'block';
      }
      this.inicio = false;
    },
    volver() {
      if (this.vistaPrevia > 0) {
        if (this.vistaPrevia > 1) {
          this.vistaPrevia--;
        } else {
          this.vistaPrevia = 0;
        }
      } else {
        const act = this.progreso.length + 1;
        if (act > 1) {
          this.vistaPrevia = act - 1;
          this.revelarPista(act - 1);
        }
      }
    },
    siguiente(id) {
      if (this.vistaPrevia > 0) {
        this.continuar();
        return;
      }
      this.completarPuzzle(id);
    },
    continuar() {
      this.vistaPrevia = 0;
      this.mostrarPistas = false;
    },
    revelarPista(n) {
      if (!this.hintsUnlocked.includes(n)) {
        this.hintsUnlocked.push(n);
        localStorage.setItem('ce-hints', JSON.stringify(this.hintsUnlocked));
      }
    },
    completarPuzzle(id) {
      if (!this.progreso.includes(id)) {
        this.progreso.push(id);
        this.guardar();
        this.revelarPista(id);
      }
      this.p1Hecho = false; this.p2Hecho = false;
      this.p3Hecho = false; this.p4Hecho = false; this.p5Hecho = false;
      if (this.vistaPrevia > 0) this.vistaPrevia = 0;
      if (this.progreso.length >= this.total) {
        this.sysMsg('[SISTEMA] Todos los niveles superados. Desbloqueando salida...', () => {
          this.completado = true;
        });
      } else {
        this.sysMsg('[SISTEMA] Puzzle ' + id + ' superado.');
      }
    },
    // Puzzle 1
    verificarP1() {
      const r = this.p1Input.trim().toLowerCase();
      const rsl = this.$refs.p1Result;
      if (r === 'web scraping' || r === 'scraping') {
        this.typeWriter(rsl, '[OK] Acceso concedido. C\u00f3digo: 003');
        this.revelarPista(1);
        const hintEl = this.$refs.p1Hint;
        if (hintEl) { hintEl.style.display = 'block'; this.typeWriter(hintEl, 'Pista: ' + this.textosPista[0]); }
        this.revelarPista(2);
        this.p1Hecho = true;
      } else {
        this.typeWriter(rsl, '[ERROR] Respuesta incorrecta.');
      }
    },
    // Puzzle 2
    verificarP2() {
      const r = this.p2Json.trim();
      const rsl = this.$refs.p2Result;
      const hint = this.$refs.p2Hint;
      if (r === 'json') {
        this.typeWriter(rsl, '[OK] Correcto.');
        this.revelarPista(2);
        if (hint) { hint.style.display = 'block'; this.typeWriter(hint, 'Pista: ' + this.textosPista[1]); }
        this.p2Hecho = true;
      } else {
        this.typeWriter(rsl, '[ERROR] Palabra incorrecta. Revisa el nodo oculto del puzzle anterior.');
      }
    },
    // Puzzle 3
    elegirMetodo(m) { this.p3Metodo = m; },
    ejecutarP3() {
      const rsl = this.$refs.p3Result;
      if (this.p3Metodo !== 'GET') {
        this.typeWriter(rsl, '[ERROR] M\u00e9todo incorrecto. Recuerda la pista del nivel anterior.');
        return;
      }
      this.p3Cargando = true;
      rsl.textContent = '';
      fetch('/puzzle3-data.json')
        .then(res => res.json())
        .then(() => {
          this.p3Cargando = false;
          this.p3Hecho = true;
          this.typeWriter(rsl, '[OK] Petici\u00f3n completada. Revisa la pesta\u00f1a Red del inspector para ver la respuesta.');
        })
        .catch(() => {
          this.p3Cargando = false;
          this.typeWriter(rsl, '[ERROR] No se pudo completar la petici\u00f3n.');
        });
    },
    // Puzzle 4
    verificarP4() {
      const r = this.p4Input.trim();
      const rsl = this.$refs.p4Result;
      if (r === '3600') {
        this.typeWriter(rsl, '[OK] Cookie configurada. El sistema est\u00e1 casi listo.');
        this.p4Hecho = true;
      } else {
        this.typeWriter(rsl, '[ERROR] Valor incorrecto. max-age debe ser 3600.');
      }
    },
    // Puzzle 5
    verificarP5() {
      const r = this.p5Input.trim().toLowerCase();
      const rsl = this.$refs.p5Result;
      if (r === 'firebase deploy') {
        this.typeWriter(rsl, '[OK] Despliegue iniciado.');
        this.p5Hecho = true;
      } else {
        this.typeWriter(rsl, '[ERROR] Comando incorrecto.');
      }
    },
    reiniciar() {
      localStorage.removeItem('ce-progreso-vue');
      localStorage.removeItem('ce-hints');
      this.progreso = [];
      this.completado = false;
      this.inicio = true;
      this.hintsUnlocked = [];
      this.vistaPrevia = 0;
      this.mostrarPistas = false;
      this.p1Hecho = false; this.p2Hecho = false;
      this.p3Hecho = false; this.p4Hecho = false; this.p5Hecho = false;
      this.p1Input = '';
      this.p2Json = '';
      this.p3Metodo = '';
      this.p3Cargando = false;
      this.p3Hecho = false;
      this.p4Input = '';
      this.p5Input = '';
      this.$refs.sysMsg.textContent = '';
      this.sysMsg('[SISTEMA] Sistema reiniciado. Inicia sesi\u00f3n para desbloquear.');
    }
  },
  mounted() {
    if (this.progreso.length === 0) {
      this.sysMsg('[SISTEMA] Inicia sesi\u00f3n para desbloquear el sistema.');
    } else {
      this.sysMsg('[SISTEMA] Progreso: ' + this.progreso.length + '/' + this.total + ' niveles superados.');
    }
  }
};
</script>

<style scoped>
#ce-app {
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Consolas', 'Courier New', monospace;
  color: #00ff6a;
  position: relative;
}
.scanlines {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: repeating-linear-gradient(0deg,rgba(0,0,0,.12)0px,rgba(0,0,0,.12)1px,transparent 1px,transparent 3px);
  pointer-events: none; z-index: 9999;
}
h1 {
  font-size: 1.6rem; margin-bottom: 4px; letter-spacing: 3px; text-transform: uppercase;
  color: #00ff6a; text-shadow: 0 0 10px rgba(0,255,106,.4);
}
.titulo-parpadeo { animation: flicker 2.5s ease-in-out infinite; }
@keyframes flicker { 0%,100%{opacity:1} 33%{opacity:.82} 66%{opacity:.93} }
.subtitulo { color:rgba(0,234,255,.5); font-size:.75rem; margin-bottom:18px; letter-spacing:2px; }
.progress-bar { display:flex; gap:8px; justify-content:center; margin-bottom:18px; }
.progress-dot {
  width:32px; height:32px; border:1px solid rgba(0,255,106,.25);
  display:flex; align-items:center; justify-content:center;
  font-size:.7rem; color:rgba(0,255,106,.3); transition:all .3s;
}
.progress-dot.activo { border-color:#00eaff; color:#00eaff; box-shadow:0 0 6px rgba(0,234,255,.3); }
.progress-dot.completado { border-color:#00ff6a; color:#00ff6a; background:rgba(0,255,106,.05); }
.terminal-box {
  border:1px solid rgba(0,255,106,.2); padding:24px; margin-bottom:16px; position:relative;
}
.terminal-box::before {
  content:'● ● ●'; position:absolute; top:8px; right:12px;
  color:rgba(0,255,106,.15); font-size:10px; letter-spacing:4px;
}
h2 { color:#00eaff; font-size:.95rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
.console-line {
  border-left:3px solid #00ff6a; padding-left:14px; margin-bottom:10px;
  font-size:.9rem; min-height:1.4em;
}
.console-line.error { border-left-color:#ff0040; color:#ff0040; }
.console-line.info { border-left-color:#00eaff; color:#00eaff; }
.prompt { color:rgba(0,255,106,.7); font-size:.85rem; margin-bottom:8px; }
.prompt::before { content:'> '; color:#00eaff; }
input {
  background:rgba(0,255,106,.04); color:#00ff6a;
  border:1px solid rgba(0,255,106,.25); padding:8px 12px;
  font-size:13px; font-family:'Consolas','Courier New',monospace;
  outline:none; width:100%; max-width:320px; margin-bottom:10px; display:block;
}
input:focus { border-color:#00eaff; box-shadow:0 0 8px rgba(0,234,255,.15); }
input::placeholder { color:rgba(0,255,106,.2); }
button {
  background:transparent; color:#00ff6a;
  border:1px solid rgba(0,255,106,.3); padding:7px 16px;
  font-size:12px; font-family:'Consolas','Courier New',monospace;
  cursor:pointer; transition:all .2s; text-transform:uppercase; letter-spacing:1px;
  margin-right:6px; margin-bottom:8px;
}
button:hover { background:rgba(0,255,106,.08); border-color:#00ff6a; box-shadow:0 0 10px rgba(0,255,106,.2); }
button:disabled { opacity:.3; cursor:not-allowed; }
button:disabled:hover { background:transparent; box-shadow:none; }
.btn-selected { border-color:#00eaff; color:#00eaff; background:rgba(0,234,255,.08); box-shadow:0 0 8px rgba(0,234,255,.2); }
.btn-volver { border-color:rgba(0,255,106,.4); color:rgba(0,255,106,.8); font-size:11px; }
.btn-volver:hover { border-color:#00ff6a; color:#00ff6a; background:rgba(0,255,106,.08); }
.btn-hint { border-color:#00eaff; color:#00eaff; font-size:11px; margin-right:10px; }
.btn-hint:hover { background:rgba(0,234,255,.12); box-shadow:0 0 8px rgba(0,234,255,.2); }
.btn-sgte { border-color:#00eaff; color:#00eaff; font-size:11px; }
.btn-sgte:hover { background:rgba(0,234,255,.12); border-color:#00eaff; }
.nav-btns { margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; }
.hint-box { border-left-color:#00eaff; color:rgba(0,234,255,.7); font-size:.82rem; }
code {
  display:block; background:rgba(0,255,106,.04); padding:14px 16px;
  border:1px solid rgba(0,255,106,.1); font-size:.85rem;
  font-family:'Consolas','Courier New',monospace; color:rgba(0,255,106,.8);
  text-align:left; margin-bottom:12px; white-space:pre-wrap; line-height:1.6;
}
code .hueco { display:inline-block; border-bottom:2px solid #00eaff; min-width:60px; color:#00eaff; }
.sys-msg { font-size:.8rem; margin-bottom:12px; min-height:1.2em; }
.loader {
  width:22px; height:22px; border:2px solid rgba(0,234,255,.2);
  border-top-color:#00eaff; border-radius:50%;
  animation:spin .7s linear infinite; display:inline-block; vertical-align:middle; margin-right:8px;
}
@keyframes spin { to{transform:rotate(360deg)} }

/* Transition */
.puzzle-enter-active { animation:puzzleIn .35s ease-out; }
.puzzle-leave-active { animation:puzzleOut .25s ease-in; }
@keyframes puzzleIn {
  from { opacity:0; transform:translateY(12px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes puzzleOut {
  from { opacity:1; transform:translateY(0); }
  to { opacity:0; transform:translateY(-12px); }
}

/* Glitch */
@keyframes glitch-a {
  0%,100%{transform:translate(0);clip-path:inset(0 0 0 0)}
  10%{transform:translate(-3px,2px);clip-path:inset(20% 0 60% 0)}
  20%{transform:translate(3px,-1px);clip-path:inset(40% 0 40% 0)}
  30%{transform:translate(-2px,3px);clip-path:inset(10% 0 70% 0)}
  40%{transform:translate(2px,-2px);clip-path:inset(60% 0 20% 0)}
  50%{transform:translate(-3px,1px);clip-path:inset(30% 0 50% 0)}
  60%{transform:translate(1px,-3px);clip-path:inset(0 0 80% 0)}
  70%{transform:translate(-1px,2px);clip-path:inset(50% 0 30% 0)}
  80%{transform:translate(3px,-2px);clip-path:inset(70% 0 10% 0)}
  90%{transform:translate(-2px,1px);clip-path:inset(0 0 40% 0)}
}
.texto-glitch {
  position:relative; display:inline-block; animation:glitch-a .8s infinite;
  font-size:1.3rem; margin:6px 0;
}
.texto-glitch::before,.texto-glitch::after {
  content:attr(data-text); position:absolute; top:0; left:0;
  width:100%; height:100%; pointer-events:none;
}
.texto-glitch::before {
  color:#00eaff; animation:glitch-a .8s infinite;
  clip-path:inset(20% 0 50% 0); transform:translate(-2px,0); opacity:.7;
}
.texto-glitch::after {
  color:#ff0040; animation:glitch-a .6s infinite reverse;
  clip-path:inset(50% 0 20% 0); transform:translate(2px,0); opacity:.7;
}
.final { text-align:center; }

/* Panel de pistas */
.panel-pistas { margin-bottom:12px; }
.btn-toggle-pistas {
  background:rgba(0,234,255,.06); color:#00eaff; border:1px solid rgba(0,234,255,.25);
  padding:5px 12px; font-size:11px; font-family:inherit; cursor:pointer;
  text-transform:uppercase; letter-spacing:1px; width:100%; text-align:left;
}
.btn-toggle-pistas:hover { background:rgba(0,234,255,.12); border-color:#00eaff; }
.pistas-contenido {
  border:1px solid rgba(0,234,255,.15); border-top:none; padding:10px 14px;
}
.pistas-contenido p { margin:4px 0; font-size:.8rem; }

/* Preview banner */
.preview-banner {
  padding:10px 16px; margin-bottom:12px;
  border-color:#00eaff; background:rgba(0,234,255,.04);
}
.btn-continuar {
  background:transparent; color:#00ff6a; border:1px solid #00ff6a;
  padding:3px 12px; font-size:11px; font-family:inherit; cursor:pointer;
  text-transform:uppercase; letter-spacing:1px; margin-left:12px;
}
.btn-continuar:hover { background:rgba(0,255,106,.1); }
</style>
