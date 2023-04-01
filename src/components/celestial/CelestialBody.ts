import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader, MeshBasicMaterial, MeshLambertMaterial, Vector2, UniformsUtils, ShaderLib, ShaderMaterial, Color  } from 'three';


export class CelestialBody extends Mesh {
    public name: string;
    public rotationSpeed: number;
    public mass: number;
    public temperature: number;
    protected elapsedTime: number;
    private radius: number;

    constructor(name: string, radius: number, texturePath: string, 
        rotationSpeed: number, mass: number, temperature: number, elapsedTime: number) {

        const geometry = new SphereGeometry(radius, 128, 128);
        const texture = new TextureLoader().load(texturePath);

        let material;

        if (name === 'Sun') {
            material = new MeshBasicMaterial({ map: texture });
        } else {
            material = new MeshPhongMaterial({ map: texture });
        }


        super(geometry, material);

        this.name = name;
        this.rotationSpeed = rotationSpeed;
        this.mass = mass;
        this.temperature = temperature;
        this.elapsedTime = elapsedTime;
        this.radius = radius;
    
    }

}