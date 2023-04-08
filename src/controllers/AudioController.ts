import spaceAtmosphericBackground from '../assets/music/space-atmospheric-background.mp3';


export class AudioController {
    private _volume: number;
    private _muted: boolean;
    private _musicElement: HTMLAudioElement;

    constructor() {
        this._volume = 1;
        this._muted = false;
        this._musicElement = document.getElementById('background-music') as HTMLAudioElement;
        this.setupBackgroundMusic();
    }

    private setupBackgroundMusic(): void {
        if (this._musicElement) {
            this._musicElement.src = spaceAtmosphericBackground;
            this._musicElement.volume = this._volume;
            this._musicElement.muted = this._muted;
        }
    }

    public getVolume(): number {
        return this._volume;
    }

    public changeVolume(_volume: number): void {
        this._volume = _volume;
        if (this._musicElement) {
            this._musicElement.volume = this._volume;
        }
    }

    public toggleVolume(): void {
        const volumes: Array<number> = [1, 0, 0.5];
        const currentVolumeIndex: number = volumes.indexOf(this._volume);
        const nextVolumeIndex: number = (currentVolumeIndex + 1) % volumes.length;
        this.changeVolume(volumes[nextVolumeIndex]);
    }

    public playClick(clickType: number) {
        const sound = new Audio(`./assets/audio/click-${clickType}.wav`);
        sound.volume = this._volume;
        sound.play();
    }

}