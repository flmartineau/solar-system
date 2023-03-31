import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from 'three';

export class Star {
  public mesh: Mesh;

  constructor(name: string, radius: number, texturePath: string) {
    const geometry = new SphereGeometry(radius, 64, 64);
    const texture = new TextureLoader().load(texturePath);
    const material = new MeshPhongMaterial({ map: texture });

    this.mesh = new Mesh(geometry, material);
    this.mesh.name = name;
  }
}
