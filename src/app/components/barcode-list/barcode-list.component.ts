import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Barcode } from '../../vos/barcode';
import { BarcodeListService } from '../../services/barcode/barcode-list.service';
import { BarcodeChangeService } from '../../services/barcode/barcode-change.service';
import { BarcodeModalComponent } from '../../modals/barcode/barcode-modal.component';

@Component({
    selector: 'app-barcode-list',
    templateUrl: './barcode-list.component.html',
    styleUrls: ['./barcode-list.component.scss']
})
export class BarcodeListComponent implements OnInit {

    public barcodes: Barcode[] = [];
    closeResult: string;

    constructor(
        private router: Router,
        private barcodeListService: BarcodeListService,
        private barcodeChangeService: BarcodeChangeService,
        private barcodeModal: BarcodeModalComponent
    ) { }

    ngOnInit() {
        this.loadAllBarcodeList();
        this.barcodeChangeService.currentBarcode.subscribe(barcode => {
            this.loadAllBarcodeList();
        });
    }

    loadAllBarcodeList() {
        this.barcodes = this.barcodeListService.getAllBarcodes();
    }

    onClickEditBarcodeDetail(id) {
        console.log(id);
        this.barcodeModal.open(id);
    }

    onClickBarcodeDelete(id) {
        this.barcodeListService.deleteBarcodeDetail(id);
        this.loadAllBarcodeList();
    }

}
