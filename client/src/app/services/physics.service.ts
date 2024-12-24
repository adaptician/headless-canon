import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IBodyBuild} from "cosmos";

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWorld() {
    return this.http.get(`${this.apiUrl}/world`);
  }

  addBody(body: IBodyBuild) {
    return this.http.post(`${this.apiUrl}/addBody`, body).subscribe();
  }

  applyForce(bodyId: number, force: any, point: any) {
    return this.http.post(`${this.apiUrl}/applyForce`, { bodyId, force, point });
  }

  stepWorld(dt: number) {
    return this.http.post(`${this.apiUrl}/step`, { dt });
  }

  clear() {
    return this.http.post(`${this.apiUrl}/clear`, {}).subscribe();
  }
}
