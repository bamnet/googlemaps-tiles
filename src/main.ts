import './style.css';

import { AttributionControl, Map} from 'maplibre-gl';
import { CustomLogoControl } from './logo';
import { getAttribution, getSessionToken, tileURL } from './util';

const API_KEY = import.meta.env.VITE_API_KEY;

(async () => {
  const token = await getSessionToken(API_KEY);
  const tiles = await tileURL(API_KEY, token);

  const map = new Map({
    
    container: 'map',
    center: [150.644, -34.397],
    zoom: 8,
    style: {
      version: 8,
      sources: {
        "gmp-tiles": {
          "type": "raster",
          "tiles": [tiles],
          "tileSize": 256,
        }
      },
      "layers": [
        {
          "id": "map",
          "source": "gmp-tiles",
          "type": "raster",
        }
      ]

    },
    attributionControl: false,
  });


const attribution = new AttributionControl();
map.addControl(attribution);

map.on('sourcedata', function(e) {
  if (e.isSourceLoaded) {
      const bounds = e.target.getBounds();
      const zoom = e.target.getZoom();
      getAttribution(bounds, zoom, token, API_KEY).then((value) => {
        attribution.options.customAttribution = value;
        attribution._updateAttributions();
      })
  }
});

const logo = new CustomLogoControl();
map.addControl(logo);
})();

