import React from "react";
import { TimeController } from "../controllers/TimeController";
import { AudioController } from "../controllers/AudioController";



interface ControlPanelProps {
    timeController: TimeController;
    audioController: AudioController;
}


interface ControlPanelState {
    simulationSpeed: number;
    currentDateON: boolean;
    isPlaying: boolean;
}

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
    constructor(props: ControlPanelProps) {
        super(props);

        this.state = {
            simulationSpeed: this.props.timeController.simulationSpeed,
            currentDateON: true,
            isPlaying: true
        };
    }


    getSpeedString(speed: number): string {
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

    handleSpeedChange = (event: any) => {
        this.setState({ simulationSpeed: event.target.value });
        this.props.timeController.simulationSpeed = this.state.simulationSpeed;
        this.updateCurrentDateButton(false);
    }

    /**
   * Updates the current date button active state.
   * @param active True if the button should be active, false otherwise. 
   */
    updateCurrentDateButton(active: boolean): void {
        this.setState({ currentDateON: active });
    }

    /**
   * Toggle the play/pause button in the UI.
   */
    togglePlayPause = () => {
        this.props.audioController.playClick(3);
        this.props.timeController.togglePlayPause();
        this.updateCurrentDateButton(false);
    }


    setToCurrentDate = () => {
        this.props.audioController.playClick(3);
        this.props.timeController.currentDate = new Date();
        this.updateCurrentDateButton(true);
    }


    render() {
        return (
            <div id="control-panel">
                <div className="to-current">
                    <button id="current-date-icon"
                            className={this.state.currentDateON ? 'active' : ''}
                            onClick={this.setToCurrentDate}>
                            <span className="dot"></span>LIVE
                    </button>
                </div>
                <div className="speed-controls">
                    <span id="simulation-speed">{this.getSpeedString(this.props.timeController.simulationSpeed)}</span>
                    <div className="slider-wrapper">
                        <input id="sim-speed-slider" className="sim-speed-slider" type="range" list="tickmarks" 
                        min="-31536000" max="31536000" 
                        value={this.props.timeController.simulationSpeed.toString()}
                        onChange={this.handleSpeedChange.bind(this)} />
                        <datalist id="tickmarks">
                            <option value="-31536000"></option>
                            <option value="-2592000"></option>
                            <option value="-86400"></option>
                            <option value="-3600"></option>
                            <option value="-60"></option>
                            <option value="-1"></option>
                            <option value="0"></option>
                            <option value="1"></option>
                            <option value="60"></option>
                            <option value="3600"></option>
                            <option value="86400"></option>
                            <option value="2592000"></option>
                            <option value="31536000"></option>
                        </datalist>
                    </div>

                </div>
                <div className="play-pause">
                    <img src={this.props.timeController.isPlaying ? './assets/icons/pause_button.png' : './assets/icons/play_button.png'} 
                        alt="Play/Pause" id="play-pause-icon" onClick={this.togglePlayPause} />
                </div>
            </div>
        );
    }
}

export default ControlPanel;