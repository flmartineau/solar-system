import Stats from 'stats.js';
import GUI from 'lil-gui';


export class DevConsoleController {
    private _visibility: boolean;
    private _stats: Stats;
    private _devConsole: GUI;


    constructor() {
        this._visibility = false;

        this._stats = new Stats();
        this._devConsole = new GUI();
        this._stats.showPanel(0);
        this._stats.dom.style.right = '0px';
        this._stats.dom.style.left = 'auto';
        document.body.appendChild(this._stats.dom);
        this._stats.dom.style.display = 'none';
        this._devConsole.domElement.style.right = '100px';
        this._devConsole.domElement.style.display = 'none'
    }

    get stats(): Stats {
        return this._stats;
    }

    public toggleDevConsole(): void {
        this._visibility = !this._visibility;
        this._stats.dom.style.display = this._visibility ? 'block' : 'none';
        this._devConsole.domElement.style.display = this._visibility ? 'block' : 'none';
    }

    public add(object: object, property: string) {
        this._devConsole.add(object, property);
    }

    public addFolder(title: string): GUI {
        return this._devConsole.addFolder(title);
    }


}