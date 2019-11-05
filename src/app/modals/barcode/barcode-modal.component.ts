import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Quagga from '@ericblade/quagga2';
import { QuaggaJSResultObject } from '@ericblade/quagga2';

import { Barcode } from '../../vos/barcode';
import { BarcodeChangeService } from '../../services/barcode/barcode-change.service';

import { BarcodeListService } from '../../services/barcode/barcode-list.service';
import { BarcodeEditService } from '../../services/barcode/barcode-edit.service';

@Component({
  selector: 'app-barcode-modal-content',
  templateUrl: './barcode-modal-content.component.html',
  styleUrls: ['./barcode-modal-content.component.scss']

})
export class BarcodeModalContentComponent implements OnInit, OnDestroy {

  modalHeaderTitle: string;
  modalAddCloseBtnText: string;

  @Input() barcode = '';
  @Input() maxLength: number;
  @Input() isNumeric: boolean;
  @Input() qty = 0;

  barcodeErrArr = [];
  qtyErrArr = [];

  addInProgress = false;
  scannerActive = false;

  originalBarcodeId: number;
  originalBarcode: string;
  originalQty: number;

  @ViewChild('picView', {static: false}) picView: ElementRef;

  private qtyInputElRef: ElementRef;
  @ViewChild('qtyInput', {static: false}) set qtyInput(elRef: ElementRef) {
    if (elRef) {
      this.qtyInputElRef = elRef;
    }
  }

  configQuagga = {
      name: 'Live',
      type: 'LiveStream',
      target: '#inputBarcode',
      constraints: {
        width: { min: 360 },
        height: { min: 360 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment', // or user
        // facingMode: 'user', // or environment
      },
      singleChannel: false, // true: only the red color-channel is read
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    locate: true,
    numOfWorkers: 4,
    decoder: {
      // readers: ['code_128_reader']
      readers: ['upc_reader']
    }
  };

  constructor(
    public activeModal: NgbActiveModal,
    private barcodeChangeService: BarcodeChangeService,
    private barcodeListService: BarcodeListService,
    private barcodeEditService: BarcodeEditService
  ) {}

  ngOnInit() {
    this.maxLength = 12;
    this.isNumeric = true;

    // this.startScanner();
  }

  ngOnDestroy() {
    this.stopScanner();
  }

  init(barcodeId: number) {
    this.originalBarcodeId = barcodeId;
    this.originalBarcode = '';
    this.originalQty = 0;

    if (barcodeId !== 0) {
      const bc = this.barcodeListService.getBarcodeById(barcodeId);
      this.originalBarcode = bc.barcode;
      this.originalQty = bc.qty;
      this.barcode = bc.barcode;
      this.qty = bc.qty;

      this.modalHeaderTitle = 'Edit Entry';
      this.modalAddCloseBtnText = 'Update';
    } else {
      this.modalAddCloseBtnText = 'Add Entry and Close';
      this.startScanner();
    }


  }

  restartScanner() {
    this.stopScanner();
    this.startScanner();
  }

  startScanner() {
    this.scannerActive = true;

    this.barcode = '';
    this.qty = this.originalQty;
    this.barcodeErrArr = [];
    this.qtyErrArr = [];
    this.addInProgress = false;

    Quagga.onProcessed((result) => this.onProcessed(result));
    Quagga.onDetected((result) => this.onDetected(result));
    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });

  }

  stopScanner() {
    this.picView.nativeElement.innerHTML = '';
    if (this.scannerActive) {
      Quagga.stop();
      this.scannerActive = false;
    }
    Quagga.offProcessed(null);
    Quagga.offDetected(null);
  }

  private onProcessed(result: QuaggaJSResultObject) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        result.boxes.filter((box) => {
          return box !== result.box;
        }).forEach(box => {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private onDetected(result: QuaggaJSResultObject) {

    const code = result.codeResult.code;
    this.stopScanner();

    if (this.barcode !== code) {
      this.barcode = code;

      const img = Quagga.canvas.dom.image;
      const imgCtx = img.getContext('2d');
      Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, imgCtx, { color: '#00F', lineWidth: 3 });
      Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, imgCtx, { color: 'red', lineWidth: 5 });
      this.picView.nativeElement.innerHTML = '<img class="canvas" src="' + Quagga.canvas.dom.image.toDataURL() + '" />';
      setTimeout(() => {
        this.qtyInputElRef.nativeElement.select();
      }, 0);
    }

  }

  addEntryToList(closeModal: boolean) {

    if (this.addInProgress) {
      return false;
    }

    this.addInProgress = true;

    this.barcodeErrArr = [];
    this.qtyErrArr = [];

    // this.barcodeEditService.editBarcodeEntry(this.barcode, this.qty).subscribe(results => {

    //   if (results.errors) {
    //     const errors = results.errors;
    //     if (errors.barcode) {
    //       this.barcodeErrArr = errors.barcode;
    //     }
    //     if (errors.qty) {
    //       this.qtyErrArr = errors.qty;
    //     }
    //   }

      if (this.barcodeErrArr.length === 0 && this.qtyErrArr.length === 0) {

        const bc = new Barcode({id: this.originalBarcodeId, barcode: this.barcode, qty: this.qty});
        this.barcodeListService.updateBarcodeById(bc);
        this.barcodeChangeService.changeBarcode(bc);

        if (closeModal) {
          this.stopScanner();
          this.activeModal.close();
        } else {
          this.restartScanner();
        }

      }

      this.addInProgress = false;

    // });

  }

  numberOnly(event: any): boolean {
    if (!this.isNumeric) {
      return true;
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 ) {
      return false;
    }
    return true;
  }

}

@Component({
  selector: 'app-barcode-modal-component',
  templateUrl: './barcode-modal.component.html',
  providers: [NgbModalConfig, NgbModal]
})
export class BarcodeModalComponent {

  barcodeId: number;
  addMode: boolean;

  modalRef: NgbModalRef;
  componentInstance: any;

  closeResult: string;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(barcodeId?: number) {

    this.barcodeId = (barcodeId) ? barcodeId : 0 ;
    this.addMode = (this.barcodeId === 0);

    this.modalRef = this.modalService.open(BarcodeModalContentComponent);
    this.componentInstance = this.modalRef.componentInstance;

    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.componentInstance.stopScanner();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.componentInstance.stopScanner();
    });

    this.componentInstance.init(this.barcodeId);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
