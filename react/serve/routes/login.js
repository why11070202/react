var express = require('express');
var router = express.Router();
var crypto = require('crypto');

const {
    find,
    insert,
    del,
    update
} = require('../lib/mongodb.js');
/* GET users listing. */

var token1 = {
    // 加密 obj需要加密的数据，timeout加密的时效性
    createToken: function (obj, timeout) {
        //后来加的时效性  token在30内都是有效的
        //var timeout = 300000;

        // console.log(parseInt(timeout) || 0);
        var obj2 = {
            data: obj, //payload
            created: parseInt(Date.now() / 1000), //token生成的时间的，单位秒
            exp: parseInt(timeout) || 10 //token有效期
        };
        
        //payload信息 Buffer转数据
        var base64Str = Buffer.from(JSON.stringify(obj2), "utf8").toString("base64");
        //添加签名，防篡改
        var secret = "piggyyao.com";
        var hash = crypto.createHmac('sha256', secret);
        hash.update(base64Str);
        var signature = hash.digest('base64');
        return base64Str + "." + signature;
    },

    // 解码
    decodeToken: function (token) {
        // return token
        var decArr = token.split(".");
        // console.log(decArr.length);
        // console.log(decArr.length < 2);
        if (decArr.length < 2) {
            //token不合法
            return false;
        }
        let newtoken = token + "="
        var payload = {};
        //将payload json字符串 解析为对象
        try {
            payload = JSON.parse(Buffer.from(newtoken, "base64").toString("utf8"));
        } catch (e) {
            return false;
        }
        // console.log(payload);//{ data: '430424', created: 1566563347, exp: 10 }
        // console.log(newtoken);//eyJkYXRhIjoiNDMwNDI0IiwiY3JlYXRlZCI6MTU2NjU2MzM0NywiZXhwIjoxMH0=.+QB+wY2SKK0M13U46Y3DyDKguJRDybJ4YQDV8vePk1k==
        // //检验签名
        var secret = "piggyyao.com";
        var hash = crypto.createHmac('sha256', secret);
        console.log('hash',hash);
        /*
            Hmac {
            _handle: {},
            _options: undefined,
            writable: true,
            readable: true,
            [Symbol(kState)]: { [Symbol(kFinalized)]: false } }
        
        */
        hash.update(decArr[0]);
        console.log(hash.update(decArr[0]));
        var checkSignature = hash.digest('base64');
        return {
            payload: payload,
            signature: decArr[1],
            checkSignature: checkSignature
        }
    },

    // 校验
    checkToken: function (a) {
        // console.log(this.decodeToken,a);

        var resDecode = this.decodeToken(a);
        // console.log('typeof',typeof resDecode);
        // console.log('resDecode', resDecode);
        if (!resDecode) {
            return false;
        }
        // 是否过期
        var expState = (parseInt(Date.now() / 1000) - parseInt(resDecode.payload.created)) > parseInt(resDecode.payload.exp) ? false : true;
        // 验证签名
        if (expState) {
            return true;
        }
        return false;
    }
}

router.post('/login', function (req, res, next) {
    let { username, password } = req.body
    find('user', {
        username,
        password,
    }, (results) => {
        // console.log(results);
        if (results) {
            let tk = token1.createToken(username)
            console.log(tk);
            results[0].token = tk;
        }
        res.json(results[0]);
    })
});
router.post('/check', function (req, res, next) {

    let { token } = req.body
    // console.log(typeof (token));
    let data= token1.checkToken(token)
    res.send(data)
    // console.log(data)
    // res.send("ok")
});

module.exports = router;
