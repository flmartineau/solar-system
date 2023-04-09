import { MainScene } from '../scenes/MainScene';
import { Intersection, Line, LineBasicMaterial, Object3D, Raycaster, Vector2 } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { DateHelper } from '../helper/DateHelper';

export class MouseEvents {
  private _mainScene: MainScene;
  private _uiController: UIController;
  private _timeController: TimeController;
  private _raycaster: Raycaster;

  constructor(_mainScene: MainScene) {
    this._mainScene = _mainScene;
    this._uiController = _mainScene.getUIController();
    this._timeController = _mainScene.getTimeController();
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
          let currentDate: Date = this._timeController.getCurrentDate();
          let currentTime: string = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
          let newDateDate: Date = DateHelper.getDateFromString(newDate, 'YYYY-MM-DD');
          this._timeController.setCurrentDate(DateHelper.setTimeToDate(currentTime, newDateDate));
        }
      }
    });

    document.getElementById('current-time')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newTime: string = (<HTMLInputElement>document.getElementById('current-time')).value;
        if (newTime) {
          let currentDate: Date = this._timeController.getCurrentDate();
          this._timeController.setCurrentDate(DateHelper.setTimeToDate(newTime, currentDate));
        }
      }
    });

  }

  public addControlEventListeners(): void {
    document.getElementById('sim-speed-slider')?.addEventListener('input', (e) => { this._timeController.setSpeed((<HTMLInputElement>e.target).valueAsNumber); });
    document.getElementById('current-date-icon')?.addEventListener('click', () => {
        this._timeController.setCurrentDate(new Date()); 
        this._mainScene.getAudioController().playClick(3);
    });
    document.getElementById('play-pause-icon')?.addEventListener('click', () => {
      this._mainScene.getAudioController().playClick(3);
      this._timeController.togglePlayPause();
    });
  }

  public addMusicEventListeners(): void {
    document.getElementById('music-icon')?.addEventListener('click', () => this._mainScene.getUIController().toggleMusicVolume());
  }

  private onClick(event: MouseEvent): void {

    this._mainScene.getCameraController().setFromCamera(event, this._raycaster);

    const celestialObjects: Array<CelestialBody> = this._mainScene.getCelestialObjects();
    const celestialLabels: Array<Label> = this._mainScene.getLabels();
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
      this._mainScene.selectObject((object as unknown as Label).getCelestialBody());
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === '²') {
      this._mainScene.getDevConsoleController().toggleDevConsole();
    }
  
  }



  private onMouseMove(event: MouseEvent): void {
    this._mainScene.getCameraController().setFromCamera(event, this._raycaster);

    const celestialObjects: Array<CelestialBody> = this._mainScene.getCelestialObjects();
    const celestialLabels: Array<Label> = this._mainScene.getLabels();
    const orbitLines: Array<Line> = this._mainScene.getOrbitLines();
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this._raycaster.intersectObjects(celestialLabels);
    if (intersectsObjects.length > 0) {
      this._uiController.showInfo(intersectsObjects[0].object);
    } else if (intersectsLabels.length > 0) {
      this._uiController.showInfo((intersectsLabels[0].object as unknown as Label).getCelestialBody());
    } else if (this._mainScene.getSelectedObject()) {
      this._uiController.showInfo(this._mainScene.getSelectedObject());
    } else {
      this._uiController.hideInfo();
    }
  }

  private onWindowResize(): void {
    this._mainScene.getCameraController().updateOnResize();
    this._mainScene.getRenderer().setSize(window.innerWidth, window.innerHeight);
  }
}
