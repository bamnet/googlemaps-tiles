import './style.css';

import { AttributionControl, Map } from 'maplibre-gl';
import { CustomLogoControl } from './logo';
import { GoogleMapTiles, MapTilesURL } from './googlemaptiles';

const API_KEY = import.meta.env.VITE_API_KEY;

(async () => {
  const tiles = new GoogleMapTiles(API_KEY);

  // Make sure we have a session token before we start loading any tiles.
  await tiles.refreshSession();

  const map = new Map({
    style: {
      version: 8,
      sources: {
        "gmp-tiles": {
          "type": "raster",
          "tiles": [MapTilesURL],
          "tileSize": 256,
        }
      },
      layers: [
        {
          "id": "map",
          "source": "gmp-tiles",
          "type": "raster",
        }
      ]

    },
    // Add the auth / session tokens to tile requests.
    transformRequest: tiles.requestTransformer(),
    // Turn off the default attribution control, we need our own.
    attributionControl: false,
    container: 'map',
    center: [150.644, -34.397],
    zoom: 8,
  });


  const attribution = new AttributionControl();
  map.addControl(attribution);

  // When the map moves, we need to update the attribution.
  map.on('sourcedata', function (e) {
    if (e.isSourceLoaded) {
      const bounds = e.target.getBounds();
      const zoom = e.target.getZoom();
      tiles.getViewport(bounds, zoom).then((viewport) => {
        attribution.options.customAttribution = viewport.copyright;
        attribution._updateAttributions();
      });
    }
  });

  // Also, show a Google logo!
  const logo = new CustomLogoControl();
  map.addControl(logo);
})();

