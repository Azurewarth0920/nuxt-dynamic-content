const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const mockPort = 3100

server.use(middlewares)

server.use('/api', router)

server.listen(mockPort, () => {
  console.log(`JSON mock server is running on ${mockPort}`)
})
