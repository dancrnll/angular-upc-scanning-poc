export class Barcode {

    id: number;
    barcode: string;
    qty: number;

    constructor({ id, barcode, qty }: { id?: number; barcode?: string; qty?: number; } = {}) {
        this.id = id ? id : 0;
        this.barcode = barcode ? barcode : '';
        this.qty = qty ? qty : 0;
    }

}
