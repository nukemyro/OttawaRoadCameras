import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { CameraService } from '../../services/camera/camera.service';
import { Camera } from '../../model/camera';
import { BehaviorSubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [GoogleMap, MapAdvancedMarker],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  zoom = 14;
  advancedMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
  };
  advancedMarkerPositions: google.maps.LatLngLiteral[] = [];
  showMap = false;
  mapOptions: google.maps.MapOptions;
  isDestroyed: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private cameraService: CameraService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
  }

  ngOnInit(): void {
    this.cameraService.SelectedCamera$.pipe(
      takeUntil(this.isDestroyed)
    ).subscribe((camera: Camera) => {
      if (camera) {
        this.center.lat = camera.latitude;
        this.center.lng = camera.longitude;
        this.mapOptions = {
          zoom: this.zoom,
          center: this.center,
          mapTypeId: 'satellite', // Initial map type
        };
        this.showMap = false;

        this.advancedMarkerPositions = [];
        this.advancedMarkerPositions.push({
          lat: camera.latitude,
          lng: camera.longitude,
        });
        this.cd.detectChanges();
        this.showMap = true;
      } else {
        this.showMap = false;
      }

    });
  }
}
