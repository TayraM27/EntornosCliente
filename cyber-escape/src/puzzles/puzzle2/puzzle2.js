const btn = document.getElementById("btn-validar");
const input = document.getElementById("input-codigo");
const resultado = document.getElementById("resultado");

btn.addEventListener("click", () => {
  fetch("/puzzle2-data.json")
    .then(res => res.json())
    .then(data => {
      if (input.value === "1234") {
        resultado.textContent = data.mensaje;
      } else {
        resultado.textContent = "Código incorrecto";
      }
    })
    .catch(() => {
      resultado.textContent = "Error al cargar los datos";
    });
});

