import { PerspectiveCamera, Vector3, WebGLRenderer, Raycaster, Vector2 } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MainScene } from '../scenes/MainScene';
import { CelestialBody } from '../components/celestial/CelestialBody';


export class CameraController {
  private _camera: PerspectiveCamera;
  private _focusedObject: CelestialBody | null;
  private _cameraOffset: Vector3;
  private _controls: OrbitControls;
  private _mainScene: MainScene;
  private _renderer: WebGLRenderer;

  private minClippingDistance: number;

  constructor(mainScene: MainScene) {

    this.minClippingDistance = 1.1;

    mainScene.getDevConsoleController().addFolder('Camera').add(this, 'minClippingDistance', 0, 1.1);

    this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 2000000);
    this._camera.position.z = 200;

    this._focusedObject = null;
    this._cameraOffset = new Vector3();

    this._controls = new OrbitControls(this._camera, mainScene.getRenderer().domElement);
    this._controls.addEventListener('change', () => this.onControlsChange());
    this._mainScene = mainScene;
    this._renderer = mainScene.getRenderer();
  }


  public getCamera(): PerspectiveCamera {
    return this._camera;
  }

  public distanceToObject(object: CelestialBody): number {
    return this._camera.position.distanceTo(object.position);
  }


  public setFocusedObject(object: CelestialBody | null): void {
    if (object == null || object.name != "") {
      this._focusedObject = object;
    }
  }

  private onControlsChange(): void {
    if (this._focusedObject) {
      this._cameraOffset.copy(this._camera.position).sub(this._focusedObject.position);
    }
  }

  public centerCameraOnObject(object: CelestialBody): void {

    if (!(object instanceof CelestialBody))
      return;

    const initialDistance: number = this._camera.position.distanceTo(object.position);

    this._controls.target.copy(object.position);
    this._controls.update();

    const newDistance: number = this._camera.position.distanceTo(object.position);
    const scalingFactor: number = initialDistance / newDistance;
    const newPosition: Vector3 = this._camera.position.clone().sub(object.position).multiplyScalar(scalingFactor).add(object.position);
    this._camera.position.copy(newPosition);
    this._controls.update();

    if (object == null || object.name != "") {
      this.setFocusedObject(object);
      this._cameraOffset.copy(this._camera.position).sub(object.position);
    }

    // Set the minDistance property to prevent clipping
    this._controls.minDistance = object.getRadius() * this.minClippingDistance;
  }

  public async zoomToObject(object: CelestialBody): Promise<void> {
    const currentDistance: number = this._camera.position.distanceTo(object.position);
    const steps: number = 30;

    const targetDistance: number = object.getRadius() * 3;

    if (currentDistance < targetDistance)
      return;


    const distanceStep: number = (currentDistance - (targetDistance + object.getRadius())) / steps;

    for (let i: number = 0; i < steps; i++) {
      const newPosition: Vector3 = this._camera.position.clone().sub(object.position).normalize().multiplyScalar(-distanceStep).add(this._camera.position);
      this._camera.position.copy(newPosition);
      this._controls.update();
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 16));
    }
  }


  public update(): void {
    if (this._focusedObject) {
      this._camera.position.copy(this._focusedObject.position).add(this._cameraOffset);
      this._controls.target.copy(this._focusedObject.position);
      this._controls.update();
    }
    this._renderer.render(this._mainScene.getScene(), this._camera);
  }


  public updateOnResize(): void {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  public setFromCamera(event: MouseEvent, raycaster: Raycaster): void {
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this._camera);
  }

}
