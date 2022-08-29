import {PrismaClient} from '@prisma/client';
import PermissionService from '../services/permissionService';
import prisma from '../client';

export default abstract class BaseController {
    protected prisma: PrismaClient;
    protected permissionService: PermissionService;

    protected constructor() {
        this.prisma = prisma;
        this.permissionService = new PermissionService();
    }
}
