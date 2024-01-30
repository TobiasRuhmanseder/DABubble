import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginComponent } from './start-screen/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeScreenComponent },
];
