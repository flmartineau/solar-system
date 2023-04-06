import { PerspectiveCamera, Vector3, WebGLRenderer, Raycaster, Vector2 } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MainScene } from '../scenes/MainScene';
import { CelestialBody } from '../components/celestial/CelestialBody';


export class CameraController {
  private camera: PerspectiveCamera;
  private focusedObject: CelestialBody | null;
  private cameraOffset: Vector3;
  private controls: OrbitControls;
  private mainScene: MainScene;
  private renderer: WebGLRenderer;

  constructor(mainScene: MainScene) {

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000000);
    this.camera.position.z = 200;

    this.focusedObject = null;
    this.cameraOffset = new Vector3();

    this.controls = new OrbitControls(this.camera, mainScene.getRenderer().domElement);
    this.controls.addEventListener('change', () => this.onControlsChange());
    this.mainScene = mainScene;
    this.renderer = mainScene.getRenderer();
  }


  public getCamera(): PerspectiveCamera {
    return this.camera;
  }


  public setFocusedObject(object: CelestialBody | null): void {
    if (object == null || object.name != "") {
      this.focusedObject = object;
    }
  }

  private onControlsChange(): void {
    if (this.focusedObject) {
      this.cameraOffset.copy(this.camera.position).sub(this.focusedObject.position);
    }
  }

  public centerCameraOnObject(object: CelestialBody): void {

    if (!(object instanceof CelestialBody))
      return;

    const initialDistance: number = this.camera.position.distanceTo(object.position);

    this.controls.target.copy(object.position);
    this.controls.update();

    const newDistance: number = this.camera.position.distanceTo(object.position);
    const scalingFactor: number = initialDistance / newDistance;
    const newPosition: Vector3 = this.camera.position.clone().sub(object.position).multiplyScalar(scalingFactor).add(object.position);
    this.camera.position.copy(newPosition);
    this.controls.update();

    if (object == null || object.name != "") {
      this.setFocusedObject(object);
      this.cameraOffset.copy(this.camera.position).sub(object.position);
    }

    // Set the minDistance property to prevent clipping
    this.controls.minDistance = object.getRadius() * 1.1;
  }

  public async zoomToObject(object: CelestialBody): Promise<void> {
    const currentDistance: number = this.camera.position.distanceTo(object.position);
    const steps: number = 30;

    const targetDistance: number = object.getRadius() * 3;

    if (currentDistance < targetDistance)
      return;


    const distanceStep: number = (currentDistance - (targetDistance + object.getRadius())) / steps;

    for (let i: number = 0; i < steps; i++) {
      const newPosition: Vector3 = this.camera.position.clone().sub(object.position).normalize().multiplyScalar(-distanceStep).add(this.camera.position);
      this.camera.position.copy(newPosition);
      this.controls.update();
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 16));
    }
  }


  public update(): void {
    if (this.focusedObject) {
      this.camera.position.copy(this.focusedObject.position).add(this.cameraOffset);
      this.controls.target.copy(this.focusedObject.position);
      this.controls.update();
    }
    this.renderer.render(this.mainScene.getScene(), this.camera);
  }


  public updateOnResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  public setFromCamera(event: MouseEvent, raycaster: Raycaster): void {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
  }

}
