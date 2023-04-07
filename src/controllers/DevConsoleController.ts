import Stats from 'stats.js';


export class DevConsoleController {
    private _visibility: boolean;
    private _stats: Stats;


    constructor() {
        this._visibility = false;

        this._stats = new Stats();
        this._stats.showPanel(0);
        this._stats.dom.style.right = '0px';
        this._stats.dom.style.left = 'auto';
        document.body.appendChild(this._stats.dom);
        this._stats.dom.style.display = 'none';
    }



    public getStats(): Stats {
        return this._stats;
    }

    public toggleDevConsole(): void {
        this._visibility = !this._visibility;
        this._stats.dom.style.display = this._visibility ? 'block' : 'none';
    }


}