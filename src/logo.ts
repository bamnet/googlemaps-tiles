import { LogoControl, Map } from "maplibre-gl";

export class CustomLogoControl extends LogoControl {
    onAdd(map: Map): HTMLElement {
        this._map = map;
        this._container = document.createElement("img");
        (this._container as HTMLImageElement).src = "https://developers.google.com/static/maps/documentation/images/google_on_white.png";
        return this._container;
    }
}