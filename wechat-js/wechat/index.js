// const config = require("../config");
const crypto = require('crypto')
const getRawBody = require("raw-body");
const parseStringPromise = require("xml2js").parseStringPromise;


/**

[Object: null prototype] {
  signature: 'affb6f6faa08000dd98179428e276fd3cb53854e',
  echostr: '4760040023393268214',
  timestamp: '1690702164',
  nonce: '1535996168'
}
 */

const API = require('./access_token');
const axios = require('axios');
const { log } = require('console');

module.exports = (config) => {
	return async ctx => {

		const api = new API(config);
		const accessToken = await api.get_access_token();
		// 获取 access_token
		console.log('access_token:',accessToken);
		
		// 获取用户列表. 测试未通过
		// users: {
		// 		errcode: 40001,
		// 		errmsg: 'invalid credential, access_token is invalid or not latest, could get access_token by getStableAccessToken, more details at https://mmbizurl.cn/s/JtxxFh33r rid: 64c66038-6952db2e-4df155c2'
		// }
		const get_users_url = `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&next_openid=`;
		const users = await axios.get(get_users_url);
		console.log('users:', users.data);

		console.log(ctx.query)
		// const { token } = config;
		const { signature, echostr, timestamp, nonce } = ctx.query;
		const arrStr = [timestamp, nonce, config.token].sort().join('');
		let shasum = crypto.createHash('sha1')
		let generatedSignature = shasum.update(arrStr).digest('hex')
		// console.log('generatedSignature>>> ', generatedSignature)
	
		if (ctx.method === 'GET') {
			if (generatedSignature === signature) {
				return ctx.body = echostr;
			}
		} else if (ctx.method === 'POST') {
	
			// console.log('POST>>> ', generatedSignature === signature)
	
			const xmlBody = await getRawBody(ctx.req, {
				length: ctx.request.length,
				limit: '1mb',
				encoding: ctx.request.charset || 'utf-8'
			});
	
			console.log('xmlBody:', xmlBody)
			
			const bodyStr = await parseStringPromise(xmlBody, { trim: true ,explicitArray: false})
			console.log('bodyStr', bodyStr);
	
			/**
			 *   
				<xml>
					<ToUserName><![CDATA[toUser]]></ToUserName>
					<FromUserName><![CDATA[fromUser]]></FromUserName>
					<CreateTime>1348831860</CreateTime>
					<MsgType><![CDATA[text]]></MsgType>
					<Content><![CDATA[this is a test]]></Content>
					<MsgId>1234567890123456</MsgId>
					<MsgDataId>xxxx</MsgDataId>
					<Idx>xxxx</Idx>
				</xml>
	
				xml: {
					ToUserName: 'gh_3d2e1c2de269',
					FromUserName: 'o8h6r6Ho2hJsnn3Lkbp2Yo-qo5jk',
					CreateTime: '1690710051',
					MsgType: 'text',
					Content: '123',
					MsgId: '24205148080526865'
				}
			 */
			// 被动回复消息（公众号收到用户发的消息后，给用户回复的消息）
			if (bodyStr.xml.Content==='123') {
				return ctx.body = `<xml>
				<ToUserName><![CDATA[${bodyStr.xml.FromUserName}]]></ToUserName>
				<FromUserName><![CDATA[${bodyStr.xml.ToUserName}]]></FromUserName>
				<CreateTime>${new Date().getTime()}</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[收到消息：${bodyStr.xml.Content}]]></Content>
			  </xml>`;
			} else if (bodyStr.xml.Content==='长度测试') {
				let content = '';
				for (let i = 1; i <= 357; i++) {
					content+= `、${i}`;
				}
				return ctx.body = `<xml>
				<ToUserName><![CDATA[${bodyStr.xml.FromUserName}]]></ToUserName>
				<FromUserName><![CDATA[${bodyStr.xml.ToUserName}]]></FromUserName>
				<CreateTime>${new Date().getTime()}</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[收到消息：${content.substring(1)}]]></Content>
			  </xml>`;
			}else {
				return ctx.body = `<xml>
				<ToUserName><![CDATA[${bodyStr.xml.FromUserName}]]></ToUserName>
				<FromUserName><![CDATA[${bodyStr.xml.ToUserName}]]></FromUserName>
				<CreateTime>${new Date().getTime()}</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[收到消息：${bodyStr.xml.Content}\nYour name is: ${bodyStr.xml.FromUserName}\nMy name is: ${bodyStr.xml.ToUserName}]]></Content>
			  </xml>`;
			} 
	
	
			return ctx.body = 'success';
		}
	}
}