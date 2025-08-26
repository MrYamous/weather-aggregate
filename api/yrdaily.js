import fetch from 'node-fetch';

export default async function handler(request, response) {
    const userAgent = 'Weather Aggregate / https://weather-aggregate.vercel.app/';

    const lat = request.query.lat || '45.57';
    const lon = request.query.lon || '6.15';

    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    try {
        const meteoResponse = await fetch(apiUrl, {
            headers: {
                'User-Agent': userAgent
            }
        });

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