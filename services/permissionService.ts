import {AccessedTicketListsIdsReturn, AddAndDeleteProps, Permission} from './types';
import {PrismaClient} from '@prisma/client';
import koa from 'koa';
import prisma from '../client';

export default class PermissionService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    public async add(props: AddAndDeleteProps): Promise<void> {
        const {permission, permit_operator, ticket_list_id, user_id} = props;
        if (permission) {
            if (!permission.permissions.includes(permit_operator)) {
                await this.prisma.permissions.updateMany({
                    where: {
                        user_id: user_id,
                        ticket_list_id,
                    },
                    data: {
                        permissions: {
                            push: permit_operator,
                        },
                    },
                });
            }
        } else {
            await this.prisma.permissions.create({
                data: {
                    user_id: user_id,
                    ticket_list_id,
                    permissions: [permit_operator],
                },
            })
        }
    }

    public async delete(props: AddAndDeleteProps): Promise<void> {
        const {permission, permit_operator, ticket_list_id, user_id} = props;
        if (permission?.permissions.includes(permit_operator)) {
            if (permission.permissions.length === 1) {
                await this.prisma.permissions.deleteMany({
                    where: {
                        user_id: user_id,
                        ticket_list_id,
                    },
                })
            } else {
                await this.prisma.permissions.updateMany({
                    where: {
                        user_id: user_id,
                        ticket_list_id,
                    },
                    data: {
                        permissions: permission.permissions.filter(e => e !== permit_operator),
                    },
                });
            }
        }
    }

    public async checkForTicket(context: koa.DefaultContext, operator: Permission): Promise<koa.DefaultContext | null> {
        const ticket = await this.prisma.tickets.findFirst({
            where: {
                id: context.request.body.id,
            },
        });
        if (!ticket) {
            context.status = 404;
            context.body = {
                success: false,
                error: "The ticket not exist",
            }
            return context;
        }
        const permission = await this.prisma.permissions.findFirst({
            where: {
                user_id: context.session.user_id,
                ticket_list_id: ticket.ticket_list_id,
                permissions: {
                    has: operator,
                },
            },
        });
        if (!permission) {
            context.status = 404;
            context.body = {
                success: false,
                error: `The user haven't permission to ${operator.toLowerCase()} tickets in this ticket list`,
            }
            return context;
        }

        return null;
    }

    public async getAccessedTicketListsIds(context: koa.DefaultContext): Promise<AccessedTicketListsIdsReturn> {
        const user_id: number = context.session.user_id;
        const ids = (await this.prisma.permissions.findMany({
            where: {
                user_id,
                permissions: {has: Permission.READ},
            },
        })).map((ticket_list) => ticket_list.ticket_list_id);
        if (!ids) {
            context.status = 404;
            context.body = {
                success: false,
                error: "There aren't tickets lists available for the user",
            }
        }

        return {
            context,
            ids,
        };
    }
}
