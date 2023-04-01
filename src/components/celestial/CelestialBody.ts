export class CelestialBody extends Mesh {
    public name: string;
    public rotationSpeed: number;
    public mass: number;
    public temperature: number;
    private elapsedTime: number;
    private radius: number;

    constructor(radius: string, texturePath: string) {

        const geometry = new SphereGeometry(RADIUS, 32, 32);
        const texture = new TextureLoader().load(TEXTUREPATH);
        const material = new MeshPhongMaterial({ map: texture });

        super()
    
    }




}