const Koa = require('koa');
const app = new Koa();

const wechat = require('./wechat')
const config = require('./config')

app.use(wechat(config));

app.listen(8000, () => {
	console.log('服务器已启动......')
});