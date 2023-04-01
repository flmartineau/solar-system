import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';

export class Venus extends Mesh {
  public distanceToSun: number;
  public orbitSpeed: number;
  public rotationSpeed: number;
  public inclination: number;
  public name: string;
  public mass: number;
  public temperature: number;
  private elapsedTime: number;
  private radius: number;

  constructor() {


    const NAME: string = 'Venus';

    const RADIUS: number = 0.10;
    const TEXTUREPATH: string = '../../assets/textures/venus.jpg';
    const DISTANCE_TO_SUN: number = 10;
    const ORBITAL_SPEED: number = 0.002;
    const ROTATION_SPEED: number = 0.001;
    const INCLINATION: number = (7 * Math.PI) / 180; // 7 degrees converted to radians
    const MASS: number = 3.3011 * Math.pow(10, 23);
    const TEMPERATURE: number = 440;




    const geometry = new SphereGeometry(RADIUS, 32, 32);
    const texture = new TextureLoader().load(TEXTUREPATH);
    const material = new MeshPhongMaterial({ map: texture });

    super(geometry, material);

    this.distanceToSun = DISTANCE_TO_SUN;
    this.orbitSpeed = ORBITAL_SPEED;
    this.rotationSpeed = ROTATION_SPEED;
    this.inclination = INCLINATION;
    this.name = NAME;
    this.mass = MASS;
    this.temperature = TEMPERATURE;
    this.elapsedTime = 0;
    this.radius = RADIUS;
  }

  updateOrbit(deltaTime: number): void {
    this.elapsedTime += deltaTime;
    const angle = this.elapsedTime * this.orbitSpeed;

    // Calculate the elliptical orbit
    const a = this.distanceToSun;
    const b = this.distanceToSun * 0.9; // Example eccentricity factor
    const x = a * Math.cos(angle);
    const z = b * Math.sin(angle);
    const y = z * Math.tan(this.inclination);

    this.position.set(x, y, z);
  }
}
