export interface TransactionResult {
  transRef: string;
  sendingBank: string;
  receivingBank: string;
  transDate: string;
  transTime: string;
  sender: Sender;
  receiver: Receiver;
  amount: string;
  paidLocalAmount: string;
  paidLocalCurrency: string;
  countryCode: string;
  ref1: string;
  ref2: string;
  ref3: string;
}
interface Sender {
  displayName: string;
  name: string;
  proxy: Proxy;
  account: Account;
}
interface Proxy {
  type: string;
  value: string;
}
interface Account {
  type: string;
  value: string;
}
interface Receiver {
  displayName: string;
  name: string;
  proxy: Proxy;
  account: Account;
}
