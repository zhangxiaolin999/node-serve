const jwt = require('jsonwebtoken');
const p = require('path');
const f = require('fs');
const d = process.cwd();

export function createToken(data) {
    const cert = f.readFileSync(p.join(d, '/config/rsa_private_key.pem'), 'utf-8')
    let created = Math.floor(Date.now() / 1000);
    let token = jwt.sign({
        data,
        exp: created + 3600 * 24
    }, cert, { algorithm: 'RS256' });
    return token;
}
export function verifyToken(token) {
    const cert = f.readFileSync(p.join(d, '/config/rsa_public_key.pem'), 'utf-8')
    let res;
    try {
        let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
        let { exp = 0 } = result, current = Math.floor(Date.now() / 1000);
        if (current <= exp) {
            res = result.data || {}
        }
    } catch (e) {
        throw new Error('token有误')
    }
    return res
}