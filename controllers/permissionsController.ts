import BaseController from './BaseController';
import koa from 'koa';
import {PermissionData} from './types';

export default class PermissionsController extends BaseController {
    constructor() {
        super();
        this.permit = this.permit.bind(this);
    }

    public async permit(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const {ticket_list_id, login}: PermissionData = context.request.body;
        const user = await this.prisma.users.findFirst({
            where: {
                login: login.toString(),
            }
        });
        if (!user) {
            context.status = 404;
            context.body = {
                success: false,
                error: 'The user not exist',
            }
            return context;
        }
        if (user.id === context.session.user_id) {
            context.status = 404;
            context.body = {
                success: false,
                error: "The user cannot give permission to himself",
            }
            return context;
        }
        const is_owner = await this.prisma.ticketsLists.findFirst({
            where: {
                id: +ticket_list_id,
                owner_id: context.session.user_id,
            }
        });
        if (!is_owner) {
            context.status = 404;
            context.body = {
                success: false,
                error: "The user can't permit to it, because he isn't an owner",
            }
            return context;
        }
        const permission = await this.prisma.permissions.findFirst({
            where: {
                user_id: user.id,
                ticket_list_id: +ticket_list_id,
            },
        });

        const permissionServiceProps = {
            ticket_list_id: +ticket_list_id,
            permit_operator: context.request.params.permit_operator.toUpperCase(),
            permission,
            user_id: user.id,
        }
        context.request.params.permit === 'yes' ? await this.permissionService.add(permissionServiceProps) :
            await this.permissionService.delete(permissionServiceProps);

        context.status = 200;
        context.body = {
            success: true,
            data: null,
        }
        return context;
    }
}
