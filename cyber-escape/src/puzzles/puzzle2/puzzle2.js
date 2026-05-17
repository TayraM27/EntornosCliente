function typeWriter(el, text, speed = 25, cb) {
  let i = 0;
  el.textContent = '';
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      if (cb) cb();
    }
  }, speed);
}

document.getElementById("btnValidarOculta").addEventListener("click", function() {
    const r = document.getElementById("respuestaOculta").value.trim().toLowerCase();
    if (r === "key") {
        document.getElementById("errorOculta").style.display = "none";
        document.getElementById("contenedorPuzzle2").style.display = "block";
    } else {
        document.getElementById("errorOculta").style.display = "block";
    }
});

const btn = document.getElementById("btn-validar");
const input = document.getElementById("input-codigo");
const resultado = document.getElementById("resultado");

btn.addEventListener("click", () => {
  fetch("../../../public/puzzle2-data.json")
    .then(res => res.json())
    .then(data => {
      if (input.value === "1234") {
        typeWriter(resultado, "[OK] " + data.mensaje);
        window.parent.postMessage({ tipo: 'puzzle-completado', puzzle: 2 }, '*');
      } else {
        typeWriter(resultado, "[ERROR] Código incorrecto");
      }
    })
    .catch(() => {
      typeWriter(resultado, "[ERROR] Error al cargar los datos");
    });
});
