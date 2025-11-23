import { Routes } from '@angular/router';
import { ContentListPage } from './views/pages/content-list-page/content-list-page';
import { SequenceFormComponent } from './views/components/sequence-form-component/sequence-form-component';
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
        path: 'students',
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
        path: '', 
        redirectTo: '/sequences', 
        pathMatch: 'full'},
    {
        path: '**', 
        redirectTo: '/sequences', 
        pathMatch: 'full'
    },
];
