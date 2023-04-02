import { MainScene } from '../scenes/MainScene';
import { Raycaster, Vector2, Mesh } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';

export class MouseEvents {
  private mainScene: MainScene;
  private uiController: UIController;
  private timeController: TimeController;
  private raycaster: Raycaster;
  private mouse: Vector2;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
    this.uiController = new UIController(mainScene);
    this.timeController = mainScene.timeController;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

     // Add the click event listener
     window.addEventListener('click', (event) => this.onClick(event), false);

     // Add the mouse move event listener
     window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);

     window.addEventListener('resize', () => this.onWindowResize(), false);

 
     
  }

  public addControlEventListeners(): void {
    // Add event listeners for UI elements
    document.getElementById('play-pause')?.addEventListener('click', () => this.timeController.togglePlayPause());
    document.getElementById('forward-x10')?.addEventListener('click', () => this.timeController.setSpeed(10));
    document.getElementById('forward-x100')?.addEventListener('click', () => this.timeController.setSpeed(100));
    document.getElementById('forward-x1000')?.addEventListener('click', () => this.timeController.setSpeed(1000));
    document.getElementById('backward-x10')?.addEventListener('click', () => this.timeController.setSpeed(-10));
    document.getElementById('backward-x100')?.addEventListener('click', () => this.timeController.setSpeed(-100));
    document.getElementById('backward-x1000')?.addEventListener('click', () => this.timeController.setSpeed(-1000));
  }

  private onClick(event: MouseEvent): void {

    this.mainScene.cameraController.setFromCamera(event, this.raycaster);

    const celestialObjects = this.mainScene.getCelestialObjects();
    const celestialLabels = this.mainScene.getLabels();
    const intersectsObjects = this.raycaster.intersectObjects(celestialObjects);

    if (intersectsObjects.length > 0) {
      const object = intersectsObjects[0].object;
      this.mainScene.selectObject(object as CelestialBody);
    }

    const intersectsLabels = this.raycaster.intersectObjects(celestialLabels);
    if (intersectsLabels.length > 0) {
      const object = intersectsLabels[0].object;
      this.mainScene.selectObject((object as Label).getCelestialBody());
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.mainScene.cameraController.setFromCamera(event, this.raycaster);

    const celestialObjects = this.mainScene.getCelestialObjects();
    const celestialLabels = this.mainScene.getLabels();
    const intersectsObjects = this.raycaster.intersectObjects(celestialObjects);
    const intersectsLabels = this.raycaster.intersectObjects(celestialLabels);

    if (intersectsObjects.length > 0) {
      this.uiController.showInfo(intersectsObjects[0].object);
    } else if (intersectsLabels.length > 0) {
      this.uiController.showInfo((intersectsLabels[0].object as Label).getCelestialBody());
    } else {
      this.uiController.hideInfo();
    }
  }

  private onWindowResize(): void {
    this.mainScene.cameraController.updateOnResize();
    this.mainScene.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
