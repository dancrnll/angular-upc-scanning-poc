import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarcodeListComponent } from './barcode-list.component';

const routes: Routes = [
    {
        path: '', component: BarcodeListComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarcodeListRoutingModule { }
