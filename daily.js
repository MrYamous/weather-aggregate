async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const meteoblueUrl = `/api/meteobluedaily?lat=${lat}&lon=${lon}`;
  const yrUrl = `/api/yrdaily?lat=${lat}&lon=${lon}`;

  try {
    const [meteoblueResponse, yrResponse] = await Promise.all([
      fetch(meteoblueUrl),
      fetch(yrUrl)
    ]);

    if (!meteoblueResponse.ok) {
      throw new Error(`Erreur de l'API Vercel : ${meteoblueResponse.status}`);
    }
    if (!yrResponse.ok) {
      throw new Error(`Erreur de l'API Vercel : ${yrResponse.status}`);
    }

    const meteoblueData = await meteoblueResponse.json();
    const yrData = await yrResponse.json();

    console.log(yrData);

    displayMeteo(meteoblueData, yrData);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(meteoblueData, yrData) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!meteoblueData || !meteoblueData.data_1h || !yrData) {
    console.error("Données météo invalides.");
    return;
  }

  let htmlContent = '';

  htmlContent += '<h2>Yr.no</h2>';
  for (let i = 0; i < 4; i++) {
    const date = new Date(yrData.properties.timeseries[i].time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempMax = yrData.properties.timeseries[i].data.instant.details.air_temperature;
    const tempMin = yrData.properties.timeseries[i].data.instant.details.air_temperature;
    const precipitation = yrData.properties.timeseries[i].data.next_1_hours.details.precipitation_amount;
    const wind = yrData.properties.timeseries[i].data.instant.details.wind_speed;

    htmlContent += `
      <div class="meteo-card">
        <h3>${date}</h3>
        <p>Min: ${tempMin}°C | Max: ${tempMax}°C</p>
        <p>Précipitations: ${precipitation}</p>
        <p>Vent: ${wind} km/h</p>
      </div>
    `;
  }

  htmlContent += '<h2>Meteoblue</h2>';
  for (let i = 0; i < 4; i++) {
    const date = new Date(meteoblueData.data_1h.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempMax = meteoblueData.data_1h.temperature[i];
    const tempMin = meteoblueData.data_1h.temperature[i];
    const precipitation = meteoblueData.data_1h.precipitation[i];
    const wind = meteoblueData.data_1h.windspeed[i];

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