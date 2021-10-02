const { try } = require('bluebird')
const StandardError = require('standard-error')
const Kits = require('../../../../packages/db/models/kits')
const kitInv = require('../../../../packages/db/models/kits_inv')
const MatrixDefinition = require('../../../../packages/db/models/matrixDefinition')


const createKit = async (req,res) =>{
    try{
        const {kit_id, nombre, cantidad, disponibles, objeto_cantidad, objeto_estado} = req.body,
        const kit = await Kits.create({
            kit_id: kit_id,
            nombre: nombre,
            cantidad: cantidad,
            disponibles: disponibles
        })
        await kit.save()
        for(const serial in objeto_cantidad){
            const kit_inv = await KitInv.create({
                kit_id: kit_id,
                serial: serial,
                cantidad: objeto_cantidad[serial],
                estado: objeto_estado[serial]
            })
            await kit_inv.save()
        }
    }catch(e){
        res.status(400).send(e)
    }
}

const getKits = async(req,res) =>{
    try{
        const kits = await Kits.findAll()
        res.send(Kits)
    }catch(e){
        res.status(400).send(e)
    }
}

const deleteKit = async (req,res) =>{
    try{
        const id = req.params.id
        if(!id){
            throw new StandardError('errors:noId', {status:400})
        }
        const kit = await Kits.findById(id)
        if(!kit){
            throw new StandardError('application no found', { status: 404 })
        }
        await MatrixDefinition.destroy({where :{kit_id: id}})
        await kit.destroy()
        res.send(kit)
    }catch(e){
        res.status(400).send(e)
    }
}

module.exports = {
    createKit,
    getKits,
    deleteKit
}