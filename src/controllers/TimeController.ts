import { Planet } from '../components/celestial/Planet';
import { Star } from '../components/celestial/Star';
import { Sun } from '../components/celestial/Sun';
import { DateHelper } from '../helper/DateHelper';

export class TimeController {
  private planets: Array<Planet>;
  private sun: Star | null;
  private currentDate: Date;
  private simulationSpeed: number;
  private isPlaying: boolean;
  private deltaTime: number;

  constructor() {
    this.planets = new Array<Planet>();
    this.sun = null;
    this.currentDate = new Date();
    this.simulationSpeed = 1;
    this.isPlaying = true;
    this.deltaTime = 0.016; // Use a fixed time step or calculate the elapsed time since the last frame
  }

  setPlanets(planets: Array<Planet>): void {
    this.planets = planets;
  }

  setSun(sun: Star): void {
    this.sun = sun;
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

    const deltaTimeToSpeed = this.deltaTime * 1000 * this.simulationSpeed;
    this.currentDate = new Date(this.currentDate.getTime() + deltaTimeToSpeed);

    if (this.sun)
    this.sun.rotateY(this.sun.rotationSpeed * this.deltaTime * this.simulationSpeed);

    this.planets.forEach((planet: Planet) => {
      planet.rotateY(planet.rotationSpeed * this.deltaTime * this.simulationSpeed);
      planet.updateOrbit();
    });

    // Display the updated date in the HTML element
    const dateElement = (<HTMLInputElement>document.getElementById('current-date'));
    if (dateElement) {
      dateElement.value = DateHelper.formatDateFromFormat(this.currentDate, 'YYYY-MM-DD');
    }
  }

  public getCurrentDate(): Date {
    return this.currentDate;
  }

  public setCurrentDate(currentDate: Date): void {
    this.togglePlayPause();
    this.currentDate = currentDate;
    this.update();
    this.togglePlayPause();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
