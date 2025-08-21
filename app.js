async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const url = `/api/meteo?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur de l'API Vercel : ${response.status}`);
    }

    const data = await response.json();

    displayMeteo(data);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(data) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer || !data || !data.daily || !data.daily.time) {
    console.error("Données météo invalides ou conteneur HTML manquant.");
    return;
  }

  let htmlContent = '';
  for (let i = 0; i < 3; i++) {
    const date = new Date(data.daily.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const tempMax = data.daily.temperature_max[i];
    const tempMin = data.daily.temperature_min[i];
    const precipitation = data.daily.precipitation_sum[i];

    htmlContent += `
      <div class="meteo-card">
        <h3>${date}</h3>
        <p>Min: ${tempMin}°C | Max: ${tempMax}°C</p>
        <p>Code météo: ${precipitation}</p>
      </div>
    `;
  }

  displayContainer.innerHTML = htmlContent;
}

getMeteoData();