import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera } from '../../model/camera';
import { URLStrings } from '../../constants/urls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private selectedCamera$: BehaviorSubject<Camera> = new BehaviorSubject(null);
  public SelectedCamera$ = this.selectedCamera$.asObservable();

  constructor(private httpClient: HttpClient) {}

  public setSelectedCamera(camera: Camera) {
    this.selectedCamera$.next(camera);
  }

  getCityCameras(): Promise<Camera[]> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(URLStrings.Cameras)
        .pipe()
        .subscribe(
          (data: any) => {
            resolve(data.cameras);
          },
          (error: any) => {
            reject(error);
          }
        );
    });
  }
}
