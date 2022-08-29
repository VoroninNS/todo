import Router from 'koa-router';
import KoaBody from 'koa-body';
import convert from 'koa-convert';
import AuthController from '../controllers/authController';
import {AuthMiddleware} from '../middlewares/authMiddleware';
import TicketsListsController from '../controllers/ticketsListsController';
import PermissionsController from '../controllers/permissionsController';
import TicketController from '../controllers/ticketController';
import {Middleware} from "koa";
import {
    authValidate,
    createTicketsListsValidate,
    permissionValidate,
    readDeleteTicketsListsValidate, ticketCreateValidate, ticketReadDeleteValidate, ticketUpdateValidate
} from "../yup";

const router: Router = new Router({prefix: '/api'});
const koaBody: Middleware = convert(KoaBody());
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
const ticketsListsController = new TicketsListsController();
const ticketsController = new TicketController();
const permissionsController = new PermissionsController();

router.use(authMiddleware.isAuthorized);
router.use(koaBody);

router.post('/login', authValidate(), authController.login)
router.post('/signup', authValidate(), authController.signup);

router.get('/tickets-lists/all', ticketsListsController.all);
router.post('/tickets-lists/create', createTicketsListsValidate(), ticketsListsController.create);
router.post('/tickets-lists/delete', readDeleteTicketsListsValidate(), ticketsListsController.delete);
router.post('/tickets-lists/read', readDeleteTicketsListsValidate(), ticketsListsController.read);

router.post(
    '/permissions/:permit_operator(create|update|delete|read)/:permit(yes|no)/',
    permissionValidate(),
    permissionsController.permit
);

router.get('/tickets/all', ticketsController.all);
router.post('/tickets/create', ticketCreateValidate(), ticketsController.create);
router.post('/tickets/delete', ticketReadDeleteValidate(), ticketsController.delete);
router.post('/tickets/update', ticketUpdateValidate(), ticketsController.update);
router.post('/tickets/read', ticketReadDeleteValidate(), ticketsController.read);

export function routes() {
    return router.routes()
}
