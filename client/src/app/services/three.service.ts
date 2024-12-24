import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private _renderer!: THREE.WebGLRenderer;
  private _objects: Map<number, THREE.Mesh> = new Map(); // Map of objects keyed by ID

  initialize(canvas: ElementRef): void {
    // Create scene, camera, and renderer
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color( 0x25274d );

    this._scene.add(this.getDirectionalLight());
    this._scene.add(this.getAmbientLight());

    this.addObject(1, "sphere", new THREE.Vector3(0, 10, 0), new THREE.Quaternion(-1, 0, 0, Math.PI * 0.5));

    this._camera = new THREE.PerspectiveCamera(
      75,
      canvas.nativeElement.clientWidth / canvas.nativeElement.clientHeight,
      0.1,
      1000);
    this._camera.position.set(0, 5, 10);

    const controls = new OrbitControls(this._camera, canvas.nativeElement);
    controls.enableDamping = true;

    this._renderer = new THREE.WebGLRenderer({ canvas: canvas.nativeElement });
    this._renderer.setSize(canvas.nativeElement.clientWidth, canvas.nativeElement.clientHeight);
  }

  addObject(id: number, shape: string, position?: THREE.Vector3, quaternion?: THREE.Quaternion): void {
    // Create a Three.js object based on the shape
    let geometry;
    switch (shape) {
      case 'box':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        break;
      default:
        return;
    }

    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);

    if (position) {
      mesh.position.copy(position);
    }

    if (quaternion) {
      mesh.quaternion.copy(quaternion);
    }

    this._scene.add(mesh);
    this._objects.set(id, mesh);
  }

  updateScene(body: any, position?: THREE.Vector3, quaternion?: THREE.Quaternion) {
    if (!this._objects.has(body.id)) {
      // TODO: this needs to be refined.
      this.addObject(body.id, 'box', position, quaternion); // Assuming 'box' for simplicity
    } else {
      this.updateObject(body.id, position, quaternion);
    }
  }

  updateObject(id: number, position?: THREE.Vector3, quaternion?: THREE.Quaternion): void {
    const object = this._objects.get(id);
    if (!object) return;

    if (position) {
      object.position.copy(position);
    }

    if (quaternion) {
      object.quaternion.copy(quaternion);
    }
  }

  render(): void {
    this._renderer.render(this._scene, this._camera);
  }

  ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  private getAmbientLight() {
    return this.ambientLight;
  }

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
  private getDirectionalLight() {
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.camera.left = - 7;
    this.directionalLight.shadow.camera.top = 7;
    this.directionalLight.shadow.camera.right = 7;
    this.directionalLight.shadow.camera.bottom = - 7;
    this.directionalLight.position.set(5, 5, 5);
    return this.directionalLight;
  }
}
