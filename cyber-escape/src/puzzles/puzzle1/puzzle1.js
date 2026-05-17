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

const btn = document.getElementById("btnCargarCodigo");
const resultado = document.getElementById("resultado");
document.getElementById("btnVerificar").addEventListener("click", function() {
    const respuesta = document.getElementById("respuestaUsuario").value.trim().toLowerCase();
    const correcto = "web scraping";

    if (respuesta === correcto) {
        document.getElementById("mensajeVerificacion").style.display = "none";
        document.getElementById("btnCargarCodigo").style.display = "inline-block";
        document.getElementById("pregunta-acceso").style.display = "none";
        document.getElementById("pistaInspeccion").style.display = "block";
    } else {
        document.getElementById("mensajeVerificacion").style.display = "block";
    }
});

btn.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../../public/puzzle1-data.json");

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      typeWriter(resultado, "[OK] Código secreto: " + data.codigo);
      window.parent.postMessage({ tipo: 'puzzle-completado', puzzle: 1 }, '*');
    } else {
      typeWriter(resultado, "[ERROR] Error al cargar los datos");
    }
  };

  xhr.send();
});
