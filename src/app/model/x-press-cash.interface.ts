export interface XPressCashInterface {
  paymentHeader: PaymentHeader;
  extension: Extension[];
  secureHash: string;
}

export interface PaymentHeader {
  clientid: string;
  batchsequence: string;
  batchamount: number;
  transactionamount: number;
  batchid: string;
  transactioncount: number;
  batchcount: number;
  transactionid: string;
  debittype: string;
  affiliateCode: string;
  totalbatches: string;
  execution_date: string;
}

export interface Extension {
  request_id: string;
  request_type: string;
  param_list: string;
  amount: number;
  currency: string;
  status: string;
  rate_type: string;
}
