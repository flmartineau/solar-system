import { CubeTextureLoader, LoadingManager, TextureLoader } from "three";
import { ISolarSystem } from "../components/celestial/interfaces/ISolarSystem";

export class LoaderController {


    private _loadingManager: LoadingManager;
    private _textureLoader: TextureLoader;
    private _cubeTextureLoader: CubeTextureLoader;

    constructor() {
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
        const progress = (loaded / 34) * 100;
        const loadingBarInner = document.getElementById("loading-bar-inner");
        if (loadingBarInner) {
            loadingBarInner.style.width = `${progress}%`;
        }
    }


    public hideLoadingScreen(): void {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
    }

}