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
    isin?: string;
    date?: Date;
    totalPrice?:number;
    totalUnits?:number;
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
    notes?:string;
    user?: string;
}

export interface Transact {
    initialValue?: number;
    amount?:number;
    date?: Date;
    newValue?:number;
    id: string;
    user: string;
}

