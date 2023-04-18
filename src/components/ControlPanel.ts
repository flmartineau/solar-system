import { AudioController } from "../controllers/AudioController";
import { TimeController } from "../controllers/TimeController";
import { TemplateHelper } from "../helper/TemplateHelper";


export class ControlPanel {
    private _timeController: TimeController;
    private _audioController: AudioController;


    /**
     * Create a new ControlPanel.
     */
    constructor(timeController: TimeController, audioController: AudioController) {
        this._timeController = timeController;
        this._audioController = audioController;

        TemplateHelper.setTemplate('control-panel-container', 'control-panel.html').then(() => {
            this.addEventListeners();
        });
    }


    private addEventListeners(): void {
        const currentDateIcon: HTMLElement | null = document.getElementById('current-date-icon');
        document.getElementById('sim-speed-slider')?.addEventListener('input', (e: Event) => {
            this._timeController.simulationSpeed = (<HTMLInputElement>e.target).valueAsNumber;
            this.updateCurrentDateButton(false);
        });
        currentDateIcon?.addEventListener('click', () => {
            this.updateCurrentDateButton(true);
            this._timeController.currentDate = new Date();
            this._audioController.playClick(3);
        });
        document.getElementById('play-pause-icon')?.addEventListener('click', () => {
            this._audioController.playClick(3);
            this._timeController.togglePlayPause();
            this.updateCurrentDateButton(false);
        });
    }

    /**
   * Updates the current date button active state.
   * @param active True if the button should be active, false otherwise. 
   */
    public updateCurrentDateButton(active: boolean): void {
        const currentDateIcon: HTMLElement | null = document.getElementById('current-date-icon');
        if (active) {
            currentDateIcon?.classList.add('active');
        } else {
            currentDateIcon?.classList.remove('active');
        }
    }


    /**
   * Toggle the play/pause button in the UI.
   */
    public togglePlayPauseButton(): void {
        const playPauseButton = document.getElementById('play-pause-icon') as HTMLImageElement;
        if (playPauseButton) {
            playPauseButton.src = this._timeController.isPlaying ? './assets/icons/pause_button.png' : './assets/icons/play_button.png';
        }
    }


    public updateSpeedDisplay() {
        let simulationSpeed: number = this._timeController.simulationSpeed;
        const speedElement: HTMLInputElement = document.getElementById('simulation-speed') as HTMLInputElement;
        if (speedElement) {
            speedElement.innerText = this.getSpeedString(simulationSpeed);
        }
        this.updateSpeedSlider();
    }

    public updateSpeedSlider() {
        let simulationSpeed: number = this._timeController.simulationSpeed;
        const speedSlider: HTMLInputElement = document.getElementById('sim-speed-slider') as HTMLInputElement;
        if (speedSlider) {
            speedSlider.value = simulationSpeed.toString();
        }
    }

    private getSpeedString(speed: number): string {
        if (Math.abs(speed) < 60) {
            return speed + ' SEC/S';
        } else if (Math.abs(speed) < 3600) {
            return (speed / 60).toFixed(2) + ' MINS/S';
        } else if (Math.abs(speed) < 86400) {
            return (speed / 3600).toFixed(2) + ' HRS/S';
        } else if (Math.abs(speed) < 31536000) {
            return (speed / 86400).toFixed(2) + ' DAY/S';
        } else if (Math.abs(speed) < 3153600000) {
            return (speed / 31536000).toFixed(2) + ' YRS/S';
        } else {
            return '0 sec/sec';
        }
    }

}