import { Label } from '../components/celestial/Label';
import { Moon } from '../components/celestial/Moon';
import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { DateHelper } from '../helper/DateHelper';
import { MainScene } from '../scenes/MainScene';

export class UIController {
  private _mainScene: MainScene;
  private celestialObjectList: HTMLElement | null;

  constructor(mainScene: MainScene) {
    this._mainScene = mainScene;
    this.celestialObjectList = document.getElementById('celestial-body-list');
  }

  public createCelestialObjectList() {
    if (!this.celestialObjectList) return;
    document.getElementById('right-sidebar')?.appendChild(this.celestialObjectList);

    this._mainScene.getCelestialObjects().forEach((celestialObject) => {
      const listItem = document.createElement('li');
      listItem.textContent = celestialObject.name;
      listItem.addEventListener('click', () => {
        this._mainScene.selectObject(celestialObject);
        this._mainScene.getAudioController().playClick(1);
      });
      this.celestialObjectList?.appendChild(listItem);
    });
  }

  public getInfoElement(): HTMLElement {
    return document.getElementById('info') as HTMLElement;
  }

  public getCurrentDateElement(): HTMLInputElement {
    return document.getElementById('current-date') as HTMLInputElement;
  }

  public getCurrentTimeElement(): HTMLInputElement {
    return document.getElementById('current-time') as HTMLInputElement;
  }

  public showInfo(celestialObject: any): void {
    const infoElement = this.getInfoElement();

    if (celestialObject instanceof Star) {
      if (infoElement) {
        infoElement.innerHTML = `
          <strong>Name:</strong> ${celestialObject.name}<br>
          <strong>Mass:</strong> ${celestialObject.getMass()} kg<br>
          <strong>Temperature:</strong> ${celestialObject.getTemperature()} K
        `;
        infoElement.style.display = 'block';
      }

    } else if (celestialObject instanceof Planet) {
      if (infoElement) {
        infoElement.innerHTML = `
          <strong>Name: </strong> ${celestialObject.name}<br>
          <strong>Mass: </strong> ${celestialObject.getMass()} kg<br>
          <strong>Temperature: </strong> ${celestialObject.getTemperature()} K<br>
          <strong>Distance From Sun: </strong> ${celestialObject.getDistanceToSun()} km<br>
          <strong>Orbital Period: </strong> ${celestialObject.getOrbitalPeriod()} days
        `;
        infoElement.style.display = 'block';
      }
    } else if (celestialObject instanceof Moon) {
      if (infoElement) {
        infoElement.innerHTML = `
          <strong>Name: </strong> ${celestialObject.name}<br>
          <strong>Mass: </strong> ${celestialObject.getMass()} kg<br>
          <strong>Temperature: </strong> ${celestialObject.getTemperature()} K<br>
        `;
        infoElement.style.display = 'block';
      }
    
    
    }
  }

  public hideInfo(): void {
    if (this._mainScene.getSelectedObject() !== null) 
      return;
    const infoElement = document.getElementById('info');
    if (infoElement) {
      infoElement.style.display = 'none';
    }
  }

  public togglePlayPauseButton(): void {
    const playPauseButton = document.getElementById('play-pause-icon') as HTMLImageElement;
    if (playPauseButton) {
      playPauseButton.src = this._mainScene.getTimeController().getIsPlaying() ? './assets/icons/pause_button.png' : './assets/icons/play_button.png';
    }
  }


  public toggleOrbitLines(): void {
    let orbitLinesVisible = false;
    this._mainScene.getPlanets().forEach((planet: Planet) => {
      planet.getOrbitLine().visible = !planet.getOrbitLine().visible;
      orbitLinesVisible = planet.getOrbitLine().visible;
    });

    this._mainScene.getMoons().forEach((moon: Moon) => {
      moon.getOrbitLine().visible = !moon.getOrbitLine().visible;
      orbitLinesVisible = moon.getOrbitLine().visible;
    });

    const toggleOrbitsIcon = document.getElementById('toggleOrbits') as HTMLImageElement;
    if (toggleOrbitsIcon) {
      toggleOrbitsIcon.src = orbitLinesVisible ? './assets/icons/orbit_lines_on.png' : 'assets/icons/orbit_lines_off.png';
    }

    this._mainScene.getAudioController().playClick(2);
  }

  public toggleLabels(): void {
    let labelsVisible = false;

    this._mainScene.getLabels().forEach((label: Label) => {
      label.visible = !label.visible;
      labelsVisible = label.visible;
    });

    const toggleLabelsIcon = document.getElementById('toggleLabels') as HTMLImageElement;
    if (toggleLabelsIcon) {
      toggleLabelsIcon.src = labelsVisible ? './assets/icons/planet_labels_on.png' : 'assets/icons/planet_labels_off.png';
    }

    this._mainScene.getAudioController().playClick(2);
  }


  public toggleMusicVolume(): void {
    const music = document.getElementById('music-icon') as HTMLImageElement;
    if (music) {

      this._mainScene.getAudioController().toggleVolume();

      switch (this._mainScene.getAudioController().getVolume()) {
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
    let simulationSpeed: number = this._mainScene.getTimeController().getSimulationSpeed();
    let currentDate: Date = this._mainScene.getTimeController().getCurrentDate();
    const timeElement: HTMLInputElement = this.getCurrentTimeElement();
    if (timeElement && simulationSpeed !== 0) {
      timeElement.value = DateHelper.formatDateFromFormat(currentDate, 'HH:mm:ss');
    }
  }

  public updateDateDisplay() {
    let simulationSpeed: number = this._mainScene.getTimeController().getSimulationSpeed();
    let currentDate: Date = this._mainScene.getTimeController().getCurrentDate();
    const dateElement: HTMLInputElement = this.getCurrentDateElement();
    if (dateElement && simulationSpeed !== 0) {
      dateElement.value = DateHelper.formatDateFromFormat(currentDate, 'YYYY-MM-DD');
    }

  }

  public updateSpeedDisplay() {
    let simulationSpeed: number = this._mainScene.getTimeController().getSimulationSpeed();
    const speedElement: HTMLInputElement = document.getElementById('simulation-speed') as HTMLInputElement;
    if (speedElement) {
      speedElement.innerText = this.getSpeedString(simulationSpeed);
    }
    this.updateSpeedSlider();
  }

  public updateSpeedSlider() {
    let simulationSpeed: number = this._mainScene.getTimeController().getSimulationSpeed();
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
