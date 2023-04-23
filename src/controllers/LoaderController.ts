import { CubeTextureLoader, LoadingManager, TextureLoader } from "three";
import { MainScene } from "../scenes/MainScene";

export class LoaderController {

    private _mainScene: MainScene;
    private _loadingManager: LoadingManager;
    private _textureLoader: TextureLoader;
    private _cubeTextureLoader: CubeTextureLoader;

    constructor(mainScene: MainScene) {
        this._mainScene = mainScene;
        this._loadingManager = new LoadingManager();
        this._textureLoader = new TextureLoader(this._loadingManager);
        this._cubeTextureLoader = new CubeTextureLoader(this._loadingManager);
        this._loadingManager.onProgress = this.updateLoadingBar.bind(this);
    }

    public get loadingManager(): LoadingManager {
        return this._loadingManager;
    }

    public get textureLoader(): TextureLoader {
        return this._textureLoader;
    }

    public get cubeTextureLoader(): CubeTextureLoader {
        return this._cubeTextureLoader;
    }

    public updateLoadingBar(item: string, loaded: number, total: number): void {
        this._mainScene.uiController.loadingScreen.getUpdatedProgress(item, loaded, total);
    }

}