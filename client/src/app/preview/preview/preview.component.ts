import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import {ThreeService} from "../../services/three.service";
import {PhysicsService} from "../../services/physics.service";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements AfterViewInit {
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef;

  constructor(
    private threeService: ThreeService,
    private physicsService: PhysicsService,
  ) {}

  ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    this.threeService['scene'].add(light);

    this.updateWorld();
    this.animate();
  }

  updateWorld(): void {
    this.physicsService.getWorld().subscribe(data => {
      console.log(`WORLD ${JSON.stringify(data)}`);
      // data.state.forEach(body => {
      //   const position = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
      //   const quaternion = new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
      //
      //   if (!this.threeService['objects'].has(body.id)) {
      //     this.threeService.addObject(body.id, 'box', position, quaternion); // Assuming 'box' for simplicity
      //   } else {
      //     this.threeService.updateObject(body.id, position, quaternion);
      //   }
      // });
    });
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.updateWorld();
    this.threeService.render();
  }
}
