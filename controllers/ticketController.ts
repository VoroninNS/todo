import {Permission} from '../services/types';
import BaseController from './BaseController';
import koa from 'koa';
import {CreateTicketData, Ticket, UpdateTicketData} from "./types";

export default class TicketController extends BaseController {
    constructor() {
        super();
        this.all = this.all.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.read = this.read.bind(this);
    }

    public async create(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const {name, ticket_list_id}: CreateTicketData = context.request.body;
        const permission = await this.prisma.permissions.findMany({
            where: {
                user_id: context.session.user_id,
                permissions: {has: Permission.CREATE},
                ticket_list_id: context.request.body.ticket_list_id,
            },
        });
        if (!permission) {
            context.status = 404;
            context.body = {
                success: false,
                error: "The user haven't permission to create tickets in this ticket list",
            }
            return context;
        }

        try {
            const ticket = await this.prisma.tickets.create({
                data: {
                    name: name.toString(),
                    ticket_list_id: +ticket_list_id,
                }
            });
            context.status = 200;
            context.body = {
                success: true,
                data: ticket,
            }
        } catch (error) {
            context.status = 404;
            context.body = {
                success: false,
                error: `The ticket with this name already exist in the ticket list`,
            };
        }

        return context;
    }

    public async delete(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const id = +context.request.body.id;
        const response = await this.permissionService.checkForTicket(context, Permission.DELETE);
        if (response) {
            return response;
        }
        await this.prisma.tickets.delete({
            where: {
                id,
            },
        })
        context.status = 200;
        context.body = {
            success: true,
            data: null,
        };
        return context;
    }

    public async update(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const {id, name}: UpdateTicketData = context.request.body;
        const response = await this.permissionService.checkForTicket(context, Permission.UPDATE);
        if (response) {
            return response;
        }

        const updatedTicket: Ticket = await this.prisma.tickets.update({
            where: {
                id: +id,
            },
            data: {
                name: name.toString(),
            },
            select: {
                id: true,
                name: true,
            }
        });
        context.status = 200;
        context.body = {
            success: true,
            data: updatedTicket,
        };
        return context;
    }

    public async read(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const id = +context.request.body;
        const response = await this.permissionService.checkForTicket(context, Permission.READ);
        if (response) {
            return response;
        }

        const ticket: Ticket | null = await this.prisma.tickets.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            }
        });
        context.status = 200;
        context.body = {
            success: true,
            data: ticket,
        };
        return context;
    }

    public async all(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const ticketListIds = await this.permissionService.getAccessedTicketListsIds(context);
        if (!ticketListIds.ids) {
            return ticketListIds.context;
        }

        const tickets: Ticket[] = await this.prisma.tickets.findMany({
            where: {
                ticket_list_id: {
                    in: ticketListIds.ids,
                },
            },
            select: {
                id: true,
                name: true,
            }
        });
        context.status = 200;
        context.body = {
            status: true,
            data: tickets,
        }
        return context;
    }
}
