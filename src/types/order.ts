type OptionDto = {
  label: string;
  data: {
    label: string;
    price: number;
  }[];
};

export type FoodOrderDto = {
  name: string;
  options: OptionDto[];
};
