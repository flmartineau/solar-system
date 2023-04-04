import { MainScene } from '../scenes/MainScene';
import { Raycaster, Vector2 } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import {Body, PlanetOrbitalPeriod} from 'astronomy-engine'
import { DateHelper } from '../helper/DateHelper';

export class MouseEvents {
  private mainScene: MainScene;
  private uiController: UIController;
  private timeController: TimeController;
  private raycaster: Raycaster;
  private mouse: Vector2;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
    this.uiController = mainScene.uiController;
    this.timeController = mainScene.timeController;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    // Add the click event listener
    window.addEventListener('click', (event) => this.onClick(event), false);

    // Add the mouse move event listener
    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);

    window.addEventListener('resize', () => this.onWindowResize(), false);

    const toggleOrbitsButton = document.getElementById('toggleOrbits');
    const toggleLabelsButton = document.getElementById('toggleLabels');

    if (toggleOrbitsButton) {
      toggleOrbitsButton.addEventListener('click', () => this.uiController.toggleOrbitLines());
    }

    if (toggleLabelsButton) {
      toggleLabelsButton.addEventListener('click', () => this.uiController.toggleLabels());
    }
  }

  public addDateEventListeners(): void {
    document.getElementById('current-date')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newDate = (<HTMLInputElement>document.getElementById('current-date')).value;
        if (newDate) {
          let currentDate: Date = this.timeController.getCurrentDate();
          let currentTime: string = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
          let newDateDate = DateHelper.getDateFromString(newDate, 'YYYY-MM-DD'); 
          this.timeController.setCurrentDate(DateHelper.setTimeToDate(currentTime, newDateDate));
        }
      }
    });

    document.getElementById('current-time')?.addEventListener('keypress', (e) => {

      if (e.key === 'Enter') {
        let newTime = (<HTMLInputElement>document.getElementById('current-time')).value;
        if (newTime) {
          let currentDate: Date = this.timeController.getCurrentDate();
          this.timeController.setCurrentDate(DateHelper.setTimeToDate(newTime, currentDate));
        }
      }
    });



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
    const intersectsLabels = this.raycaster.intersectObjects(celestialLabels);

    if (intersectsObjects.length > 0) {
      const object = intersectsObjects[0].object;
      this.mainScene.selectObject(object as CelestialBody);
    }
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
    } else if (this.mainScene.selectedObject) {
        this.uiController.showInfo(this.mainScene.selectedObject);
    } else {
        this.uiController.hideInfo();
      }
  }

  private onWindowResize(): void {
    this.mainScene.cameraController.updateOnResize();
    this.mainScene.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
