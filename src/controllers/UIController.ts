import { CelestialBody } from '../components/celestial/CelestialBody';
import { Label } from '../components/celestial/Label';
import { Moon } from '../components/celestial/Moon';
import { Planet } from '../components/celestial/Planet';
import { DateHelper } from '../helper/DateHelper';
import { MainScene } from '../scenes/MainScene';

export class UIController {
  private _mainScene: MainScene;
  private _celestialObjectList: HTMLElement | null;

  private _labelsVisibility: boolean = true;
  private _moonsVisibility: boolean = true;

  constructor(mainScene: MainScene) {
    this._mainScene = mainScene;
    this._celestialObjectList = document.getElementById('celestial-body-list');
  }

  public createCelestialObjectList() {
    if (!this._celestialObjectList) return;
    document.getElementById('right-sidebar')?.appendChild(this._celestialObjectList);

    this._mainScene.celestialObjects.forEach((celestialObject: CelestialBody) => {

      if (!this.moonsVisibility && celestialObject instanceof Moon) 
        return;

      const listItem = document.createElement('li');
      listItem.textContent = celestialObject.name;
      listItem.addEventListener('click', () => {
        this._mainScene.selectObject(celestialObject);
        this._mainScene.audioController.playClick(1);
      });
      this._celestialObjectList?.appendChild(listItem);
    });
  }

  public updateCelestialObjectList() {
    if (!this._celestialObjectList) return;
    this._celestialObjectList.innerHTML = '';
    this.createCelestialObjectList();
  }

  get moonsVisibility(): boolean {
    return this._moonsVisibility;
  }

  set moonsVisibility(moonsVisibility: boolean) {
    this._moonsVisibility = moonsVisibility;
    this.updateCelestialObjectList();
  }

  get infoElement(): HTMLElement {
    return document.getElementById('info') as HTMLElement;
  }

  get currentDateElement(): HTMLInputElement {
    return document.getElementById('current-date') as HTMLInputElement;
  }

  get currentTimeElement(): HTMLInputElement {
    return document.getElementById('current-time') as HTMLInputElement;
  }

  public showInfo(celestialObject: any): void {

    if (this.infoElement) {

      let infoName: HTMLElement = document.getElementById('info-name-value') as HTMLElement;
      infoName.innerHTML = celestialObject.name;

      let infoMass: HTMLElement = document.getElementById('info-mass-value') as HTMLElement;
      infoMass.innerHTML = `${celestialObject.mass} kg`;

      let infoTemperature: HTMLElement = document.getElementById('info-temperature-value') as HTMLElement;
      infoTemperature.innerHTML = `${celestialObject.temperature} K`;

      let infoDistanceFromSun: HTMLElement = document.getElementById('info-distance-sun-value') as HTMLElement;
      infoDistanceFromSun.innerHTML = `${celestialObject.distanceToSun} km`;
      document.getElementById('info-distance-sun')!.style.display = (celestialObject instanceof Planet) ? 'flex' : 'none';

      let infoDistanceFromPlanet: HTMLElement = document.getElementById('info-distance-planet-value') as HTMLElement;
      infoDistanceFromPlanet.innerHTML = `${celestialObject.distanceToPlanet} km`;
      document.getElementById('info-distance-planet')!.style.display = (celestialObject instanceof Moon) ? 'flex' : 'none';


      let infoOrbitalPeriod: HTMLElement = document.getElementById('info-orbital-period-value') as HTMLElement;
      infoOrbitalPeriod.innerHTML = `${celestialObject.orbitalPeriod} days`;
      document.getElementById('info-orbital-period')!.style.display = (celestialObject instanceof Planet) ? 'flex' : 'none';


      let infoNextLunarEclipse: HTMLButtonElement = document.getElementById('info-next-lunar-eclipse') as HTMLButtonElement;
      infoNextLunarEclipse.style.display = (celestialObject.name === 'Moon') ? 'flex' : 'none';

      let infoNextSolarEclipse: HTMLButtonElement = document.getElementById('info-next-solar-eclipse') as HTMLButtonElement;
      infoNextSolarEclipse.style.display = (celestialObject.name === 'Earth') ? 'flex' : 'none';

      this.infoElement.style.display = 'block';
    }

  }

  public hideInfo(): void {
    if (this._mainScene.selectedObject !== null)
      return;
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }

  public togglePlayPauseButton(): void {
    const playPauseButton = document.getElementById('play-pause-icon') as HTMLImageElement;
    if (playPauseButton) {
      playPauseButton.src = this._mainScene.timeController.isPlaying ? './assets/icons/pause_button.png' : './assets/icons/play_button.png';
    }
  }


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


  public toggleMoons(): void {
    this.moonsVisibility = !this.moonsVisibility;

    this._mainScene.moonsVisibility = this._moonsVisibility;

    const toggleMoonsIcon = document.getElementById('toggleMoons') as HTMLImageElement;
    if (toggleMoonsIcon) {
      toggleMoonsIcon.src = this._moonsVisibility ? './assets/icons/moons_on.png' : 'assets/icons/moons_off.png';
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

  public updateTimeDisplay() {
    let simulationSpeed: number = this._mainScene.timeController.simulationSpeed;
    let currentDate: Date = this._mainScene.timeController.currentDate;
    if (this.currentTimeElement && simulationSpeed !== 0) {
      this.currentTimeElement.value = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
    }
  }

  public updateDateDisplay() {
    let simulationSpeed: number = this._mainScene.timeController.simulationSpeed;
    let currentDate: Date = this._mainScene.timeController.currentDate;
    if (this.currentDateElement && simulationSpeed !== 0) {
      this.currentDateElement.value = DateHelper.formatDateFromFormat(currentDate, 'YYYY-MM-DD');
    }

  }

  public updateSpeedDisplay() {
    let simulationSpeed: number = this._mainScene.timeController.simulationSpeed;
    const speedElement: HTMLInputElement = document.getElementById('simulation-speed') as HTMLInputElement;
    if (speedElement) {
      speedElement.innerText = this.getSpeedString(simulationSpeed);
    }
    this.updateSpeedSlider();
  }

  public updateSpeedSlider() {
    let simulationSpeed: number = this._mainScene.timeController.simulationSpeed;
    const speedSlider: HTMLInputElement = document.getElementById('sim-speed-slider') as HTMLInputElement;
    if (speedSlider) {
      speedSlider.value = simulationSpeed.toString();
    }
  }

  private getSpeedString(speed: number): string {
    if (Math.abs(speed) < 60) {
      return speed + ' sec/sec';
    } else if (Math.abs(speed) < 3600) {
      return (speed / 60).toFixed(2) + ' min/sec';
    } else if (Math.abs(speed) < 86400) {
      return (speed / 3600).toFixed(2) + ' h/sec';
    } else if (Math.abs(speed) < 31536000) {
      return (speed / 86400).toFixed(2) + ' d/sec';
    } else if (Math.abs(speed) < 3153600000) {
      return (speed / 31536000).toFixed(2) + ' y/sec';
    } else {
      return '0 sec/sec';
    }
  }


}
