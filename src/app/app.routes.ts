import { Routes } from '@angular/router';
import { ContentListPage } from './views/pages/content-list-page/content-list-page';
import { SequenceFormComponent } from './views/components/form-component/sequence-form-component/sequence-form-component';
import { SequenceDetailComponent } from './views/components/sequence-detail-component/sequence-detail-component';
import { LoginPage } from './views/pages/login-page/login-page';
import { authGuard } from './logic/guards/auth-guard';
import { ContentNotFoundPage } from './views/pages/content-not-found-page/content-not-found-page';
import { RoutineFormComponent } from './views/components/form-component/routine-form-component/routine-form-component';

export const routes: Routes = [
    // --- RUTA PÚBLICA (LOGIN) ---
    { 
        path: 'login', 
        component: LoginPage, 
        data: { showMenu: false }
    },

    // --- RUTAS PROTEGIDAS (Sequences) ---
    {
        path: 'sequences', 
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'teachers',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'teachers/new',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'teachers/modify/:id',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'teachers/assign-students/:id',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'sequences/new',
        component: SequenceFormComponent,
        canActivate: [authGuard],
        data: { showMenu: false }
    },
    {
        path: 'sequences/modify/:id',
        component: SequenceFormComponent,
        canActivate: [authGuard],
        data: { showMenu: false }
    },
    {
        path: 'sequences/view/:id',
        component: SequenceDetailComponent,
        canActivate: [authGuard],
        data: { showMenu: false }
    },

    // --- RUTAS PROTEGIDAS (Students) ---
    {
        path: 'students',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'students/new',
        component: ContentListPage, 
        canActivate: [authGuard]
    },
    {
        path: 'students/modify/:id',
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'students/assign-valuable/:id',
        component: ContentListPage, 
        canActivate: [authGuard]
    },
    {
        path: 'not-found',
        component: ContentNotFoundPage,
        canActivate: [authGuard],
        data: { showMenu: false }
    },

    // --- RUTAS PROTEGIDAS (Routines) ---
    {
        path: 'routines', 
        component: ContentListPage,
        canActivate: [authGuard]
    },
    {
        path: 'routines/new',
        component: RoutineFormComponent, 
        canActivate: [authGuard],
        data: { showMenu: false }
    },
    {
        path: 'routines/modify/:id',
        component: RoutineFormComponent,
        canActivate: [authGuard],
        data: { showMenu: false }
    },

    // --- REDIRECCIONES ---
    {
        path: '', 
        redirectTo: '/sequences', 
        pathMatch: 'full'
    },
    {
        path: '**', 
        redirectTo: '/not-found', 
        pathMatch: 'full'
    },
];
