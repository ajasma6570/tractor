
export type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string | null; // Change from undefined to null
    createdAt?: Date;
    updatedAt?: Date;
}
