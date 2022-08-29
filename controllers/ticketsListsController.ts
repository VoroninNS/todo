import {Permission} from '../services/types';
import BaseController from './BaseController';
import koa from "koa";
import {TicketList} from "./types";

export default class TicketsListsController extends BaseController {
    constructor() {
        super();
        this.all = this.all.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
        this.read = this.read.bind(this);
    }

    public async all(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const ticketListIds = await this.permissionService.getAccessedTicketListsIds(context);
        if (!ticketListIds.ids) {
            return ticketListIds.context;
        }

        const tickets_lists: TicketList[] = await this.prisma.ticketsLists.findMany({
            where: {
                id: {
                    in: ticketListIds.ids,
                },
            },
            select: {
                name: true,
                id: true,
            },
        });
        context.status = 200;
        context.body = {
            status: true,
            data: tickets_lists,
        }
        return context;
    }

    public async create(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const name: string = context.request.body.name.toString();
        try {
            const user_id: number = context.session.user_id;
            const ticket_list: TicketList = await this.prisma.ticketsLists.create({
                data: {
                    name,
                    owner_id: user_id,
                },
                select: {
                    id: true,
                    name: true,
                }
            })
            await this.prisma.permissions.create({
                data: {
                    user_id,
                    ticket_list_id: ticket_list.id,
                    permissions: Object.values(Permission)
                }
            });
            context.status = 200;
            context.body = {
                success: true,
                data: ticket_list,
            }
        } catch (error) {
            context.status = 404;
            context.body = {
                success: false,
                error: `The ticket list with this name already exist`,
            };
        }

        return context;
    }

    public async delete(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const user_id: number = context.session.user_id;
        const ticket_list_id = +context.request.body.ticket_list_id;
        const {count} = await this.prisma.ticketsLists.deleteMany({
            where: {
                id: ticket_list_id,
                owner_id: user_id,
            }
        });
        if (!count) {
            context.status = 404;
            context.body = {
                success: false,
                error: 'The ticket list not exist or the user is not owner',
            }
            return context;
        }
        context.status = 200;
        context.body = {
            success: true,
            data: null,
        };
        return context;
    }

    public async read(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const user_id: number = context.session.user_id;
        const ticket_list_id = +context.request.body.ticket_list_id;
        const permission = await this.prisma.permissions.findFirst({
            where: {
                user_id,
                ticket_list_id,
                permissions: {has: Permission.READ}
            }
        });
        if (!permission) {
            context.status = 404;
            context.body = {
                success: false,
                error: "The user doesn't have the permission to read this ticket list",
            }
            return context;
        }
        const ticket_list: TicketList | null = await this.prisma.ticketsLists.findFirst({
            where: {
                id: ticket_list_id,
            },
            select: {
                id: true,
                name: true,
            }
        });
        context.status = 200;
        context.body = {
            success: true,
            data: ticket_list
        };
        return context;
    }
}
