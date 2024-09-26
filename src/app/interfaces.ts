export interface InvoiceItem {
    description?: string,
    quantity?: number,
    cost?: number;
}

export interface Invoice {
    client?: string,
    date?: Date,
    items?: InvoiceItem[],
    bank?: string
}