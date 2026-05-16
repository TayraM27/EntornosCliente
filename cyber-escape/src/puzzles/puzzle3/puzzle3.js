 
const btn = document.getElementById("btn-cargar");
const resultado = document.getElementById("resultado");

btn.addEventListener("click", async () => {
  try {
    const res = await fetch("/puzzle3-data.json");
    const data = await res.json();
    resultado.textContent = "Clave obtenida: " + data.clave;
  } catch (error) {
    resultado.textContent = "Error al cargar los datos";
  }
});
