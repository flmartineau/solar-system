import { MainScene } from '../scenes/MainScene';
import { Intersection, Object3D, Raycaster, Vector2 } from 'three';
import { UIController } from './UIController';
import { TimeController } from './TimeController';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { DateHelper } from '../helper/DateHelper';

export class MouseEvents {
  private mainScene: MainScene;
  private uiController: UIController;
  private timeController: TimeController;
  private raycaster: Raycaster;

  constructor(mainScene: MainScene) {
    this.mainScene = mainScene;
    this.uiController = mainScene.getUIController();
    this.timeController = mainScene.getTimeController();
    this.raycaster = new Raycaster();

    window.addEventListener('click', (event) => this.onClick(event), false);
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

    this.addMusicEventListeners();
  }

  public addDateEventListeners(): void {
    document.getElementById('current-date')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newDate: string = (<HTMLInputElement>document.getElementById('current-date')).value;
        if (newDate) {
          let currentDate: Date = this.timeController.getCurrentDate();
          let currentTime: string = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
          let newDateDate: Date = DateHelper.getDateFromString(newDate, 'YYYY-MM-DD');
          this.timeController.setCurrentDate(DateHelper.setTimeToDate(currentTime, newDateDate));
        }
      }
    });

    document.getElementById('current-time')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newTime: string = (<HTMLInputElement>document.getElementById('current-time')).value;
        if (newTime) {
          let currentDate: Date = this.timeController.getCurrentDate();
          this.timeController.setCurrentDate(DateHelper.setTimeToDate(newTime, currentDate));
        }
      }
    });

  }

  public addControlEventListeners(): void {
    document.getElementById('sim-speed-slider')?.addEventListener('input', (e) => { this.timeController.setSpeed((<HTMLInputElement>e.target).valueAsNumber); });
    document.getElementById('current-date-icon')?.addEventListener('click', () => {
        this.timeController.setCurrentDate(new Date()); 
        this.mainScene.getAudioController().playClick(3);
    });
    document.getElementById('play-pause-icon')?.addEventListener('click', () => {
      this.mainScene.getAudioController().playClick(3);
      this.timeController.togglePlayPause();
    });
  }

  public addMusicEventListeners(): void {
    document.getElementById('music-icon')?.addEventListener('click', () => this.mainScene.getUIController().toggleMusicVolume());
  }

  private onClick(event: MouseEvent): void {

    this.mainScene.getCameraController().setFromCamera(event, this.raycaster);

    const celestialObjects: Array<CelestialBody> = this.mainScene.getCelestialObjects();
    const celestialLabels: Array<Label> = this.mainScene.getLabels();
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this.raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this.raycaster.intersectObjects(celestialLabels);

    if (intersectsObjects.length > 0) {
      const object = intersectsObjects[0].object;
      this.mainScene.selectObject(object as unknown as CelestialBody);
    }
    if (intersectsLabels.length > 0) {
      const object = intersectsLabels[0].object;
      this.mainScene.selectObject((object as unknown as Label).getCelestialBody());
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.mainScene.getCameraController().setFromCamera(event, this.raycaster);

    const celestialObjects: Array<CelestialBody> = this.mainScene.getCelestialObjects();
    const celestialLabels: Array<Label> = this.mainScene.getLabels();
    const intersectsObjects: Array<Intersection<Object3D<Event>>> =
      this.raycaster.intersectObjects(celestialObjects);
    const intersectsLabels: Array<Intersection<Object3D<Event>>> =
      this.raycaster.intersectObjects(celestialLabels);
    if (intersectsObjects.length > 0) {
      this.uiController.showInfo(intersectsObjects[0].object);
    } else if (intersectsLabels.length > 0) {
      this.uiController.showInfo((intersectsLabels[0].object as unknown as Label).getCelestialBody());
    } else if (this.mainScene.getSelectedObject()) {
      this.uiController.showInfo(this.mainScene.getSelectedObject());
    } else {
      this.uiController.hideInfo();
    }
  }

  private onWindowResize(): void {
    this.mainScene.getCameraController().updateOnResize();
    this.mainScene.getRenderer().setSize(window.innerWidth, window.innerHeight);
  }
}
