import {PrismaClient} from '@prisma/client';
import koa from 'koa';
import {Id, User} from './types';
import prisma from '../client';

export class AuthMiddleware {
    private prisma: PrismaClient;
    private readonly auth_urls = [/\/api\/login\/?/, /\/api\/signup\/?/];

    constructor() {
        this.prisma = prisma;
        this.isAuthorized = this.isAuthorized.bind(this);
    }

    public async isAuthorized(context: koa.Context, next: koa.Next): Promise<koa.Next | koa.Context> {
        let user: User;
        const id: Id = context.session?.user_id;
        if (id) {
            user = await this.prisma.users.findFirst({where: {id}});
        }
        if (!user && !this.auth_urls.some(authUrl => authUrl.test(context.request.url))) {
            context.status = 404;
            context.body = {
                success: false,
                error: 'You need to auth before using API',
            };
            return context;
        }
        return await next();
    }
}
