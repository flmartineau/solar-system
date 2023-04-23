import React, { useEffect, useRef, useState } from 'react';
import DateDisplay from './DateDisplay';
import { MainScene } from '../scenes/MainScene';
import InfoPanel from './InfoPanel';
import ControlPanel from './ControlPanel';
import Toolbar from './Toolbar';
import BodiesList from './BodiesList';
import LoadingScreen from './LoadingScreen';

const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mainScene, setMainScene] = useState<MainScene | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            setMainScene(new MainScene(containerRef.current));
        }
    }, []);

    return (
        <div>
            {mainScene && (
                <LoadingScreen
                    ref={mainScene.uiController.loadingScreenComponent} />
            )}
            {mainScene && (
                <DateDisplay
                    ref={mainScene.uiController.dateDisplayComponent}
                    timeController={mainScene.timeController}
                    uiController={mainScene.uiController} />
            )}
            {mainScene && (
                <InfoPanel
                    ref={mainScene.uiController.infoPanelComponent}
                    mainScene={mainScene}
                    timeController={mainScene?.timeController}
                    uiController={mainScene?.uiController} />
            )}
            {mainScene && (
                <ControlPanel
                    ref={mainScene.uiController.controlPanelComponent}
                    timeController={mainScene.timeController}
                    audioController={mainScene.audioController} />
            )}
            {mainScene && (
                <Toolbar
                    ref={mainScene.uiController.toolbarComponent}
                    mainScene={mainScene} />
            )}
            {mainScene && (
                <BodiesList
                    ref={mainScene.uiController.bodiesListComponent}
                    mainScene={mainScene} />
            )}
            <div ref={containerRef} id="game-container"></div>
        </div>

    );
};

export default App;
