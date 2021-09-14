const express = require('express')
require('../../../packages/db/config/index')
const aplicationsRouter = require('../v1/routers/applications')
const matricesRouter = require('../v1/routers/matrices')
const matrixDefinitionRouter = require('../v1/routers/matrixDefinition')
const {isSuperAdmin} = require('../../../packages/policies')
const auth = require('../v1/middleware/auth')

const app = express()

app.use(express.json())
app.use('/applications', isSuperAdmin, aplicationsRouter)
app.use('/matrices', auth, matricesRouter)
app.use('/matrixDefinitions', auth, matrixDefinitionRouter)
module.exports = app