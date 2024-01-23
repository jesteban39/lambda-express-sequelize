import envVars from '@config/envVars'
import server from './server'
import db from '@db'

db.open()
  .then(() => {
    return server.listen(envVars.port, () => {
      console.log('Server abierto en puerto: ', envVars.port)
    })
  })
  .catch((error) => console.error(error))
