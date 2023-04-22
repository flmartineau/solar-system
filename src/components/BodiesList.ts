import { CelestialBody } from "../models/CelestialBody";
import { Moon } from "../models/Moon";
import { Planet } from "../models/Planet";
import { MainScene } from "../scenes/MainScene";

export class BodiesList {

    private _mainScene: MainScene;

    private _celestialObjectList: HTMLElement | null;
    private _moonMenu: HTMLElement | null;

    /**
     * Create a new BodiesList.
     */
    constructor(mainScene: MainScene) {
        this._mainScene = mainScene;
        this._celestialObjectList = document.getElementById('celestial-body-list');
        this._moonMenu = document.getElementById('moon-menu');
    }


    /**
   * Create the celestial object list UI element.
   */
    public createCelestialObjectList() {
        if (!this._celestialObjectList) return;
        let index: number = 0;
        this._mainScene.planets.forEach((planet: Planet) => {
            const listItem: HTMLLIElement = document.createElement('li');
            listItem.setAttribute('id', 'planet-list-' + planet.name.toLowerCase());
            listItem.textContent = planet.name;
            listItem.addEventListener('click', () => {
                this._mainScene.selectObject(planet);
                this._mainScene.audioController.playClick(1);
            });
            this._celestialObjectList?.appendChild(listItem);

            if ((planet.isSelected || planet.moons.find((moon: Moon) => moon.isSelected)) && planet.moons.length > 0
                && this._mainScene.uiController.toolbarComponent?.current?.moonsVisibility)
                this._moonMenu?.appendChild(this.createMoonList(planet, index));
            index++;
        });
    }

    /**
     * Update the celestial object list UI element.
     */
    public updateCelestialObjectList() {
        if (!this._celestialObjectList) return;
        this._celestialObjectList.innerHTML = '';
        if (!this._moonMenu) return;
        this._moonMenu.innerHTML = '';
        this.createCelestialObjectList();
        if (this._mainScene.selectedObject)
            this.selectObjectInList(this._mainScene.selectedObject);
    }

    /**
     * Create the moon list UI element.
     * @param planet - The planet for which to create the moon list.
     * @param planetIndex - The index of the planet in the list.
     * @returns The moon list UI element.
     */
    public createMoonList(planet: Planet, planetIndex: number): HTMLUListElement {

        const moonList: HTMLUListElement = document.createElement('ul');
        moonList.setAttribute('id', 'moon-list-' + planet.name.toLowerCase());
        planet.moons.forEach((moon: Moon) => {
            const listItem: HTMLLIElement = document.createElement('li');
            listItem.setAttribute('id', 'moon-list-' + moon.name.toLowerCase());
            listItem.textContent = moon.name;
            listItem.addEventListener('click', () => {
                this._mainScene.selectObject(moon);
                this._mainScene.audioController.playClick(1);
            });
            moonList.appendChild(listItem);
            moonList.style.top = (planetIndex * 27) + 'px';
        });
        return moonList;
    }

    /**
       * Select a celestial object in the list UI element.
       * @param celestialObject - The celestial object to select.
       */
    public selectObjectInList(celestialObject: CelestialBody) {
        if (!this._celestialObjectList) return;

        const planetName: string = celestialObject instanceof Moon ? celestialObject.planet.name : celestialObject.name;

        const listItems: NodeListOf<HTMLLIElement> = this._celestialObjectList.querySelectorAll('li');
        listItems.forEach((item: HTMLElement) => {
            item.classList.remove('selected');
        });
        const listItem: HTMLElement | null = document.getElementById(`planet-list-${planetName.toLowerCase()}`);
        listItem?.classList.add('selected');

        if (celestialObject instanceof Moon) {
            const moonListItems: NodeListOf<HTMLLIElement> | undefined = this._moonMenu?.querySelectorAll('li');
            moonListItems?.forEach((item: HTMLElement) => {
                item.classList.remove('selected');
            });
            const moonListItem: HTMLElement | null = document.getElementById(`moon-list-${celestialObject.name.toLowerCase()}`);
            moonListItem?.classList.add('selected');
        }
    }

}