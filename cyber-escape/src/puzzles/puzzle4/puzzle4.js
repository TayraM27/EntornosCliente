 const input = document.getElementById("input-numero");
const btn = document.getElementById("btn-validar");
const resultado = document.getElementById("resultado");

// Función que simula un servidor con una Promesa
function comprobarNumero(numeroUsuario) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await fetch("/puzzle4-data.json");
        const data = await res.json();

        if (numeroUsuario === data.numeroCorrecto) {
          resolve("¡Correcto! Has desbloqueado el nivel.");
        } else {
          resolve("Número incorrecto. Inténtalo de nuevo.");
        }
      } catch (error) {
        reject("Error al cargar los datos");
      }
    }, 1000); // simula retardo de 1 segundo
  });
}

btn.addEventListener("click", () => {
  const numero = parseInt(input.value);

  resultado.textContent = "Comprobando...";

  comprobarNumero(numero)
    .then(msg => resultado.textContent = msg)
    .catch(err => resultado.textContent = err);
});

