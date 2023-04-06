import spaceAtmosphericBackground from '../assets/music/space-atmospheric-background.mp3';


export class AudioController {
    private volume: number;
    private muted: boolean;
    private musicElement: HTMLAudioElement;

    constructor() {
        this.volume = 1;
        this.muted = false;
        this.musicElement = document.getElementById('background-music') as HTMLAudioElement;
        this.setupBackgroundMusic();
    }

    private setupBackgroundMusic(): void {
        if (this.musicElement) {
            this.musicElement.src = spaceAtmosphericBackground;
            this.musicElement.volume = this.volume;
            this.musicElement.muted = this.muted;
        }
    }

    public getVolume(): number {
        return this.volume;
    }

    public changeVolume(volume: number): void {
        this.volume = volume;
        if (this.musicElement) {
            this.musicElement.volume = this.volume;
        }
    }

    public toggleVolume(): void {
        const volumes: Array<number> = [1, 0, 0.5];
        const currentVolumeIndex: number = volumes.indexOf(this.volume);
        const nextVolumeIndex: number = (currentVolumeIndex + 1) % volumes.length;
        this.changeVolume(volumes[nextVolumeIndex]);
    }

    public playClick(clickType: number) {
        const sound = new Audio(`./assets/audio/click-${clickType}.wav`);
        sound.volume = this.volume;
        sound.play();
    }

}