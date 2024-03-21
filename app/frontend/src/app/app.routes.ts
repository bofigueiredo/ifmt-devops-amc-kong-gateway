import { Routes } from '@angular/router';
import { IaPageComponent } from './pages/ia-page/ia-page.component';
import { AuthGuard } from './keycloak/auth.guard';

export const routes: Routes = [
    { path: '', component: IaPageComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' },
  ];