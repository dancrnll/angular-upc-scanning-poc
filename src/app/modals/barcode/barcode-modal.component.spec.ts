import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeModalComponent } from './barcode-modal.component';

describe('BarcodeModalComponent', () => {
  let component: BarcodeModalComponent;
  let fixture: ComponentFixture<BarcodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
