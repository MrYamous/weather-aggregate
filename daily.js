async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const meteoblueUrl = `/api/meteobluedaily?lat=${lat}&lon=${lon}`;
  const yrUrl = `/api/yrdaily?lat=${lat}&lon=${lon}`;
  const aromeUrl = `/api/aromedaily?lat=${lat}&lon=${lon}`;
  const gfsUrl = `/api/gfsdaily?lat=${lat}&lon=${lon}`;

  try {
    const [meteoblueResponse, yrResponse, aromeResponse, gfsResponse] = await Promise.all([
      fetch(meteoblueUrl),
      fetch(yrUrl),
      fetch(aromeUrl),
      fetch(gfsUrl)
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
    if (!gfsResponse.ok) {
      throw new Error(`Erreur de l'API GFS : ${gfsResponse.status}`);
    }
    

    const meteoblueData = await meteoblueResponse.json();
    const yrData = await yrResponse.json();
    const aromeData = await aromeResponse.json();
    const gfsData = await gfsResponse.json();

    displayMeteo(meteoblueData, yrData, aromeData, gfsData);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(meteoblueData, yrData, aromeData, gfsData) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!meteoblueData || !meteoblueData.data_1h || !yrData || !aromeData || !gfsData) {
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
          <th>GFS</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < 24; i++) {
    const tempYr = yrData.properties.timeseries[i].data.instant.details.air_temperature;
    const precipitationYr = yrData.properties.timeseries[i].data.next_1_hours.details.precipitation_amount;
    const windYr = yrData.properties.timeseries[i].data.instant.details.wind_speed;

    const dateMeteoblue = new Date(meteoblueData.data_1h.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    const tempMeteoblue = meteoblueData.data_1h.temperature[i];
    const precipitationMeteoblue = meteoblueData.data_1h.precipitation[i];
    const windMeteoblue = meteoblueData.data_1h.windspeed[i];

    const tempArome = aromeData.hourly.temperature_2m[i];
    const precipitationArome = aromeData.hourly.precipitation[i];
    const windArome = aromeData.hourly.wind_speed_10m[i];

    const tempGfs = gfsData.hourly.temperature_2m[i];
    const precipitationGfs = gfsData.hourly.precipitation[i];
    const windGfs = gfsData.hourly.wind_speed_10m[i];

    htmlContent += `
      <tr>
        <td>${dateMeteoblue}</td>
        <td>
          <p>Température : ${tempYr}°C</p>
          <p>Précipitations : ${precipitationYr} mm</p>
          <p>Vent : ${windYr} km/h</p>
        </td>
        <td>
          <p>Température : ${tempMeteoblue}°C</p>
          <p>Précipitations : ${precipitationMeteoblue} mm</p>
          <p>Vent : ${windMeteoblue} km/h</p>
        </td>
        <td>
          <p>Température : ${tempArome}°C</p>
          <p>Précipitations : ${precipitationArome} mm</p>
          <p>Vent : ${windArome} km/h</p>
        </td>
        <td>
          <p>Température : ${tempGfs}°C</p>
          <p>Précipitations : ${precipitationGfs} mm</p>
          <p>Vent : ${windGfs} km/h</p>
        </td>
      </div>
    `;
  }

  displayContainer.innerHTML = htmlContent;
}

getMeteoData();