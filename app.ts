import Koa from 'koa';
import {routes} from './routes/api';
import session from 'koa-session';
import logger from 'koa-morgan';

const app = new Koa();

app.use(logger('dev'));

const oneDay = 1000 * 60 * 60 * 24;
app.keys = [process.env.SESSION_SECRET ?? 'some secret hurr'];
app.use(session({
    key: process.env.SESSION_SECRET,
    maxAge: oneDay,
}, app));
app.listen(process.env.APP_RORT ?? 3000);
app.use(routes());

export default app;