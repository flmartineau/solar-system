import { BufferGeometry, Line, LineBasicMaterial } from "three";
import { CelestialBody } from "./CelestialBody";

export class OrbitLine extends Line {
    private _parentBody: CelestialBody;

    constructor(parentBody: CelestialBody) {
        const material = new LineBasicMaterial({ color: 0x333333 });
        material.depthWrite = false;
        const geometry = new BufferGeometry();
        
        super(geometry, material);
        this._parentBody = parentBody;
    }

    get parentBody(): CelestialBody {
        return this._parentBody;
    }
}