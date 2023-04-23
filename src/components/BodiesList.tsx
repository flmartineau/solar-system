import React from "react";
import { CelestialBody } from "../models/CelestialBody";
import { Planet } from "../models/Planet";
import { MainScene } from "../scenes/MainScene";
import { Moon } from "../models/Moon";



interface BodiesListProps {
    mainScene: MainScene;
}

interface BodiesListState {
    celestialBodies: Planet[];
    selectedObject: CelestialBody | null;
}

class BodiesList extends React.Component<BodiesListProps, BodiesListState> {

    constructor(props: BodiesListProps) {
        super(props);
        this.state = {
            celestialBodies: [],
            selectedObject: null
        }
    }

    set planets(value: Planet[]) {
        this.setState({ celestialBodies: value });
    }

    selectObject = (object: CelestialBody): void => {
        this.setState({ selectedObject: object }, () => {
            this.props.mainScene.selectObject(object);
            this.props.mainScene.audioController.playClick(1);
        });
    }

    render() {
        return (
            <div id="right-sidebar">
                <div id="moon-menu">
                    {this.state.celestialBodies.map((planet: Planet, planetIndex: number) => {
                        if ((this.state.selectedObject === planet || planet.moons.find((moon: Moon) => moon == this.state.selectedObject)) &&
                            planet.moons.length > 0) {
                            return (
                                <ul id={'moon-list-' + planet.name.toLowerCase()}
                                    style={{ top: (planetIndex * 27) + 'px' }}>
                                    {planet.moons.map((moon: Moon) => {
                                        return (
                                            <li id={'moon-list-' + moon.name.toLowerCase()}
                                                key={'moon-list-' + moon.name.toLowerCase()}
                                                className={this.state.selectedObject === moon ? 'selected' : ''}
                                                onClick={() => this.selectObject(moon)}>
                                                {moon.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )
                        }
                    })}

                </div>
                <div id="planet-menu">
                    <h3>Planets</h3>
                    <ul id="celestial-body-list">
                        {this.state.celestialBodies.map((planet: Planet) => {
                            return (
                                <li id={'planet-list-' + planet.name.toLowerCase()}
                                    key={'planet-list-' + planet.name.toLowerCase()}
                                    className={this.state.selectedObject === planet ? 'selected' : ''}
                                    onClick={() => this.selectObject(planet)}>
                                    {planet.name}
                                </li>
                            );
                        })}
                    </ul>

                </div>

            </div>
        );
    }

}

export default BodiesList;