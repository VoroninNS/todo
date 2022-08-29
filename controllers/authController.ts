import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import koa from 'koa';
import {AuthData} from './types';
import prisma from '../client';

export default class AuthController {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    public async login(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const {login, password}: AuthData = context.request.body;
        const user = await this.prisma.users.findFirst({
            where: {
                login: login.toString(),
            }
        });
        if (!user) {
            context.status = 404;
            context.body = {
                success: false,
                error: 'The user does not exist',
            }
            return context;
        }
        const validPassword = await bcrypt.compare(password.toString(), user.password);
        if (!validPassword) {
            context.status = 404;
            context.body = {
                success: false,
                error: 'Invalid password',
            }
            return context;
        }
        context.session.user_id = user.id;
        context.status = 200;
        context.body = {
            success: true,
            data: null,
        };
        return context;
    }

    public async signup(context: koa.DefaultContext): Promise<koa.DefaultContext> {
        const {login, password}: AuthData = context.request.body;
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password.toString(), salt);
        try {
            const user = await this.prisma.users.create({
                data: {
                    login: login.toString(),
                    password: hashedPassword,
                }
            })
            context.session.user_id = user.id;
            context.status = 200;
            context.body = {
                success: true,
                data: null,
            }
        } catch (error) {
            context.status = 404;
            context.body = {
                success: false,
                error: `The user with login '${login}' already exist`,
            };
        }

        return context;
    }
}
