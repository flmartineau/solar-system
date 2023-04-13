import { BufferGeometry, Float32BufferAttribute, Sphere, Vector3 } from 'three';

export class RadialRingGeometry extends BufferGeometry {
  constructor(innerRadius: number = 0, outerRadius: number = 50, thetaSegments: number = 8) {
    super();

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < thetaSegments; i++) {
      const angleLo: number = (i / thetaSegments) * Math.PI * 2;
      const angleHi: number = ((i + 1) / thetaSegments) * Math.PI * 2;

      const vertex1 = new Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0);
      const vertex2 = new Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0);
      const vertex3 = new Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0);
      const vertex4 = new Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0);

      positions.push(...vertex1.toArray());
      positions.push(...vertex2.toArray());
      positions.push(...vertex3.toArray());
      positions.push(...vertex4.toArray());

      uvs.push(0, 0);
      uvs.push(1, 0);
      uvs.push(0, 1);
      uvs.push(1, 1);

      const vertexIdx: number = i * 4;

      indices.push(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2);
      indices.push(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3);
    }

    this.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    this.setIndex(indices);

    this.boundingSphere = new Sphere(new Vector3(), outerRadius);
  }
}
