const Application = require('../../../../packages/db/models/applications')
const jwt = require('jsonwebtoken')
const MatrixDefinition = require('../../../../packages/db/models/matrixDefinition')


const createApplication =  async (req, res) =>{
    try{
        const {code} = req.body
        const application = await Application.create({ code })
        const token = jwt.sign({id: application.id.toString(), code}, process.env.JWT_SECRET)
        application.token = token
        await application.save()
        res.send(application)
    }catch(e){
        res.status(400).send(e)
    }
}


const getApplications = async (req, res) =>{
    try{
        const applications = await Application.findAll()
        res.send(applications)
    }catch(e){
        res.status(400).send(e)
    }
}


const getApplication = async (req, res) =>{
    try{
        const id = req.params.id
        if (!id) {
            throw new StandardError('errors:noId', { status: 400 })
        }

        const application = await Application.findByPk(id)
        if(!application){
            throw new StandardError('application no found', { status: 404 })
        }
        res.send(application)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
}

const deleteApplication = async (req, res) =>{
    try{
        const id = req.params.id
        if (!id) {
            throw new StandardError('errors:noId', { status: 400 })
        }
        const application = await Application.findByPk(id)
        if(!application){
            throw new StandardError('application no found', { status: 404 })
        }
        await MatrixDefinition.destroy({where :{applicationId: id}})
        await application.destroy()
        res.send(application)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
}

const updateAplication = async (req, res)=>{
    const  updates = Object.keys(req.body)
    const allowedUpdates = [
        'code',
        'token'
    ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'error: Invalid property to update!'})
    }
    try{
        const application = await Application.findOne({where: {id: req.params.id}})
        if(!application){
            throw new StandardError('application not found', { status: 404 })
        }
        Object.keys(req.body).forEach((item) =>{
            application[item] = req.body[item]
        })
        await application.save()
        res.send(application)
    }catch(e){  
        console.log(e)
        res.status(500).send(e)
    }
}

module.exports = {
    createApplication,
    getApplications,
    getApplication,
    deleteApplication,
    updateAplication

}