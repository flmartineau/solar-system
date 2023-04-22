import React, { useEffect, useRef, useState } from 'react';
import DateDisplay from './DateDisplay';
import { MainScene } from '../scenes/MainScene';
import InfoPanel from './InfoPanel';
import ControlPanel from './ControlPanel';

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
            <div id="loading-screen">
                <div id="loading-screen-content">
                    <div id="loading-screen-header">
                        <img id="loading-screen-header-title" src="./assets/IMAGES/logo_text.png" alt="Solar System Logo" />
                        <p id="loading-screen-header-text">LOADING...</p>
                    </div>
                    <div id="loading-bar">
                        <div id="loading-bar-inner"></div>
                    </div>
                </div>
            </div>
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
                uiController={mainScene?.uiController}/>
            )}
            {mainScene && (
                <ControlPanel
                    ref={mainScene.uiController.controlPanelComponent}
                    timeController={mainScene.timeController}
                    audioController={mainScene.audioController}/>
            )}
            <div ref={containerRef} id="game-container"></div>
        </div>

    );
};

export default App;
