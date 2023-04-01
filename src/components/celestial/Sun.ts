import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';

export class Sun extends Mesh {
  public name: string;
  public mass: number;
  public temperature: number;
  public rotationSpeed: number;

  constructor(radius: number, texturePath: string, name: string, mass: number, temperature: number, rotationSpeed: number) {
    const geometry = new SphereGeometry(radius, 32, 32);
    const texture = new TextureLoader().load(texturePath);
    const material = new MeshPhongMaterial({ map: texture });

    super(geometry, material);

    this.name = name;
    this.mass = mass;
    this.temperature = temperature;
    this.rotationSpeed = rotationSpeed;
  }



}
