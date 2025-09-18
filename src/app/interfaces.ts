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

export interface InvestForm {
    name?: string;
    identifier?: string;
    url: string;
    date?: Date;
    totalPrice?: number;
    currency?: '£' | 'p' | '$' | 'euro';
    pricePerUnit?: number;
    totalUnits?: number;
    accumulative?: boolean;
    income?: boolean;
    risk?: string;
    price?: number;
    user?: string;
}

export interface PensionForm {
    name?: string;
    type?: string;
    total?: number;
    membershipNumber?: string;
    date?: Date;
    notes?: string;
    user?: string;
}

export interface Transact {
    initialValue?: number;
    amount?: number;
    date?: Date;
    newValue?: number;
    user: string;
}

