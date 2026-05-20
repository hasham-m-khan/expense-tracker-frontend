export type Category = {
    id: number;
    name: string;
}

export type Transaction = {
    id: number;
    date: string;
    title: string;
    amount: number;
    type: "expense" | "earning";
    categories: Category[];
}[] | undefined;