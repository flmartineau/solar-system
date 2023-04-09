import { Clock } from 'three';
import { CelestialBody } from '../components/celestial/CelestialBody';
import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { MainScene } from '../scenes/MainScene';
import { PlanetOrbitalPeriod } from 'astronomy-engine';

export class TimeController {
  private _currentDate: Date;
  private _simulationSpeed: number;
  private _isPlaying: boolean;
  private _clock: Clock;

  private _mainScene: MainScene;

  constructor(mainScene: MainScene) {
    this._mainScene = mainScene;
    this._currentDate = new Date();
    this._simulationSpeed = 1;
    this._isPlaying = true;
    this._clock = new Clock();
  }

  get deltaTime(): number {
    return this._clock.getDelta();
  }

  get simulationSpeed(): number {
    return this._simulationSpeed;
  }

  set simulationSpeed(speed: number) {
    if (!this._isPlaying) {
      this.togglePlayPause();
    }
    this._simulationSpeed = speed;
  }

  get currentDate(): Date {
    return this._currentDate;
  }

  set currentDate(currentDate: Date) {
    this.togglePlayPause();
    this._currentDate = currentDate;
    this.update();

    this.togglePlayPause();
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }


  public togglePlayPause(): void {
    this._isPlaying = !this._isPlaying;
    this._simulationSpeed = 1;
    this._mainScene.uiController.updateSpeedDisplay();
    this._mainScene.uiController.togglePlayPauseButton();
  }

  public update(): void {
    if (!this._isPlaying) {
      this._mainScene.celestialObjects.forEach((celestialBody: CelestialBody) => {
        if (celestialBody instanceof Planet)
          (celestialBody as Planet).updateLabel();
        celestialBody.updateLabel();
      });
      return;
    }

    const elapsedTime: number =  this.deltaTime * 1000 * this._simulationSpeed;

    this._currentDate = new Date(this._currentDate.getTime() + elapsedTime);

    this._mainScene.celestialObjects.forEach((celestialBody: CelestialBody) => {
      celestialBody.updateRotation();

      if (celestialBody instanceof Planet) {
        celestialBody.updateOrbit();
        celestialBody.lastOrbitLineUpdateTime = celestialBody.lastOrbitLineUpdateTime + elapsedTime;

        const orbitalPeriod: number = PlanetOrbitalPeriod(celestialBody.body) * 24 * 60 * 60 * 1000;

        // Check if it's time to update the orbit line
        if (celestialBody.lastOrbitLineUpdateTime >= orbitalPeriod) {
          celestialBody.refreshOrbitLine();
          celestialBody.lastOrbitLineUpdateTime = 0;
        }
      } 
      
      celestialBody.updateLabel();

      if (celestialBody instanceof Star) {
        let distanceToCamera = this._mainScene.cameraController.distanceToObject(celestialBody);
        celestialBody.visible = (distanceToCamera < 3000);
      }
      
      
    });

    this._mainScene.uiController.updateDateDisplay();
    this._mainScene.uiController.updateTimeDisplay();
    this._mainScene.uiController.updateSpeedDisplay();

    this._clock.elapsedTime = 0;
  }
}
