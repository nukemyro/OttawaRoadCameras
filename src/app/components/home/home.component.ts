import { Component } from '@angular/core';
import { CamerasComponent } from "../cameras/cameras.component";

@Component({
  selector: 'app-home',
  imports: [CamerasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
