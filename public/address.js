document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("address");
    const resultsList = document.getElementById("autocomplete-results");
    const zipInput = document.getElementById("zipCode");

    input.addEventListener("input", function () {
        const query = input.value.trim();

        if (query.replace(/\s/g, "").length < 3) {
            resultsList.innerHTML = "";
            return;
        }

        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resultsList.innerHTML = "";

                if (!data.features || !Array.isArray(data.features)) {
                    throw new Error("Respuesta no válida de Photon");
                }

                if (data.features.length === 0) {
                    const li = document.createElement("li");
                    li.textContent = "No se encontraron resultados.";
                    resultsList.appendChild(li);
                    return;
                }

                data.features.forEach(feature => {
                    const p = feature.properties;
                    const street = p.name || "";
                    const housenumber = p.housenumber ? ` ${p.housenumber}` : "";
                    const city = p.city || p.town || p.village || "";
                    const state = p.state || "";
                    const postcode = p.postcode || "";

                    const displayText = `${street}${housenumber}, ${city}, ${state}${postcode ? ', CP ' + postcode : ''}`;

                    const li = document.createElement("li");
                    li.textContent = displayText;
                    li.style.cursor = "pointer";
                    li.onclick = () => {
                        input.value = displayText;
                        resultsList.innerHTML = "";
                        // Rellenar el campo código postal
                        document.getElementById("zipCode").value = postcode;
                    };
                    resultsList.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Error al consultar Photon:", error.message);
                resultsList.innerHTML = "";
                const li = document.createElement("li");
                li.textContent = "Error al consultar la dirección.";
                resultsList.appendChild(li);
            });
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener("click", function (e) {
        if (!resultsList.contains(e.target) && e.target !== input) {
            resultsList.innerHTML = "";
        }
    });
});
