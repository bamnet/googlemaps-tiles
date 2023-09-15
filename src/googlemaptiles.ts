import { LngLatBounds, RequestParameters, ResourceType } from "maplibre-gl"

interface Session {
    session: string
    expiry: string
    tileWidth: number
    tileHeight: number
    imageFormat: string
};

interface Viewport {
    copyright: string
    maxZoomRects: Array<{
        maxZoom: number;
        north: number;
        south: number;
        east: number;
        west: number;
    }>
}

export interface SessionRequest {
    mapType: MapType
    language: string
    region: string
}

export enum MapType {
    Roadmap = "roadmap",
    Satellite = "satellite",
}

export const MapTilesURL = 'https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}';

const defaultSession: SessionRequest = {
    mapType: MapType.Roadmap,
    language: "en-US",
    region: "us",
};

export class GoogleMapTiles {
    readonly apiKey: string;

    session: Session | undefined;
    sessionRequest: SessionRequest;

    constructor(apiKey: string, sessionRequest: SessionRequest = defaultSession) {
        this.apiKey = apiKey;
        this.sessionRequest = sessionRequest;
        this.refreshSession();
    }

    async refreshSession() {
        const resp = await fetch(`https://tile.googleapis.com/v1/createSession?key=${this.apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.sessionRequest),
        });

        this.session = await resp.json() as Session;
    }

    async getViewport(bounds: LngLatBounds, zoom: number) {
        const z = Math.round(zoom);
        const resp = await fetch(`https://tile.googleapis.com/tile/v1/viewport?session=${this.session?.session}&key=${this.apiKey}&zoom=${z}&north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}`)
        return await resp.json() as Viewport;
    }

    requestTransformer() {
        return (url: string, resourceType: ResourceType | undefined): RequestParameters | undefined => {
            if (resourceType === "Tile" && url.startsWith("https://tile.googleapis.com/")) {
                return {
                    url: url + `?key=${this.apiKey}&session=${this.session?.session}`
                }
            }
            return undefined;
        };
    }
}