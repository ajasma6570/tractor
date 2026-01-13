
export type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string | null; // Change from undefined to null
    createdAt?: Date;
    updatedAt?: Date;
}
