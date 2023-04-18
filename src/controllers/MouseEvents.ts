import { MainScene } from '../scenes/MainScene';
import { Intersection, Object3D, Raycaster } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../models/CelestialBody';
import { Label } from '../models/Label';

export class MouseEvents {
  private _mainScene: MainScene;
  private _uiController: UIController;
  private _raycaster: Raycaster;

  constructor(_mainScene: MainScene) {
    this._mainScene = _mainScene;
    this._uiController = _mainScene.uiController;
    this._raycaster = new Raycaster();

    window.addEventListener('click', (event) => this.onClick(event), false);
    window.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  /**
   * Handles the click events.
   * @param event The click event.
   */
  private onClick(event: MouseEvent): void {

    this._mainScene.cameraController.setFromCamera(event, this._raycaster);

    const celestialObjects: Array<CelestialBody> = this._mainScene.celestialObjects;
    const celestialLabels: Array<Label> = this._mainScene.labels;
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialLabels);

    if (intersectsObjects.length > 0) {
      const object = intersectsObjects[0].object;
      this._mainScene.selectObject(object as unknown as CelestialBody);
      this._mainScene.audioController.playClick(1);
    }
    if (intersectsLabels.length > 0) {
      const object = intersectsLabels[0].object;
      this._mainScene.selectObject((object as unknown as Label).celestialBody);
      this._mainScene.audioController.playClick(1);
    }
  }

  /**
   * Handles the keydown events.
   * @param event The keydown event.
   */
  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === '²') {
      this._mainScene.devConsoleController.toggleDevConsole();
    }

  }

  /**
   * Handles the mousemove events.
   * @param event The mousemove event.
   */
  private onMouseMove(event: MouseEvent): void {
    this._mainScene.cameraController.setFromCamera(event, this._raycaster);

    const celestialObjects: Array<CelestialBody> = this._mainScene.celestialObjects;
    const celestialLabels: Array<Label> = this._mainScene.labels;
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialLabels);
    if (intersectsObjects.length > 0) {
      this._uiController.infoPanel.showInfo(intersectsObjects[0].object);
    } else if (intersectsLabels.length > 0) {
      this._uiController.infoPanel.showInfo((intersectsLabels[0].object as unknown as Label).celestialBody);
    } else if (this._mainScene.selectedObject) {
      this._uiController.infoPanel.showInfo(this._mainScene.selectedObject);
    } else {
      this._uiController.infoPanel.hideInfo();
    }
  }

  /**
   * Handles the window resize.
   */
  private onWindowResize(): void {
    this._mainScene.cameraController.updateOnResize();
    this._mainScene.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
