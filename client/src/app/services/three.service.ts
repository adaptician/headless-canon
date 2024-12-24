import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private objects: Map<number, THREE.Mesh> = new Map(); // Map of objects keyed by ID

  initialize(canvas: ElementRef): void {
    // Create scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.nativeElement.clientWidth / canvas.nativeElement.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.nativeElement });
    this.renderer.setSize(canvas.nativeElement.clientWidth, canvas.nativeElement.clientHeight);
  }

  addObject(id: number, shape: string, position: THREE.Vector3, quaternion: THREE.Quaternion): void {
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
    mesh.position.copy(position);
    mesh.quaternion.copy(quaternion);

    this.scene.add(mesh);
    this.objects.set(id, mesh);
  }

  updateObject(id: number, position: THREE.Vector3, quaternion: THREE.Quaternion): void {
    const object = this.objects.get(id);
    if (object) {
      object.position.copy(position);
      object.quaternion.copy(quaternion);
    }
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
