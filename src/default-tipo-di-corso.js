const defaultTipo = "magistrale";

window.addEventListener("DOMContentLoaded", () => {
const select = document.getElementById("tipo");
if (select) {
    select.value = defaultTipo;
}
});

