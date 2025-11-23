import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CamerasComponent } from './components/cameras/cameras.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'cameras',
    component: CamerasComponent,
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
