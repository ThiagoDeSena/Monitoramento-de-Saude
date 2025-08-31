document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("medication-form");
    const toastSuccess = document.getElementById("success-toast");
    const toastError = document.getElementById("error-toast");
    const saveButton = document.getElementById("save-button");

    function showToast(el, ms = 2000) {
        // mostrar
        el.classList.remove("hidden");
        requestAnimationFrame(() => {
            el.classList.remove("opacity-0", "scale-95");
            el.classList.add("opacity-100", "scale-100");
            el.setAttribute("aria-hidden", "false");
        });

        // esconder depois
        setTimeout(() => {
            el.classList.remove("opacity-100", "scale-100");
            el.classList.add("opacity-0", "scale-95");
            el.setAttribute("aria-hidden", "true");
            setTimeout(() => el.classList.add("hidden"), 200);
        }, ms);
    }

    form.addEventListener("submit", function (ev) {
        ev.preventDefault();

        const name = document.getElementById("medication-name").value.trim();
        const quantity = document.getElementById("quantity").value.trim();
        const unit = document.getElementById("unit").value.trim();
        const time = document.getElementById("time").value.trim();

        // pega os dias selecionados
        const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
            .map(input => input.value);

        // validação (description é opcional)
        if (!name || !quantity || !unit || !time || selectedDays.length === 0) {
            showToast(toastError, 2000);
            return;
        }

        // desabilita botão para evitar cliques duplos
        saveButton.disabled = true;
        saveButton.classList.add("opacity-60", "cursor-not-allowed");

        // mostra toast de sucesso
        showToast(toastSuccess, 2000);

        // simula delay de salvamento e redireciona após 2s
        setTimeout(() => {
            // aqui você chamaria sua API / salvar no banco
            console.log({
                name,
                quantity,
                unit,
                time,
                days: selectedDays
            });

            window.location.href = "../TelaInicial/index.html";
        }, 2000);
    });
});
