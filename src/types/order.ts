type OptionDto = {
  label: string;
  data: {
    label: string;
    price: number;
  }[];
};

export enum OrderStatus {
  pending = 1,
  inprogress = 2,
  complete = 3,
}
