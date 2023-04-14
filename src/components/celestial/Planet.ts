import { AxisInfo, Body, HelioDistance, HelioVector, KM_PER_AU, RotationAxis, Vector } from 'astronomy-engine';
import { CelestialBody } from './CelestialBody';
import { SIZE_FACTOR } from '../../utils/constants';
import { MainScene } from '../../scenes/MainScene';
import { AdditiveBlending, BackSide, CatmullRomCurve3, Color, ColorRepresentation, DoubleSide, FrontSide, HexColorString, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Object3D, PointLight, RingGeometry, ShaderMaterial, SphereGeometry, Texture, TubeGeometry, Vector3 } from 'three';
import { Moon } from './Moon';
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";
import { OrbitLine } from './OrbitLine';
import glowFragmentShader from '../../assets/shaders/glow/glowFragment.glsl';
import glowVertexShader from '../../assets/shaders/glow/glowVertex.glsl';
import { IPlanet } from './interfaces/ISolarSystem';
import { RadialRingGeometry } from '../../utils/RadialRingGeometry';

export class Planet extends CelestialBody {

    private _data: IPlanet;

    private _distanceToSun: number;
    private _orbitalPeriod: number;
    private _orbitLine: OrbitLine;
    private _rings: Mesh | null = null;
    private _moons: Array<Moon> = [];
    private _position: Vector3 = new Vector3(0, 0, 0);
    private _body: Body;

    private _lastOrbitLineUpdateTime: number;

    private _pointLight;
    private _lensflare = new Lensflare();
    private _textureFlare: Texture;
    private _lightColor: ColorRepresentation;

    public NB_OF_ORBIT_LINE_POINTS: number = 3000;

    constructor(data: IPlanet, mainScene: MainScene) {

        const texture: Texture = mainScene.textureLoader.load(data.textures.base);
        const material = new MeshPhongMaterial({ map: texture });


        super(mainScene, data.name, (data.radius / KM_PER_AU) * SIZE_FACTOR, material, data.mass, data.temperature);
        this._data = data;
        this._body = Body[data.name];
        this._distanceToSun = 0;
        this._orbitalPeriod = data.orbit.period;
        this._lightColor = data.color as HexColorString;
        this._textureFlare = this.mainScene.textureLoader.load('./assets/textures/lensflare/lensflare.png');
        this._orbitLine = new OrbitLine(this);
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

        if (data.textures.rings) {
            this.addRings();
        }
    }

    get data(): IPlanet {
        return this._data;
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

    set isSelected(value: boolean) {
        super.isSelected = value;
        (this.orbitLine.material as LineBasicMaterial).color = new Color(value ? 0x0f2e82 : 0x333333);
    }

    get isSelected(): boolean {
        return super.isSelected;
    }

    get body(): Body {
        return this._body;
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
        if (this.visible)
            this.updateRotation();

        if (this.isSelected)
            this._distanceToSun = Math.round(HelioDistance(this.body, this.mainScene.timeController.currentDate) * KM_PER_AU);
        let v: Vector = HelioVector(this.body, this.mainScene.timeController.currentDate);
        let x: number = v.x * SIZE_FACTOR;
        let y: number = v.y * SIZE_FACTOR;
        let z: number = v.z * SIZE_FACTOR;
        let vector = new Vector3(x, y, z);

        vector.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
    
        this._position = vector;

        this.position.set(this._position.x, this._position.y, this._position.z);


        if (this.mainScene.moonsVisibility) {
            this._moons.forEach((moon: Moon) => {
                moon.updateOrbit();
                moon.refreshOrbitLine();
            });
        }
        
        this.updateLighting();

        this.lastOrbitLineUpdateTime = this.lastOrbitLineUpdateTime + this.mainScene.timeController.elapsedTime;
        // Check if it's time to update the orbit line
        if (this.lastOrbitLineUpdateTime >= ((this.orbitalPeriod * 24 * 60 * 60 * 1000) / 2)) {
            this.refreshOrbitLine();
            this.lastOrbitLineUpdateTime = 0;
        }

        if (this._rings) {
            this._rings.position.copy(this.position);
          }

    }

    private updateOrbitGeometry(segments: number = this.NB_OF_ORBIT_LINE_POINTS): Vector3[] {
        const points: Vector3[] = [];
        const period: number = this._orbitalPeriod * 24 * 60 * 60 * 1000; // milliseconds
        let t0 = this.mainScene.timeController.currentDate.getTime() - (period / 2);
        let date = new Date(t0);

        for (let i = 0; i < segments; i++) {
            let v = HelioVector(this.body, date);
            let v3 = new Vector3(v.x * SIZE_FACTOR, v.y * SIZE_FACTOR, v.z * SIZE_FACTOR);
            v3.applyAxisAngle(new Vector3(1, 0, 0), -110 * Math.PI / 180);
            points.push(v3);
            date = new Date(date.getTime() + (period / segments));
        }

        return points;
    }

    private createOrbitLine(): OrbitLine {
        const orbitGeometryPoints = this.updateOrbitGeometry();
        const curve = new CatmullRomCurve3(orbitGeometryPoints, true);
        const tubeGeometry = new TubeGeometry(curve, this.NB_OF_ORBIT_LINE_POINTS, 0.00005, 8, true);
        this._orbitLine.geometry.copy(tubeGeometry);
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

    private addClouds(texturePath: string): void {
        const geometry = new SphereGeometry(this.radius * 1.001, 128, 128);
        const cloudTexture = this.mainScene.textureLoader.load(texturePath);
        const atmosphere = new MeshPhongMaterial({
            side: FrontSide, map: cloudTexture, transparent: true, alphaMap: cloudTexture
        });
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

    private addRings(): void {
        const innerRadius: number = (this._data.rings.innerRadius / KM_PER_AU) * SIZE_FACTOR;
        const outerRadius: number = (this._data.rings.outerRadius / KM_PER_AU) * SIZE_FACTOR;


        const ringTexture = this.mainScene.textureLoader.load(this.data.textures.rings);
        const ringMaterial = new MeshBasicMaterial({
            map: ringTexture,
            alphaMap: ringTexture,
            side: DoubleSide,
            transparent: true,
            opacity: 0.99
          });

        const ringGeometry = new RadialRingGeometry(innerRadius, outerRadius, 180);
        const rings = new Mesh(ringGeometry, ringMaterial);
        rings.rotateX(90 * Math.PI / 180);
        this._rings = rings;
        this.mainScene.scene.add(rings);
    };

    public updateRotation(): void {
        let axisInfo: AxisInfo = RotationAxis(this._body, this.mainScene.timeController.currentDate);
        this.rotation.y = (axisInfo.spin % 360) * (Math.PI / 180);
    }


    public instanceOf(className: string): boolean {
        return className === 'Planet';
    }
}