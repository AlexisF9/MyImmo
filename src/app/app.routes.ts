import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './services/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'rechercher',
    component: SearchComponent,
  },
  { path: 'annonce/:documentId', component: AnnouncementComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
