//API to fetch images for things like the Milky Way, the ISS, the Solar Corona, and Exoplanets.
const https = require('https');
const fetchImg = (query) => new Promise((resolve) => {
  https.get('https://images-api.nasa.gov/search?q=' + encodeURIComponent(query) + '&media_type=image', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.collection.items.length > 0) {
          resolve(parsed.collection.items[0].links[0].href);
        } else { resolve('none'); }
      } catch (e) {
        resolve('error');
      }
    });
  });
});
(async () => {
  console.log('Night Sky:', await fetchImg('milky way night sky'));
  console.log('Satellite:', await fetchImg('iss earth orbit'));
  console.log('Solar:', await fetchImg('sdo corona'));
  console.log('Earth:', await fetchImg('blue marble'));
  console.log('Deep Sky:', await fetchImg('carina nebula'));
  console.log('ExoVista:', await fetchImg('exoplanet concept'));
  console.log('Solar Sys:', await fetchImg('solar system montage'));
  console.log('Planner:', await fetchImg('observatory dome silhouette'));
})();
