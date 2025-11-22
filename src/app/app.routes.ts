import { Routes } from '@angular/router';
import { SequenceListPage } from './pages/sequence-list-page/sequence-list-page';

export const routes: Routes = [
    {path: 'sequences', component: SequenceListPage},
    {path: '', redirectTo: '/sequences', pathMatch: 'full'},
    {path: '**', redirectTo: '/sequences', pathMatch: 'full'},
];
