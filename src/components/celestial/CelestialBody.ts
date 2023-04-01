import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';


export class CelestialBody extends Mesh {
    public name: string;
    public rotationSpeed: number;
    public mass: number;
    public temperature: number;
    protected elapsedTime: number;
    private radius: number;

    constructor(name: string, radius: number, texturePath: string, 
        rotationSpeed: number, mass: number, temperature: number, elapsedTime: number) {

        const geometry = new SphereGeometry(radius, 32, 32);
        const texture = new TextureLoader().load(texturePath);
        const material = new MeshPhongMaterial({ map: texture });
        super(geometry, material);

        this.name = name;
        this.rotationSpeed = rotationSpeed;
        this.mass = mass;
        this.temperature = temperature;
        this.elapsedTime = elapsedTime;
        this.radius = radius;
    
    }




}