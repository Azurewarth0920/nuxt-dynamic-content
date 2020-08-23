const jsonServer = require('json-server')
const path = require('path')
let server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const mockPort = 3100

server.use(middlewares)

server.use('/api', router)

function setupMock() {
  server = server.listen(mockPort, () => {
    console.log(`\nJSON mock server is running on ${mockPort}`)
  })
}

function shutdownMock() {
  server.close()
  console.log('\nJSON mock server is shut down')
}

module.exports = {
  setupMock,
  shutdownMock
}
