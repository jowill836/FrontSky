
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Star } from '../star.model'; 
import { StarDataService } from '../star-data.service'; 
import { SelectionService } from '../selection.service'; 

@Component({
  selector: 'app-star-map',
  templateUrl: './star-map.component.html',
  styleUrls: ['./star-map.component.css']
})
export class StarMapComponent implements OnInit {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private starField: THREE.Group = new THREE.Group();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private intersectedObject: THREE.Object3D | null = null;
  private controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);

  constructor(
    private starDataService: StarDataService,
    private selectionService: SelectionService
  ) {}

  ngOnInit(): void {
    this.initThree();
    this.selectionService.currentCategory.subscribe(category => {
      this.loadStars(category);
    });
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private initThree(): void {
    const canvas = document.getElementById('canvas-box') as HTMLCanvasElement;
    if (!canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize);

    this.animate();
  }

  private onWindowResize = (): void => {
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onMouseMove = (event: MouseEvent): void => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.checkIntersect();
  }

  private checkIntersect(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.starField.children);

    if (intersects.length > 0) {
      if (this.intersectedObject !== intersects[0].object) {
        this.intersectedObject = intersects[0].object as THREE.Mesh;
        this.showStarInfo(this.intersectedObject);
      }
    } else {
      this.hideStarInfo();
      this.intersectedObject = null;
    }
  }

  private showStarInfo(object: THREE.Object3D): void {
    const starInfoDiv = document.getElementById('starInfo');
    if (starInfoDiv && object.userData) {
      starInfoDiv.innerHTML = `Nom de l'étoile: ${object.userData['hr']}, constellation: ${object.userData['con']}`;
      starInfoDiv.style.display = 'block';
      starInfoDiv.style.left = `${(this.mouse.x + 1) * window.innerWidth / 2}px`;
      starInfoDiv.style.top = `${(-this.mouse.y + 1) * window.innerHeight / 2}px`;
    }
  }

  private hideStarInfo(): void {
    const starInfoDiv = document.getElementById('starInfo');
    if (starInfoDiv) {
      starInfoDiv.style.display = 'none';
    }
  }

  private loadStars(category: string): void {
    switch (category) {
      case 'hottest':
        this.starDataService.getHottestStars().subscribe(data => this.createStarMap(data));
        break;
      case 'closest':
        this.starDataService.getClosestStars().subscribe(data => this.createStarMap(data));
        break;
      case 'brightest':
        this.starDataService.getBrightestStars().subscribe(data => this.createStarMap(data));
        break;
      case 'biggest':
        this.starDataService.getBiggestStars().subscribe(data => this.createStarMap(data));
        break;
      case 'all':
        this.starDataService.getStars().subscribe(data => this.createStarMap(data));
        break;
      default:
        this.starDataService.getStars().subscribe(data => this.createStarMap(data));
    }
  }

  private createStarMap(stars: Star[]): void {
    if (this.starField) {
      this.scene.remove(this.starField);
    }

    this.starField = new THREE.Group();
    stars.forEach(star => {
      const starGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);

      starMesh.position.set(star.x, star.y, star.z);
      starMesh.userData = { hr: star.hr, con : star.con};
      this.starField.add(starMesh);
    });

    this.scene.add(this.starField);
  }
}
