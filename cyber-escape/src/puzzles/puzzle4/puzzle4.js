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

const input = document.getElementById("input-numero");
const btn = document.getElementById("btn-validar");
const resultado = document.getElementById("resultado");

function comprobarNumero(numeroUsuario) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await fetch("../../../public/puzzle4-data.json");
        const data = await res.json();

        if (numeroUsuario === data.numeroCorrecto) {
          window.parent.postMessage({ tipo: 'puzzle-completado', puzzle: 4 }, '*');
          resolve("[OK] ¡Correcto! Has desbloqueado el nivel.");
        } else {
          resolve("[ERROR] Número incorrecto. Inténtalo de nuevo.");
        }
      } catch (error) {
        reject("[ERROR] Error al cargar los datos");
      }
    }, 1000);
  });
}

btn.addEventListener("click", () => {
  const numero = parseInt(input.value);
  typeWriter(resultado, "Comprobando...");
  comprobarNumero(numero)
    .then(msg => typeWriter(resultado, msg))
    .catch(err => typeWriter(resultado, err));
});
