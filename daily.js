async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const meteoblueUrl = `/api/meteobluedaily?lat=${lat}&lon=${lon}`;
  const yrUrl = `/api/yrdaily?lat=${lat}&lon=${lon}`;
  const aromeUrl = `/api/aromedaily?lat=${lat}&lon=${lon}`;

  try {
    const [meteoblueResponse, yrResponse, aromeResponse] = await Promise.all([
      fetch(meteoblueUrl),
      fetch(yrUrl),
      fetch(aromeUrl)
    ]);

    if (!meteoblueResponse.ok) {
      throw new Error(`Erreur de l'API Meteoblue : ${meteoblueResponse.status}`);
    }
    if (!yrResponse.ok) {
      throw new Error(`Erreur de l'API Yr : ${yrResponse.status}`);
    }
    if (!aromeResponse.ok) {
      throw new Error(`Erreur de l'API Arome : ${yrResponse.status}`);
    }

    const meteoblueData = await meteoblueResponse.json();
    const yrData = await yrResponse.json();
    const aromeData = await aromeResponse.json();

    displayMeteo(meteoblueData, yrData, aromeData);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(meteoblueData, yrData, aromeData) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!meteoblueData || !meteoblueData.data_1h || !yrData || !aromeData) {
    console.error("Données météo invalides.");
    return;
  }

  let htmlContent = `
    <table class="meteo-table">
      <thead>
        <tr>
          <th>Date/Heure</th>
          <th>Yr.no</th>
          <th>Meteoblue</th>
          <th>Arome</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < 24; i++) {
    const dateYr = new Date(yrData.properties.timeseries[i].time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempYr = yrData.properties.timeseries[i].data.instant.details.air_temperature;
    const precipitationYr = yrData.properties.timeseries[i].data.next_1_hours.details.precipitation_amount;
    const windYr = yrData.properties.timeseries[i].data.instant.details.wind_speed;

    const dateMeteoblue = new Date(meteoblueData.data_1h.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempMaxMeteoblue = meteoblueData.data_1h.temperature[i];
    const tempMinMeteoblue = meteoblueData.data_1h.temperature[i];
    const precipitationMeteoblue = meteoblueData.data_1h.precipitation[i];
    const windMeteoblue = meteoblueData.data_1h.windspeed[i];

    const dateArome = new Date(aromeData.hourly.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempArome = aromeData.hourly.temperature_2m[i];
    const precipitationArome = aromeData.hourly.precipitation[i];
    const windArome = aromeData.hourly.wind_speed_10m[i];

    htmlContent += `
      <tr>
        <td>${dateYr}</td>
        <td>
          <p>Date : ${dateYr}°C</p>
          <p>Température : ${tempYr}°C</p>
          <p>Précipitations : ${precipitationYr} mm</p>
          <p>Vent : ${windYr} km/h</p>
        </td>
        <td>
          <p>Date : ${dateMeteoblue}°C</p>
          <p>Température : Min: ${tempMinMeteoblue}°C | Max: ${tempMaxMeteoblue}°C</p>
          <p>Précipitations : ${precipitationMeteoblue} mm</p>
          <p>Vent : ${windMeteoblue} km/h</p>
        </td>
        <td>
          <p>Date : ${dateArome}°C</p>
          <p>Température : ${tempArome}°C</p>
          <p>Précipitations : ${precipitationArome} mm</p>
          <p>Vent : ${windArome} km/h</p>
        </td>
      </div>
    `;
  }

  displayContainer.innerHTML = htmlContent;
}

getMeteoData();