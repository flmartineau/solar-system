import { UIController } from "../controllers/UIController";
import { TemplateHelper } from "../helper/TemplateHelper";
import { CelestialBody } from "../models/CelestialBody";
import { Label } from "../models/Label";
import { Moon } from "../models/Moon";
import { Planet } from "../models/Planet";
import { MainScene } from "../scenes/MainScene";
import { SettingsModal } from "./SettingsModal";


export class Toolbar {

    private _mainScene: MainScene;
    private _uiController: UIController;

    private _settingsModal: SettingsModal;


    private _labelsVisibility: boolean = true;
    private _moonsVisibility: boolean = true;
    private _realSize: boolean = true;

    /**
     * Create a new Toolbar.
     */
    constructor(mainScene: MainScene, uiController: UIController) {
        this._mainScene = mainScene;
        this._uiController = uiController;
        this._settingsModal = new SettingsModal();
        TemplateHelper.setTemplate('sidebar-container', 'sidebar.html').then(() => {
            this.addEventListeners();
        })
    }


    /**
   * Handles the click events for the sidebar buttons.
   */
    private addEventListeners(): void {
        document.getElementById('toggleOrbits')?.addEventListener('click', () => this.toggleOrbitLines());
        document.getElementById('toggleLabels')?.addEventListener('click', () => this.toggleLabels());
        document.getElementById('toggleMoons')?.addEventListener('click', () => this.toggleMoons());
        document.getElementById('toggleSize')?.addEventListener('click', () => this.toggleRealSize());
        document.getElementById('openSettings')?.addEventListener('click', () => this.openSettings());
        document.getElementById('music-icon')?.addEventListener('click', () => this.toggleMusicVolume());
    }

    get settingsModal(): SettingsModal {
        return this._settingsModal;
    }


    /**
   * @returns {boolean} The current moons visibility state.
   */
    get moonsVisibility(): boolean {
        return this._moonsVisibility;
    }

    /**
     * Set the moons visibility state.
     * @param {boolean} moonsVisibility - The new moons visibility state.
     */
    set moonsVisibility(moonsVisibility: boolean) {
        this._moonsVisibility = moonsVisibility;
        this._uiController.bodiesList.updateCelestialObjectList();
    }

    get isRealSize(): boolean {
        return this._realSize;
    }

    set isRealSize(realSize: boolean) {
        this._realSize = realSize;
    }


    public openSettings(): void {
        this._settingsModal.show();
    }

    public closeSettings(): void {
        this._settingsModal.hide();
    }


    /**
   * Toggle the visibility of orbit lines in the scene.
   */
    public toggleOrbitLines(): void {
        let orbitLinesVisible: boolean = false;
        this._mainScene.planets.forEach((planet: Planet) => {
            planet.orbitLine.visible = !planet.orbitLine.visible;
            orbitLinesVisible = planet.orbitLine.visible;
        });

        this._mainScene.moons.forEach((moon: Moon) => {
            moon.orbitLine.visible = !moon.orbitLine.visible;
            orbitLinesVisible = moon.orbitLine.visible;
        });

        const toggleOrbitsIcon = document.getElementById('toggleOrbits') as HTMLImageElement;
        if (toggleOrbitsIcon) {
            toggleOrbitsIcon.src = orbitLinesVisible ? './assets/icons/orbit_lines_on.png' : 'assets/icons/orbit_lines_off.png';
        }

        this._mainScene.audioController.playClick(2);
    }

    public toggleLabels(): void {
        this._labelsVisibility = !this._labelsVisibility;
        this._mainScene.labels.forEach((label: Label) => {
            label.visible = this._labelsVisibility
        });

        const toggleLabelsIcon = document.getElementById('toggleLabels') as HTMLImageElement;
        if (toggleLabelsIcon) {
            toggleLabelsIcon.src = this._labelsVisibility ? './assets/icons/planet_labels_on.png' : 'assets/icons/planet_labels_off.png';
        }

        this._mainScene.audioController.playClick(2);
    }


    public toggleMoons(value?: boolean): void {

        if (value == undefined && !this._realSize) //disable moons when real size is off
            return;

        this.moonsVisibility = !this.moonsVisibility;
        if (value !== undefined) {
            this.moonsVisibility = value;
        }

        this._mainScene.moonsVisibility = this._moonsVisibility;

        const toggleMoonsIcon = document.getElementById('toggleMoons') as HTMLImageElement;
        if (toggleMoonsIcon) {
            toggleMoonsIcon.src = this._moonsVisibility ? './assets/icons/moons_on.png' : 'assets/icons/moons_off.png';
        }
        this._mainScene.audioController.playClick(2);
    }

    public toggleRealSize(): void {
        this.toggleMoons(!this._realSize);
        this._realSize = !this._realSize;

        const toggleRealSizeIcon = document.getElementById('toggleSize') as HTMLImageElement;
        if (toggleRealSizeIcon) {
            toggleRealSizeIcon.src = this._realSize ? './assets/icons/big_size.png' : 'assets/icons/real_size.png';
        }

        this._mainScene.celestialObjects.forEach((celestialObject: CelestialBody) => {
            celestialObject.setBigSize(!this._realSize);
        });

        if (this._mainScene.selectedObject) {
            this._mainScene.cameraController.centerCameraOnObject(this._mainScene.selectedObject);
        }

        this._mainScene.audioController.playClick(2);
    }

    public toggleMusicVolume(): void {
        const music = document.getElementById('music-icon') as HTMLImageElement;
        if (music) {
    
          this._mainScene.audioController.toggleVolume();
    
          switch (this._mainScene.audioController.volume) {
            case 0:
              music.src = './assets/icons/speaker-mute.png';
              break;
            case 0.5:
              music.src = './assets/icons/speaker-1.png';
              break;
            case 1:
              music.src = './assets/icons/speaker-max.png';
              break;
          }
        }
      }




}