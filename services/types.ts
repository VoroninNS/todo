import koa from "koa";
import {Permissions} from "@prisma/client";

export enum Permission {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    READ = 'READ',
}

export type AddAndDeleteProps = {
    ticket_list_id: number,
    permit_operator: Permission,
    permission: Permissions | null,
    user_id: number,
}

export type AccessedTicketListsIdsReturn = {
    context: koa.DefaultContext;
    ids: number[] | null;
}
