import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { ProfilComponent } from './modules/profil/profil.component';
import { LeaveRequestComponent } from './modules/leave-request/leave-request.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './modules/login/login.component';
import { TeamsComponent } from './modules/crud/teams/teams.component';
import { EmployeesComponent } from './modules/crud/employees/employees.component';
import { MapsComponent } from './modules/maps/maps.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  
    // Route pour 'login'
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent,// Protect the routes with the AuthGuard
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'profile',
                component: ProfilComponent
            },
            {
                path: 'list',
                component: TeamsComponent,
            },
            {
                path: 'congé',
                component: LeaveRequestComponent,
            },
            {
                path: 'employees/:teamId',
                component: EmployeesComponent
            },
            {
                path: 'maps',
                component: MapsComponent,
            },
        ]
    }
];