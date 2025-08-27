import fetch from 'node-fetch';

export default async function handler(request, response) {

  const lat = request.query.lat || '45.57';
  const lon = request.query.lon || '6.15';

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&models=meteofrance_seamless&timezone=Europe%2FBerlin`;

  try {
    const meteoResponse = await fetch(apiUrl);
    
    if (!meteoResponse.ok) {
      throw new Error(`Erreur lors de l'appel à l'API de gfs : ${meteoResponse.status}`);
    }

    const meteoData = await meteoResponse.json();

    response.status(200).json(meteoData);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Echec de la récupération des données de meteoblue.' });
  }
}