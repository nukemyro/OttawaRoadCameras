import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CameraService } from '../../services/camera/camera.service';
import { Camera } from '../../model/camera';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MapComponent } from '../map/map.component';
import { Location } from '../../model/Location';
import { URLStrings } from '../../constants/urls';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cameras',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MapComponent,
  ],
  templateUrl: './cameras.component.html',
  styleUrl: './cameras.component.scss',
  providers: [CameraService],
})
export class CamerasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  formGroup: FormGroup;
  cameras: Camera[];
  selectedCamera: Camera;
  filteredOptions: Observable<Camera[]>;
  selectedCoordinates: BehaviorSubject<Location> = new BehaviorSubject(null);

  constructor(private cameraService: CameraService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cameraService
      .getCityCameras()
      .then((cameras: Camera[]) => (this.cameras = cameras))
      .catch((error: any) => (this.cameras = []));

    this.formGroup = this.fb.group({
      search: new FormControl('', Validators.required),
    });

    this.filteredOptions = this.formGroup.controls['search'].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): Camera[] {
    if (!this.cameras) {
      return [];
    }

    if (!value) {
      return this.cameras;
    }

    if (typeof value !== 'string') {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.cameras.filter((camera) =>
      camera.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCamera = event.option.value;
    this.cameraService.setSelectedCamera(this.selectedCamera);

    this.selectedCoordinates.next({
      latitude: this.selectedCamera.latitude,
      longitude: this.selectedCamera.longitude,
    });
    this.loadImageIntoCanvas();
  }

  onClearSearch(event: any) {
    (<HTMLInputElement>document.getElementById('input-search')).value = '';
    this.cameraService.setSelectedCamera(null);
    this.selectedCamera = null;
    this.loadImageIntoCanvas();
  }

  getCameraName(camera: Camera): string {
    return camera.name;
  }

  getCameraCoordinates(camera: Camera): Location {
    return {
      latitude: camera.latitude,
      longitude: camera.longitude,
    } as Location;
  }

  loadImageIntoCanvas(): void {
    const time = new Date().getTime();
    let imageUrl = '';
    const ctx = this.canvas.nativeElement.getContext('2d');

    if (this.selectedCamera) {
      const id = this.selectedCamera.camera_number;
      imageUrl = `${URLStrings.CameraFeed}?id=${id}&timems=${time}`;
    } else {
      ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    }

    // Create an image element
    const img = new Image();

    // Handle the 'load' event to draw the image onto the canvas
    img.onload = () => {
      ctx.drawImage(
        img,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    };

    // Set the image source with the appended query parameter
    img.src = imageUrl;
  }
}
