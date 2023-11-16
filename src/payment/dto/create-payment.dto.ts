export class CreatePaymentDto {}

export class InvoiceDto {
  company: string;
  status?: 'Success' | 'Failed';
  fromDate: string;
  toDate: string;
  paymentMethod? = 'Card';
  total: number;
  cardNumber: string | number;
  info: any;
}
