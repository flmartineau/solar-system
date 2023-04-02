import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { DateHelper } from '../helper/DateHelper';

export class TimeController {
  private planets: Array<Planet>;
  private sun: Star;
  private currentDate: Date;
  private simulationSpeed: number;
  private isPlaying: boolean;
  private deltaTime: number;

  constructor(sun: Star, planets: Array<Planet>) {
    this.planets = planets;
    this.sun = sun;
    this.currentDate = new Date();
    this.simulationSpeed = 1;
    this.isPlaying = true;
    this.deltaTime = 0.016; // Use a fixed time step or calculate the elapsed time since the last frame
  }

  public togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.simulationSpeed = 1;
    const playPauseButton = document.getElementById('play-pause');
    if (playPauseButton) {
      playPauseButton.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
  }

  public setSpeed(speed: number): void {
    if (!this.isPlaying) {
      this.togglePlayPause();
    }
    this.simulationSpeed = this.simulationSpeed * speed;
  }

  public update(): void {
    if (!this.isPlaying) {
      return;
    }

    const elapsedTime = this.deltaTime * 1000 * this.simulationSpeed;
    this.currentDate = new Date(this.currentDate.getTime() + elapsedTime);

    this.sun.rotateY(this.sun.rotationSpeed * this.deltaTime * this.simulationSpeed);

    this.planets.forEach((planet: Planet) => {
      planet.rotateY(planet.rotationSpeed * this.deltaTime * this.simulationSpeed);
      planet.updateOrbit(this.deltaTime, this.simulationSpeed);
    });

    // Display the updated date in the HTML element
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = DateHelper.formatDate(this.currentDate);

    }
  }

  public getCurrentDate(): Date {
    return this.currentDate;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
