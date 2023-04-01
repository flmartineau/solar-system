import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';

export class Mercury extends Mesh {
  public distanceToSun: number;
  public orbitSpeed: number;
  public rotationSpeed: number;
  public inclination: number;
  public name: string;
  public mass: number;
  public temperature: number;
  private elapsedTime: number;

  constructor(
    radius: number,
    texturePath: string,
    distanceToSun: number,
    orbitSpeed: number,
    rotationSpeed: number,
    inclination: number,
    name: string,
    mass: number,
    temperature: number
  ) {
    const geometry = new SphereGeometry(radius, 32, 32);
    const texture = new TextureLoader().load(texturePath);
    const material = new MeshPhongMaterial({ map: texture });

    super(geometry, material);

    this.distanceToSun = distanceToSun;
    this.orbitSpeed = orbitSpeed;
    this.rotationSpeed = rotationSpeed;
    this.inclination = inclination;
    this.name = name;
    this.mass = mass;
    this.temperature = temperature;
    this.elapsedTime = 0;
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
