import { Routes } from '@angular/router';
import { ContentListPage } from './views/pages/content-list-page/content-list-page';
export const routes: Routes = [
    {
        path: 'sequences', 
        component: ContentListPage
    },
    {
        path: 'students',
        component: ContentListPage
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
