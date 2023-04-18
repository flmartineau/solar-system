import Stats from 'stats.js';
import GUI from 'lil-gui';
import { MainScene } from '../scenes/MainScene';
import { AxesHelper, GridHelper } from 'three';


export class DevConsoleController {
    private _mainScene: MainScene;
    private _visibility: boolean;
    private _stats: Stats;
    private _devConsole: GUI;

    private _showGrid: boolean;
    private _showAxes: boolean;
    private _grid = new GridHelper(800000, 80);
    private _axes = new AxesHelper(10000);


    constructor(mainScene: MainScene) {
        this._mainScene = mainScene;
        this._visibility = false;
        this._showGrid = false;
        this._showAxes = false;
        this._grid.visible = false;
        this._axes.visible = false;
        this._mainScene.scene.add(this._grid);
        this._mainScene.scene.add(this._axes);

        this._stats = new Stats();
        this._devConsole = new GUI();
        this._devConsole.add(this, '_showGrid').onChange(() => 
            this.toggleGrid(this._showGrid));
        this._devConsole.add(this, '_showAxes').onChange(() =>
            this.toggleAxes(this._showAxes));
        this._stats.showPanel(0);
        this._stats.dom.style.right = '0px';
        this._stats.dom.style.left = 'auto';
        document.body.appendChild(this._stats.dom);
        this._stats.dom.style.display = 'none';
        this._devConsole.domElement.style.right = '100px';
        this._devConsole.domElement.style.display = 'none';

        
    }

    get stats(): Stats {
        return this._stats;
    }

    private toggleGrid(value: boolean): void {
        this._showGrid = value;
        this._grid.visible = value;
    }

    private toggleAxes(value: boolean): void {
        this._showAxes = value;
        this._axes.visible = value;
    }

    public toggleDevConsole(): void {
        this._visibility = !this._visibility;
        this._stats.dom.style.display = this._visibility ? 'block' : 'none';
        this._devConsole.domElement.style.display = this._visibility ? 'block' : 'none';
    }

    public addFolder(title: string): GUI {
        return this._devConsole.addFolder(title);
    }


}