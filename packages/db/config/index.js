
const Sequelize = require('sequelize')

const postgres = process.env

const sequelize = new Sequelize(
    postgres.POSTGRES_DATABASE,
    postgres.POSTGRES_USERNAME,
    postgres.POSTGRES_PASSWORD,
    {
      host: postgres.POSTGRES_HOST,
      port: parseInt(postgres.POSTGRES_PORT),
      dialect: 'postgres',
      pool: {
        max: parseInt(postgres.POSTGRES_MAX_CONNECTIONS),
        min: parseInt(postgres.POSTGRES_MIN_CONNECTIONS),
        idle: parseInt(postgres.POSTGRES_IDLE_TIMEOUT),
        acquire: parseInt(postgres.POSTGRES_ACQUIRE_TIMEOUT),
      },
      logging: false 
    }
)

sequelize.sync().then(()=>console.log('synchronized')).catch((e)=>console.log(e))
sequelize.authenticate().then(()=>console.log('conected')).catch((e)=>console.log(e))
module.exports = sequelize

