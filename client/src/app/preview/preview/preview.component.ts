import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {ThreeService} from "../../services/three.service";
import {PhysicsService} from "../../services/physics.service";
import {IBodyBuild, IWorld} from "cosmos";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements AfterViewInit {
  @ViewChild('threeCanvas', {static: true}) canvasRef!: ElementRef;

  constructor(
    private threeService: ThreeService,
    private physicsService: PhysicsService,
  ) {
  }

  ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef);

    this.updateWorld();
    this.animate();
  }

  addClone(shapeName: string): void {
    const body: IBodyBuild = { shape: shapeName, mass: 5, position: { x: 2, y: 2, z: 0 }, quaternion: {x: -1, y: 0, z: 0, w: 0.0017} };
    this.physicsService.addBody(body);
  }

  private updateWorld(): void {
    this.physicsService.getWorld()
      .subscribe(res => {
        if (!res) return;

        const world = res as IWorld;
        if (!world) return;

        world.bodies?.forEach(body => {

          const position =
            body.position
            ? new THREE.Vector3(body.position.x, body.position.y, body.position.z)
            : undefined;

          const quaternion =
            body.quaternion
            ? new THREE.Quaternion(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w)
            : undefined;

          this.threeService.updateScene(body, position, quaternion);
        });
      });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.updateWorld();
    this.threeService.render();
  }


}
