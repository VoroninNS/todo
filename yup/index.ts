import koa from 'koa';
import * as yup from 'yup';
import {auth} from './auth';
import {create as ticketListCreate, read_delete as ticketsListReadDelete} from './ticketsLists';
import {create as ticketCreate, read_delete as ticketReadDelete, update as ticketUpdate} from './tickets';
import {permit} from './permissions';

export const validate = (schema: yup.AnyObjectSchema) => async (context: koa.DefaultContext, next: koa.Next):
    Promise<koa.DefaultContext | koa.Next> => {
    try {
        await schema.validate({
            body: context.request.body,
            query: context.request.query,
            params: context.request.params,
        });
        return next();
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            context.status = 500;
            context.body = {
                status: false,
                error: error.message,
            }
            return context;
        }
        throw error;
    }
};

export function authValidate() {
    return validate(auth);
}

export function createTicketsListsValidate() {
    return validate(ticketListCreate);
}

export function readDeleteTicketsListsValidate() {
    return validate(ticketsListReadDelete);
}

export function permissionValidate() {
    return validate(permit);
}

export function ticketCreateValidate() {
    return validate(ticketCreate);
}

export function ticketReadDeleteValidate() {
    return validate(ticketReadDelete);
}

export function ticketUpdateValidate() {
    return validate(ticketUpdate);
}