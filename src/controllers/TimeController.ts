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

  public getDeltaTime(): number {
    return this._clock.getDelta();
  }

  public togglePlayPause(): void {
    this._isPlaying = !this._isPlaying;
    this._simulationSpeed = 1;
    this._mainScene.getUIController().updateSpeedDisplay();
    this._mainScene.getUIController().togglePlayPauseButton();
  }

  public setSpeed(speed: number): void {
    if (!this._isPlaying) {
      this.togglePlayPause();
    }
    this._simulationSpeed = speed;
  }

  public update(): void {
    if (!this._isPlaying) {
      this._mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
        if (celestialBody instanceof Planet)
          (celestialBody as Planet).updateLabel();
        celestialBody.updateLabel();
      });
      return;
    }

    const deltaTime: number = this.getDeltaTime();
    const elapsedTime: number = deltaTime * 1000 * this._simulationSpeed;

    this._currentDate = new Date(this._currentDate.getTime() + elapsedTime);

    this._mainScene.getCelestialObjects().forEach((celestialBody: CelestialBody) => {
      celestialBody.updateRotation();

      if (celestialBody instanceof Planet) {
        celestialBody.updateOrbit();
        celestialBody.setLastOrbitLineUpdateTime(celestialBody.getLastOrbitLineUpdateTime() + elapsedTime);

        const orbitalPeriod: number = PlanetOrbitalPeriod(celestialBody.getBody()) * 24 * 60 * 60 * 1000;

        // Check if it's time to update the orbit line
        if (celestialBody.getLastOrbitLineUpdateTime() >= orbitalPeriod) {
          celestialBody.refreshOrbitLine();
          celestialBody.setLastOrbitLineUpdateTime(0);
        }
      } 
      
      celestialBody.updateLabel();
      
      
    });

    this._mainScene.getUIController().updateDateDisplay();
    this._mainScene.getUIController().updateTimeDisplay();
    this._mainScene.getUIController().updateSpeedDisplay();

    this._clock.elapsedTime = 0;
  }


  public getCurrentDate(): Date {
    return this._currentDate;
  }

  public getSimulationSpeed(): number {
    return this._simulationSpeed;
  }

  public setCurrentDate(currentDate: Date): void {
    this.togglePlayPause();
    this._currentDate = currentDate;
    this.update();

    this.togglePlayPause();
  }

  public getIsPlaying(): boolean {
    return this._isPlaying;
  }
}
