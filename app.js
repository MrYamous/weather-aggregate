async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const url = `/api/meteoblue?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url);

    console.log(response);

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
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!data || !data.data_day) {
    console.log(data);
    console.log(data.data_day);
    console.error("Données météo invalides ou conteneur HTML manquant.");
    return;
  }

  let htmlContent = '';
  for (let i = 0; i < 3; i++) {
    const date = new Date(data.data_day.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const tempMax = data.data_day.temperature_max[i];
    const tempMin = data.data_day.temperature_min[i];
    const precipitation = data.data_day.convective_precipitation[i];

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