import { MainScene } from '../scenes/MainScene';
import { Intersection, Object3D, Raycaster } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { DateHelper } from '../helper/DateHelper';
import { NextGlobalSolarEclipse, NextLunarEclipse } from 'astronomy-engine';

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
  }

  public addSidebarEventListeners(): void {
    const toggleOrbitsButton = document.getElementById('toggleOrbits');
    const toggleLabelsButton = document.getElementById('toggleLabels');
    const toggleMoonsButton = document.getElementById('toggleMoons');
    const toggleSizeButton = document.getElementById('toggleSize');

    if (toggleOrbitsButton) {
      toggleOrbitsButton.addEventListener('click', () => this._uiController.toggleOrbitLines());
    }

    if (toggleLabelsButton) {
      toggleLabelsButton.addEventListener('click', () => this._uiController.toggleLabels());
    }

    if (toggleMoonsButton) {
      toggleMoonsButton.addEventListener('click', () => this._uiController.toggleMoons());
    }

    if (toggleSizeButton) {
      toggleSizeButton.addEventListener('click', () => this._uiController.toggleRealSize());
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
          const currentDateIcon: HTMLElement | null = document.getElementById('current-date-icon');
          currentDateIcon?.classList.remove('active');
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
      this._mainScene.timeController.currentDate = NextLunarEclipse(this._mainScene.timeController.currentDate).peak.date;
    });

    document.getElementById('info-next-solar-eclipse-button')?.addEventListener('click', () => {
      this._mainScene.timeController.currentDate = NextGlobalSolarEclipse(this._mainScene.timeController.currentDate).peak.date;
    });
  }

  public addControlEventListeners(): void {
    const currentDateIcon: HTMLElement | null = document.getElementById('current-date-icon');


    document.getElementById('sim-speed-slider')?.addEventListener('input', (e) => { 
      this._timeController.simulationSpeed = (<HTMLInputElement>e.target).valueAsNumber; 
      currentDateIcon?.classList.remove('active');
    });
    currentDateIcon?.addEventListener('click', () => {
        currentDateIcon.classList.add('active');
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
      this._mainScene.audioController.playClick(1);
    }
    if (intersectsLabels.length > 0) {
      const object = intersectsLabels[0].object;
      this._mainScene.selectObject((object as unknown as Label).celestialBody);
      this._mainScene.audioController.playClick(1);
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
