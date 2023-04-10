import { MainScene } from '../scenes/MainScene';
import { Intersection, Object3D, Raycaster } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { DateHelper } from '../helper/DateHelper';
import { Moon } from '../components/celestial/Moon';

export class MouseEvents {
  private _mainScene: MainScene;
  private _uiController: UIController;
  private _timeController: TimeController;
  private _raycaster: Raycaster;

  constructor(_mainScene: MainScene) {
    this._mainScene = _mainScene;
    this._uiController = _mainScene.uiController;
    this._timeController = _mainScene.timeController;
    this._raycaster = new Raycaster();

    window.addEventListener('click', (event) => this.onClick(event), false);
    window.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    window.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
    window.addEventListener('resize', () => this.onWindowResize(), false);

    const toggleOrbitsButton = document.getElementById('toggleOrbits');
    const toggleLabelsButton = document.getElementById('toggleLabels');
    const toggleMoonsButton = document.getElementById('toggleMoons');

    if (toggleOrbitsButton) {
      toggleOrbitsButton.addEventListener('click', () => this._uiController.toggleOrbitLines());
    }

    if (toggleLabelsButton) {
      toggleLabelsButton.addEventListener('click', () => this._uiController.toggleLabels());
    }

    if (toggleMoonsButton) {
      toggleMoonsButton.addEventListener('click', () => this._uiController.toggleMoons());
    }

    this.addMusicEventListeners();
  }

  public addDateEventListeners(): void {
    document.getElementById('current-date')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newDate: string = (<HTMLInputElement>document.getElementById('current-date')).value;
        if (newDate) {
          let currentDate: Date = this._timeController.currentDate;
          let currentTime: string = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
          let newDateDate: Date = DateHelper.getDateFromString(newDate, 'YYYY-MM-DD');
          this._timeController.currentDate = DateHelper.setTimeToDate(currentTime, newDateDate);
        }
      }
    });

    document.getElementById('current-time')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newTime: string = (<HTMLInputElement>document.getElementById('current-time')).value;
        if (newTime) {
          let currentDate: Date = this._timeController.currentDate;
          this._timeController.currentDate = DateHelper.setTimeToDate(newTime, currentDate);
        }
      }
    });

  }

  public addInfoEventListeners(): void {
    document.getElementById('info-next-lunar-eclipse-button')?.addEventListener('click', () => {
      let celestialObject: Moon = this._mainScene.moons[0];
      this._mainScene.timeController.currentDate = celestialObject.nextLunarEclipse;
    });

    document.getElementById('info-next-solar-eclipse-button')?.addEventListener('click', () => {
      this._mainScene.timeController.currentDate = this._mainScene.earth.nextSolarEclipse;
    });
  }

  public addControlEventListeners(): void {
    document.getElementById('sim-speed-slider')?.addEventListener('input', (e) => { this._timeController.simulationSpeed = (<HTMLInputElement>e.target).valueAsNumber; });
    document.getElementById('current-date-icon')?.addEventListener('click', () => {
        this._timeController.currentDate = new Date(); 
        this._mainScene.audioController.playClick(3);
    });
    document.getElementById('play-pause-icon')?.addEventListener('click', () => {
      this._mainScene.audioController.playClick(3);
      this._timeController.togglePlayPause();
    });
  }

  public addMusicEventListeners(): void {
    document.getElementById('music-icon')?.addEventListener('click', () => this._mainScene.uiController.toggleMusicVolume());
  }

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
    }
    if (intersectsLabels.length > 0) {
      const object = intersectsLabels[0].object;
      this._mainScene.selectObject((object as unknown as Label).celestialBody);
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === '²') {
      this._mainScene.devConsoleController.toggleDevConsole();
    }
  
  }

  private onMouseMove(event: MouseEvent): void {
    this._mainScene.cameraController.setFromCamera(event, this._raycaster);

    const celestialObjects: Array<CelestialBody> = this._mainScene.celestialObjects;
    const celestialLabels: Array<Label> = this._mainScene.labels;
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialLabels);
    if (intersectsObjects.length > 0) {
      this._uiController.showInfo(intersectsObjects[0].object);
    } else if (intersectsLabels.length > 0) {
      this._uiController.showInfo((intersectsLabels[0].object as unknown as Label).celestialBody);
    } else if (this._mainScene.selectedObject) {
      this._uiController.showInfo(this._mainScene.selectedObject);
    } else {
      this._uiController.hideInfo();
    }
  }

  private onWindowResize(): void {
    this._mainScene.cameraController.updateOnResize();
    this._mainScene.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
