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
    console.log(`JSON mock server is running on ${mockPort}`)
  })

  console.log(server)
}

function shutdownMock() {
  server.close()
  console.log(`JSON mock server is shut down`)
}

module.exports = {
  setupMock,
  shutdownMock
}
