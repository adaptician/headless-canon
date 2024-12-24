import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import {ThreeService} from "../../services/three.service";
import {PhysicsService} from "../../services/physics.service";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements AfterViewInit {
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef;

  constructor(
    private threeService: ThreeService,
    private physicsService: PhysicsService,
  ) {}

  ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef);

    this.updateWorld();
    this.animate();
  }

  updateWorld(): void {
    this.physicsService.getWorld().subscribe(data => {
      console.log(`WORLD ${JSON.stringify(data)}`);
      const state = data as any[];
      state.forEach(body => {
        const position = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
        const quaternion = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);

        this.threeService.updateScene(body, position, quaternion);
      });
    });
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.updateWorld();
    this.threeService.render();
  }
}
