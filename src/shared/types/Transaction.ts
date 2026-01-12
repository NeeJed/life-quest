export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: Date;
  description: string;
}
