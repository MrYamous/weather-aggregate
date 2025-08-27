import fetch from 'node-fetch';

export default async function handler(request, response) {

  const lat = request.query.lat || '45.57';
  const lon = request.query.lon || '6.15';

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,wind_speed_10m&models=meteofrance_seamless`;

  try {
    const meteoResponse = await fetch(apiUrl);
    
    if (!meteoResponse.ok) {
      throw new Error(`Erreur lors de l'appel à l'API de meteoblue : ${meteoResponse.status}`);
    }

    const meteoData = await meteoResponse.json();

    response.status(200).json(meteoData);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Echec de la récupération des données de meteoblue.' });
  }
}