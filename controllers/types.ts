export type TicketList = {
    name: string;
    id: number;
};

export type Ticket = {
    name: string;
    id: number;
};

export type AuthData = {
    login: string | number;
    password: string | number;
}

export type PermissionData = {
    ticket_list_id: number | string;
    login: number | string;
}

export type CreateTicketData = {
    ticket_list_id: number | string;
    name: number | string;
}
export type UpdateTicketData = {
    name: number | string;
    id: number | string;
}
