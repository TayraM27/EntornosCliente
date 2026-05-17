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

const tiempoSpan = document.getElementById("tiempo");
const btnDetener = document.getElementById("btn-detener");
const resultado = document.getElementById("resultado");

let tiempo = 10;

const intervalo = setInterval(() => {
  tiempo--;
  tiempoSpan.textContent = tiempo;

  if (tiempo <= 3) {
    tiempoSpan.classList.add("peligro");
  }

  if (tiempo === 0) {
    clearInterval(intervalo);
    typeWriter(resultado, "[ERROR] ¡Tiempo agotado! Puzzle bloqueado.");
  }
}, 1000);

const timeout = setTimeout(() => {
  btnDetener.disabled = true;
}, 10000);

btnDetener.addEventListener("click", () => {
  clearInterval(intervalo);
  clearTimeout(timeout);
  typeWriter(resultado, "[OK] ¡Puzzle superado a tiempo!");
  window.parent.postMessage({ tipo: 'puzzle-completado', puzzle: 5 }, '*');
});
