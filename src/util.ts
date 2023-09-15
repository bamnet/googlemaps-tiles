import { LngLatBounds } from 'maplibre-gl';

interface GMPTileSession {
    session: string
    expiry: string
    tileWidth: number
    tileHeight: number
    imageFormat: string
};

interface GMPViewport {
    copyright: string
}

export async function getSessionToken(apiKey: string) {
    const resp = await fetch(`https://tile.googleapis.com/v1/createSession?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "mapType": "roadmap",
            "language": "en-US",
            "region": "us",
        }),
    });

    const session = await resp.json() as GMPTileSession;
    return session.session;
}

export async function tileURL(apiKey: string, token: string) {
    return `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${token}&key=${apiKey}`;
}

export async function getAttribution(bounds: LngLatBounds, zoom: number, token: string, apiKey: string) {
    const z = Math.round(zoom);
    const resp = await fetch(`https://tile.googleapis.com/tile/v1/viewport?session=${token}&key=${apiKey}&zoom=${z}&north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}`)
    const viewport = await resp.json() as GMPViewport;

    return viewport.copyright;
}