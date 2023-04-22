import { MainScene } from "../scenes/MainScene";
import { Planet } from "../models/Planet";
import { Moon } from "../models/Moon";
import { Label } from "../models/Label";
import { CelestialBody } from "../models/CelestialBody";
import SettingsModal from "./SettingsModal";
import React from "react";


interface ToolbarProps {
    mainScene: MainScene;
}


interface ToolbarState {
    labelsVisibility: boolean;
    moonsVisibility: boolean;
    orbitLinesVisibility: boolean;
    isRealSize: boolean;
    soundVolume: number;
}

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {


    constructor(props: ToolbarProps) {
        super(props);


        this.state = {
            labelsVisibility: true,
            moonsVisibility: true,
            orbitLinesVisibility: true,
            isRealSize: true,
            soundVolume: this.props.mainScene.audioController.volume
        };
    }

    get labelsVisibility(): boolean {
        return this.state.labelsVisibility;
    }

    get moonsVisibility(): boolean {
        return this.state.moonsVisibility;
    }

    get isRealSize(): boolean {
        return this.state.isRealSize;
    }

    openSettings = (): void => {
        this.props.mainScene.uiController.settingsModalComponent.current?.show();
    }

    /**
   * Toggle the visibility of orbit lines in the scene.
   */
    toggleOrbitLines = (): void => {
        this.props.mainScene.planets.forEach((planet: Planet) => {
            planet.orbitLine.visible = !planet.orbitLine.visible;
            this.setState(() => ({
                orbitLinesVisibility: planet.orbitLine.visible
            }));
        });

        this.props.mainScene.moons.forEach((moon: Moon) => {
            moon.orbitLine.visible = !moon.orbitLine.visible;
            this.setState(() => ({
                orbitLinesVisibility: moon.orbitLine.visible
            }));
        });

        this.props.mainScene.audioController.playClick(2);
    }

    toggleLabels = (): void => {
        const labelsVisibility: boolean = !this.state.labelsVisibility;
        this.setState(() => ({
            labelsVisibility: labelsVisibility
        }));
        this.props.mainScene.labels.forEach((label: Label) => {
            label.visible = labelsVisibility
        });
        this.props.mainScene.audioController.playClick(2);
    }

    toggleMoons = (value?: boolean): void => {

        if (value == undefined && !this.state.isRealSize) //disable moons when real size is off
            return;

        const moonsVisibility: boolean = !this.state.moonsVisibility;
        this.setState(() => ({
            moonsVisibility: (value !== undefined) ? value : moonsVisibility
        }), () => {
            this.props.mainScene.moonsVisibility = this.state.moonsVisibility;
        });


        this.props.mainScene.audioController.playClick(2);
    }

    toggleRealSize = (): void => {
        const isRealSize: boolean = !this.state.isRealSize;
        this.toggleMoons(isRealSize);
        this.setState(() => ({
            isRealSize: isRealSize
        }), () => {
            this.props.mainScene.celestialObjects.forEach((celestialObject: CelestialBody) => {
                celestialObject.setBigSize(!this.state.isRealSize);
            });
            if (this.props.mainScene.selectedObject) {
                this.props.mainScene.cameraController.centerCameraOnObject(this.props.mainScene.selectedObject);
            }
        });
    }

    toggleVolume = (): void => {
        this.props.mainScene.audioController.toggleVolume();

        this.setState(() => ({
            soundVolume: this.props.mainScene.audioController.volume
        }));
    }


    getMusicIcon(): string {
        switch (this.state.soundVolume) {
            case 0:
                return './assets/icons/speaker-mute.png';
            case 0.5:
                return './assets/icons/speaker-1.png';
            case 1:
                return './assets/icons/speaker-max.png';
            default:
                return './assets/icons/speaker-mute.png';
        }
    }


    render() {
        return (
            <div id="sidebar">
                <div className="sidebar-item">
                    <img id="toggleOrbits"
                        src={this.state.orbitLinesVisibility ? '../assets/icons/orbit_lines_on.png' : 'assets/icons/orbit_lines_off.png'}
                        alt="Toggle Orbit Lines"
                        onClick={this.toggleOrbitLines} />
                    <p className="sidebar-text">ORBIT LINES</p>
                </div>
                <div className="sidebar-item">
                    <img id="toggleLabels"
                        src={this.state.labelsVisibility ? './assets/icons/planet_labels_on.png' : 'assets/icons/planet_labels_off.png'}
                        alt="Toggle Labels"
                        onClick={this.toggleLabels} />
                    <p className="sidebar-text">LABELS</p>
                </div>
                <div className="sidebar-item">
                    <img id="toggleMoons"
                        src={this.state.moonsVisibility ? './assets/icons/moons_on.png' : 'assets/icons/moons_off.png'}
                        alt="Toggle Moons"
                        onClick={() => this.toggleMoons()} />
                    <p className="sidebar-text">MOONS</p>
                </div>
                <div className="sidebar-item">
                    <img id="toggleSize"
                        src={this.state.isRealSize ? './assets/icons/big_size.png' : 'assets/icons/real_size.png'}
                        alt="Toggle Size"
                        onClick={this.toggleRealSize} />
                    <p className="sidebar-text">SIZE</p>
                </div>
                <div className="sidebar-item">
                    <img id="openSettings"
                        src="../assets/icons/settings.png"
                        alt="Settings"
                        onClick={this.openSettings}/>
                    <p className="sidebar-text">SETTINGS</p>
                </div>
                <div className="sidebar-item">
                    <img id="music-icon"
                        src={this.getMusicIcon()}
                        alt="Music"
                        onClick={this.toggleVolume} />
                </div>

                <SettingsModal ref={this.props.mainScene.uiController.settingsModalComponent}/>
            </div>
        );
    }

}

export default Toolbar;