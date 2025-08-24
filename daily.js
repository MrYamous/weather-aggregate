async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const url = `/api/meteobluedaily?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url);

    console.log(response);

    if (!response.ok) {
      throw new Error(`Erreur de l'API Vercel : ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    displayMeteo(data);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(data) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!data || !data.data_1h) {
    console.error("Données météo invalides ou conteneur HTML manquant.");
    return;
  }

  let htmlContent = '';
  for (let i = 0; i < 4; i++) {
    const date = new Date(data.data_1h.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempMax = data.data_1h.temperature[i];
    const tempMin = data.data_1h.temperature[i];
    const precipitation = data.data_1h.precipitation[i];
    const wind = data.data_1h.windspeed[i];

    htmlContent += `
      <div class="meteo-card">
        <h3>${date}</h3>
        <p>Min: ${tempMin}°C | Max: ${tempMax}°C</p>
        <p>Précipitations: ${precipitation}</p>
        <p>Vent: ${wind} km/h</p>
      </div>
    `;
  }

  displayContainer.innerHTML = htmlContent;
}

getMeteoData();