const Koa = require('koa');
const app = new Koa();

const wechat = require('./wechat')

app.use(wechat());

app.listen(8000, () => {
	console.log('服务器已启动......')
});