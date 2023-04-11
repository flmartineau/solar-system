import { AstroTime, Body, HelioDistance, HelioVector, KM_PER_AU, PlanetOrbitalPeriod, RotationAxis, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import { SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { AdditiveBlending, BackSide, Color, ColorRepresentation, FrontSide, HexColorString, Material, Mesh, MeshPhongMaterial, PointLight, ShaderMaterial, SphereGeometry, Texture, Vector3} from 'three';
import { EarthMoon } from './moons/EarthMoon';
import { Moon } from './Moon';
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";
import { OrbitLine } from './OrbitLine';

import glowFragmentShader from '../../assets/shaders/glow/glowFragment.glsl';
import glowVertexShader from '../../assets/shaders/glow/glowVertex.glsl';
import { IPlanet } from './interfaces/ISolarSystem';
import { DateHelper } from '../../helper/DateHelper';



export class Planet extends CelestialBody {

    private _distanceToSun: number;
    private _orbitalPeriod: number;
    private _orbitLine: OrbitLine;
    private _moons: Array<Moon> = [];
    private _position: Vector3 = new Vector3(0, 0, 0);
    private _inclination: number;
    private _semiMajorAxis: number;
    private _eccentricity: number;
    private _longitudeOfAscendingNode: number;
    private _argumentOfPeriapsis: number;
    private _meanAnomalyAtEpoch: number;
    private _period: number;

    private _lastOrbitLineUpdateTime: number;

    private _pointLight;
    private _lensflare = new Lensflare();
    private _textureFlare: Texture;
    private _lightColor: ColorRepresentation;

    constructor(data: IPlanet, mainScene: MainScene) {

        const texture: Texture = mainScene.textureLoader.load(data.textures.base);
        const material = new MeshPhongMaterial({ map: texture });


        super(mainScene,data.name, (data.radius / KM_PER_AU) * SIZE_FACTOR, material, data.mass, data.temperature, Body[data.name]);
        this._distanceToSun = 0;
        this._inclination = data.orbit.inclination;
        this._semiMajorAxis = data.orbit.semiMajorAxis;
        this._eccentricity = data.orbit.eccentricity;
        this._longitudeOfAscendingNode = data.orbit.longitudeOfAscendingNode;
        this._argumentOfPeriapsis = data.orbit.argumentOfPeriapsis;
        this._meanAnomalyAtEpoch = data.orbit.meanAnomalyAtEpoch;
        this._period = data.orbit.period;
        this._orbitalPeriod = PlanetOrbitalPeriod(Body[data.name]);
        this._lightColor = data.color as HexColorString;
        this._textureFlare = this.mainScene.textureLoader.load('./assets/textures/lensflare/lensflare.png');
        
        this._orbitLine = this.createOrbitLine();
        this._lastOrbitLineUpdateTime = 0;
        this._pointLight = new PointLight(this._lightColor, 0, 0);
    
        this._lensflare.addElement(new LensflareElement(this._textureFlare, 20, 0, this._pointLight.color));
       
        this._pointLight.add(this._lensflare);
        

        this.mainScene.scene.add(this._orbitLine);

        if (data.textures.cloud) {
            this.addClouds(data.textures.cloud);
        }

        if (data.hasAtmosphere) {
            this.addGlow();
        }

    }

    get distanceToSun(): number {
        return this._distanceToSun;
    }

    get moons(): Array<Moon> {
        return this._moons;
    }

    get lastOrbitLineUpdateTime(): number {
        return this._lastOrbitLineUpdateTime;
    }

    set lastOrbitLineUpdateTime(time: number) {
        this._lastOrbitLineUpdateTime = time;
    }

    get orbitLine(): OrbitLine {
        return this._orbitLine;
    }

    get orbitalPeriod(): number {
        return this._orbitalPeriod;
    }

    public updateLighting(): void {
        this.mainScene.scene.remove(this._pointLight);
        this._pointLight.position.set(this.position.x, this.position.y, this.position.z);
        this.mainScene.scene.add(this._pointLight);
      }

    public addMoon(moon: Moon): void {
        this._moons.push(moon);
    }

    public update(): void {
        super.update();
        
        if (this.isSelected)
            this._distanceToSun = Math.round(HelioDistance(this.body, this.mainScene.timeController.currentDate)* KM_PER_AU);

         
        this.updateOrbit();




        this._moons.forEach((moon: Moon) => {
            moon.updateOrbit();
            moon.refreshOrbitLine();
        });

        this.updateLighting();

        this.lastOrbitLineUpdateTime = this.lastOrbitLineUpdateTime + this.mainScene.timeController.elapsedTime;
        // Check if it's time to update the orbit line
        if (this.lastOrbitLineUpdateTime >= (this.orbitalPeriod * 24 * 60 * 60 * 1000)) {
            this.refreshOrbitLine();
            this.lastOrbitLineUpdateTime = 0;
        }


    }


    private updateOrbit() {

        const time: Date = this.mainScene.timeController.currentDate;

        const w = this._argumentOfPeriapsis * Math.PI / 180;
        const e = this._eccentricity;
        const Ω = this._longitudeOfAscendingNode * Math.PI / 180;
        const i = this._inclination * Math.PI / 180;
        const a = this._semiMajorAxis;
        const deltaTime: number = DateHelper.getDeltaDaysBetweenDates(new Date('2000-01-01T12:00:00Z'),time);

        const M: number = (this._meanAnomalyAtEpoch + 360 * (deltaTime / this._period)) * Math.PI / 180;

        const E = this.solveKeplersEquation(M, e);


        const ν = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
        const r = a * (1 - e * Math.cos(E));

        const x = r * (Math.cos(Ω) * Math.cos(w+ν)) - (Math.sin(Ω) * Math.sin(w+ν) * Math.cos(i));
        const y = r * (Math.sin(Ω) * Math.cos(w+ν) + (Math.cos(Ω) * Math.sin(w+ν) * Math.cos(i)));
        const z = r * (Math.sin(w+ν) * Math.sin(i));

        if (this.name == 'Jupiter')
        console.log(w);
      
            
           /*  let h = HelioVector(this.body, this.mainScene.timeController.currentDate);
            console.log(this.name + " " + Math.abs(h.x - x) + " " + Math.abs(h.y - y) + " " + Math.abs(h.z - z)); */
   
        
            

        let vector = new Vector3(x* SIZE_FACTOR, y* SIZE_FACTOR, z* SIZE_FACTOR);

        //vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);

        this._position = vector;

        this.position.set(this._position.x, this._position.y, this._position.z);
    }

    private solveKeplersEquation(M: number, e: number, accuracy: number = 1e-8): number {
        let E_old: number = M;
        let E_new: number;
        let iterationCount: number = 0;
        let maxIterations: number = 1000;
    
        do {
            E_new = E_old - (E_old - e * Math.sin(E_old) - M) / (1 - e * Math.cos(E_old));
            iterationCount++;
    
            if (Math.abs(E_new - E_old) < accuracy || iterationCount > maxIterations) {
                break;
            }
    
            E_old = E_new;
        } while (true);
    
        return E_new;
    }
    
    private updateOrbitGeometry(segments: number = 3000): Vector3[] {
        const points: Vector3[] = [];
        const period = this._orbitalPeriod * 24 * 60 * 60 * 1000; //millisecondes
        let date: Date = this.mainScene.timeController.currentDate;

        let v0 = new Vector3(0, 0, 0);

        for (let i = 0; i < segments; i++) {
            let v = HelioVector(this.body, date);
            let v3 = new Vector3(v.x * SIZE_FACTOR, v.y * SIZE_FACTOR, v.z * SIZE_FACTOR);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            if (i== 0) v0 = v3;
            date = new Date(date.getTime() + (period / segments));
        }

        points.push(v0);
        return points;
    }


    private createOrbitLine(): OrbitLine {
        const orbitGeometry = this.updateOrbitGeometry();
        this._orbitLine = new OrbitLine(this);
        this._orbitLine.geometry.setFromPoints(orbitGeometry);
        return this._orbitLine;
    }

    public refreshOrbitLine(): void {
        const isVisible: boolean = this._orbitLine.visible;

        if (isVisible) {
            this.mainScene.scene.remove(this._orbitLine);
            this._orbitLine.geometry.dispose();
            this._orbitLine = this.createOrbitLine();
            this.mainScene.scene.add(this._orbitLine);
        }
    }

    public addMoons(): void {
        switch (this.name) {
            case 'Earth':
                let moon = new EarthMoon(this.mainScene, this);
                this._moons.push(moon);
                break;
            default:
                break;
        }
    }

    private addClouds(texturePath: string): void {
        const geometry = new SphereGeometry(this.radius * 1.001, 128, 128);
        const cloudTexture = this.mainScene.textureLoader.load(texturePath);
        const atmosphere = new MeshPhongMaterial({
          side: FrontSide, map: cloudTexture, transparent: true, alphaMap: cloudTexture });
        this.add(new Mesh(geometry, atmosphere));
      }


      private addGlow(): void {
        let glowMaterial = new ShaderMaterial({
          uniforms: {
            "c": { value: 0.4 },
            "p": { value: 4.5 },
            glowColor: { value: new Color(this._lightColor) },
            viewVector: { value: this.mainScene.cameraController.camera.position }
          },
          vertexShader: glowVertexShader,
          fragmentShader: glowFragmentShader,
          side: BackSide,
          blending: AdditiveBlending,
          transparent: true
        });
    
        let venusGlow = new Mesh(new SphereGeometry(this.radius, 128, 128), glowMaterial);
        venusGlow.scale.multiplyScalar(1.02);
        this.add(venusGlow);
      }
}