const jwt = require('jsonwebtoken')
const Application = require('../../../../packages/db/models/applications')

//sk
const auth = async (req, res, next) =>{
    try{ 
        const token = req.header('auth-token')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const application = await Application.findOne({where:{id : decoded.id, code: decoded.code, token}})
        if(!application){
            throw new Error('')
        }
        req.app = application
        next()
    }catch(e){
        res.status(401).send({error : 'Please authenticate'})
    }
}

module.exports = auth