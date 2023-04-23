import React from "react";
import imageLogo from "../assets/IMAGES/logo_text.png";

interface LoadingScreenProps {
}

interface LoadingScreenState {
    display: boolean;
    loadedNumber: number;
    resourceUrl: string;
}

class LoadingScreen extends React.Component<LoadingScreenProps, LoadingScreenState> {


    imageLogo =''

    constructor(props: LoadingScreenProps) {
        super(props);

        this.state = {
            display: true,
            loadedNumber: 0,
            resourceUrl: ''
        }
    }

    hide = (): void => {
        setTimeout(()=>{this.setState({ display: false })}, 1000);
    }

    getUpdatedProgress = (item: string, loaded: number, total: number): void => {
        this.setState({ resourceUrl: item });
        this.setState({ loadedNumber: (loaded / 34) * 100 });
    }

    render() {
        return (
            <div id="loading-screen" style={{display: this.state.display ? 'block' : 'none'}}>
            <div id="loading-screen-content">
                <div id="loading-screen-header">
                    <img id="loading-screen-header-title" src={imageLogo} alt="Solar System Logo" />
                    <p id="loading-screen-header-text">LOADING...</p>
                </div>
                <div id="loading-bar">
                    <div id="loading-bar-inner"
                        style={{width: `${this.state.loadedNumber}%`}}>
                    </div>
                </div>
                <div id="resource-url">
                    <p>{this.state.resourceUrl}</p>
                </div>
            </div>
        </div>
        );
    }
}

export default LoadingScreen;