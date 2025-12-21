import { Routes } from '@angular/router';
import { ContentListPage } from './views/pages/content-list-page/content-list-page';
import { SequenceFormComponent } from './views/components/form-component/sequence-form-component/sequence-form-component';
import { SequenceDetailComponent } from './views/components/sequence-detail-component/sequence-detail-component';

export const routes: Routes = [
    {
        path: 'sequences', 
        component: ContentListPage
    },
    {
        path: 'students/new',
        component: ContentListPage
    },
    {
        path: 'students/modify/:id',
        component: ContentListPage
    },
    {
        path: 'students/asign-sequences/:id',
        component: ContentListPage
    },
    {
        path: 'students',
        component: ContentListPage
    },
    {
        path: 'teachers',
        component: ContentListPage
    },
    {
        path: 'teachers/new',
        component: ContentListPage
    },
    {
        path: 'teachers/modify/:id',
        component: ContentListPage
    },
    {
        path: 'sequences/new',
        component: SequenceFormComponent
    },
    {
        path: 'sequences/modify/:id',
        component: SequenceFormComponent
    },
    {
        path: 'sequences/view/:id',
        component: SequenceDetailComponent
    },
    {
        path: '', 
        redirectTo: '/sequences', 
        pathMatch: 'full'
    },
    {
        path: '**', 
        redirectTo: '/sequences', 
        pathMatch: 'full'
    },
];
