import { Clock } from 'three';
import { CelestialBody } from '../models/CelestialBody';
import { MainScene } from '../scenes/MainScene';

/**
 * TimeController manages the passage of time in the simulation, 
 * allowing for the control of playback speed and the updating of celestial objects.
 */
export class TimeController {
  private _currentDate: Date;
  private _simulationSpeed: number;
  private _elapsedTime: number;
  private _isPlaying: boolean;
  private _clock: Clock;

  private _mainScene: MainScene;

  /**
   * Create a new TimeController.
   * @param mainScene - The main scene to which the TimeController is attached.
   */
  constructor(mainScene: MainScene) {
    this._mainScene = mainScene;
    this._currentDate = new Date();
    this._simulationSpeed = 1;
    this._isPlaying = true;
    this._clock = new Clock();
    this._elapsedTime = this.deltaTime * 1000 * this._simulationSpeed;
  }

  get deltaTime(): number {
    return this._clock.getDelta();
  }

  get simulationSpeed(): number {
    return this._simulationSpeed;
  }

  get elapsedTime(): number {
    return this._elapsedTime;
  }

  set elapsedTime(elapsedTime: number) {
    this._elapsedTime = elapsedTime;
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


  /**
   * Toggle the playback state of the simulation between play and pause.
   */
  public togglePlayPause(): void {
    this._isPlaying = !this._isPlaying;
    this._simulationSpeed = this._isPlaying ? 1 : 0;
    this._mainScene.uiController.controlPanel.updateSpeedDisplay();
    this._mainScene.uiController.controlPanel.togglePlayPauseButton();
  }

  /**
   * Update the time and celestial objects in the simulation.
   */
  public update(): void {
    if (!this._isPlaying) {
      this._mainScene.celestialObjects.forEach((celestialBody: CelestialBody) => {
        celestialBody.updateLabel();
        let distanceToCamera: number = this._mainScene.cameraController.distanceToObject(celestialBody);
        if (celestialBody.instanceOf('Moon')) {
          celestialBody.visible = (distanceToCamera < 3000) && this._mainScene.moonsVisibility;
        } else {
          celestialBody.visible = (distanceToCamera < (3000 * (this._mainScene.uiController.toolbar.isRealSize ? 1 : celestialBody.bigSizeFactor)));
        }
      });
      return;
    }

    this.elapsedTime = this.deltaTime * 1000 * this._simulationSpeed;
    this._currentDate = new Date(this._currentDate.getTime() + this.elapsedTime);

    this._mainScene.celestialObjects.forEach((celestialBody: CelestialBody) => {
      celestialBody.update();
      celestialBody.updateLabel();
      let distanceToCamera: number = this._mainScene.cameraController.distanceToObject(celestialBody);
      if (celestialBody.instanceOf('Moon')) {
        celestialBody.visible = (distanceToCamera < 3000) && this._mainScene.moonsVisibility;
      } else {
        celestialBody.visible = (distanceToCamera < (3000 * (this._mainScene.uiController.toolbar.isRealSize ? 1 : celestialBody.bigSizeFactor)));
      }
    });

    this._mainScene.uiController.dateDisplay.updateDateTimeDisplay();
    this._mainScene.uiController.controlPanel.updateSpeedDisplay();

    this._clock.elapsedTime = 0;
  }
}
