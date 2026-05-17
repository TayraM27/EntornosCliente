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

const btn = document.getElementById("btn-cargar");
const resultado = document.getElementById("resultado");

btn.addEventListener("click", async () => {
  try {
    const res = await fetch("../../../public/puzzle3-data.json");
    const data = await res.json();
    typeWriter(resultado, "[OK] Clave obtenida: " + data.clave);
    window.parent.postMessage({ tipo: 'puzzle-completado', puzzle: 3 }, '*');
  } catch (error) {
    typeWriter(resultado, "[ERROR] Error al cargar los datos");
  }
});
