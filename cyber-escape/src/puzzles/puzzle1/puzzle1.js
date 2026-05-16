 const btn = document.getElementById("btn-cargar");
const resultado = document.getElementById("resultado");

btn.addEventListener("click", () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/puzzle1-data.json");

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      resultado.textContent = "Código secreto: " + data.codigo;
    } else {
      resultado.textContent = "Error al cargar los datos";
    }
  };

  xhr.send();
});
