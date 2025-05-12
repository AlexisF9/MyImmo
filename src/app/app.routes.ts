import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'rechercher',
        component: SearchComponent
    },
    {
        path: 'annonce/:id',
        component: AnnouncementComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
