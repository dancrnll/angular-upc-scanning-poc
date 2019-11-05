import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'barcode-list',
        pathMatch: 'full'
    },
    {
        path: 'barcode-list',
        loadChildren: () => import('./components/barcode-list/barcode-list.module').then(mod => mod.BarcodeListModule)
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
