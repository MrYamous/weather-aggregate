async function getMeteoData() {
  const lat = 45.57;
  const lon = 6.15;

  const meteoblueUrl = `/api/meteoblue?lat=${lat}&lon=${lon}`;
  const aromeUrl = `/api/arome?lat=${lat}&lon=${lon}`;
  const gfsUrl = `/api/gfs?lat=${lat}&lon=${lon}`;

  try {
    const [meteoblueResponse, aromeResponse, gfsResponse] = await Promise.all([
      fetch(meteoblueUrl),
      fetch(aromeUrl),
      fetch(gfsUrl)
    ]);

    if (!meteoblueResponse.ok) {
      throw new Error(`Erreur de l'API Meteoblue : ${meteoblueResponse.status}`);
    }
    if (!aromeResponse.ok) {
      throw new Error(`Erreur de l'API Arome : ${yrResponse.status}`);
    }
    if (!gfsResponse.ok) {
      throw new Error(`Erreur de l'API GFS : ${gfsResponse.status}`);
    }

    const meteoblueData = await meteoblueResponse.json();
    const aromeData = await aromeResponse.json()
    const gfsData = await gfsResponse.json();

    displayMeteo(meteoblueData, aromeData, gfsData);

  } catch (error) {
    console.error('Echec de la récupération des données météo :', error);
    document.getElementById('meteo-display').innerHTML = `<p>Impossible d'afficher les prévisions. Veuillez réessayer plus tard.</p>`;
  }
}

function displayMeteo(meteoblueData, aromeData, gfsData) {
  const displayContainer = document.getElementById('meteo-display');
  if (!displayContainer) {
    console.error("Conteneur HTML manquant.");
    return;
  }

  if (!meteoblueData || !meteoblueData.data_day || !aromeData || !gfsData) {
    console.error("Données météo invalides ou conteneur HTML manquant.");
    return;
  }

  let htmlContent = `
    <table class="meteo-table">
      <thead>
        <tr>
          <th>Date/Heure</th>
          <th>Meteoblue</th>
          <th>Arome</th>
          <th>GFS</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < 7; i++) {
    const dateMeteoblue = new Date(meteoblueData.data_day.time[i]).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const tempMaxMeteoblue = meteoblueData.data_day.temperature_max[i];
    const tempMinMeteoblue = meteoblueData.data_day.temperature_min[i];
    const precipitationMeteoblue = meteoblueData.data_day.convective_precipitation[i];
    const windMeteoblue = meteoblueData.data_day.windspeed_mean[i];

    const tempMinArome = aromeData.daily.temperature_2m_min[i];
    const tempMaxArome = aromeData.daily.temperature_2m_max[i];
    const precipitationArome = aromeData.daily.precipitation_sum[i];
    const windMaxArome = aromeData.daily.wind_speed_10m_max[i];

    const tempMinGfs = gfsData.daily.temperature_2m_min[i];
    const tempMaxGfs = gfsData.daily.temperature_2m_max[i];
    const precipitationGfs = gfsData.daily.precipitation_sum[i];
    const windMaxGfs = gfsData.daily.wind_speed_10m_max[i];

    htmlContent += `
      <tr>
        <td>${dateMeteoblue}</td>
        <td>
          <p>Température : Min : ${tempMinMeteoblue}°C | Max : ${tempMaxMeteoblue}°C</p>
          <p>Précipitations : ${precipitationMeteoblue} mm</p>
          <p>Vent : ${windMeteoblue} km/h</p>
        </td>
        <td>
          <p>Température : Min : ${tempMinArome}°C | Max : ${tempMaxArome}°C</p>
          <p>Précipitations : ${precipitationArome} mm</p>
          <p>Vent maximum : ${windMaxArome} km/h</p>
        </td>
        <td>
          <p>Température : Min : ${tempMinGfs}°C | Max : ${tempMaxGfs}°C</p>
          <p>Précipitations : ${precipitationGfs} mm</p>
          <p>Vent maximum : ${windMaxGfs} km/h</p>
        </td>
      </div>
    `;
  }

  displayContainer.innerHTML = htmlContent;
}

getMeteoData();