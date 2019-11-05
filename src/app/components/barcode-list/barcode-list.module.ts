import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BarcodeListRoutingModule } from './barcode-list-routing.module';
import { BarcodeListComponent } from './barcode-list.component';
import { BarcodeListService } from '../../services/barcode/barcode-list.service';

import { BarcodeModalComponent } from '../../modals/barcode/barcode-modal.component';
import { BarcodeModalContentComponent } from '../../modals/barcode/barcode-modal.component';


@NgModule({
  imports: [
    CommonModule,
    BarcodeListRoutingModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    BarcodeListComponent,
    BarcodeModalComponent,
    BarcodeModalContentComponent
  ],
  entryComponents: [
    BarcodeModalContentComponent
  ],
  providers: [
    BarcodeListService,
    BarcodeModalComponent
  ]
})
export class BarcodeListModule { }
