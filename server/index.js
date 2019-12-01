const neo4j = require('neo4j-driver').v1;

let user = 'neo4j'
let password = 'test'
let uri = 'bolt://localhost:7687'

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const express = require('express')
const https = require('https')
const fs = require('fs')
const util = require('util')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(compression({ filter: shouldCompress }))
app.use(bodyParser.json())
app.use('/', express.static('../frontend/dist'))

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

const port = 3000

app.post('/api/create/:type/:name', (req, res) => {
  session.run(
    `CREATE (n:${decodeURI(req.params.type)} {name:"${decodeURI(req.params.name)}"}) RETURN ID(n)`
  ).then(({ records }) => {
    res.send(`${records[0]._fields[0].low}`)
  })
})

app.post('/api/update/:id', (req, res) => {
  let data = req.body
  // res.send(req.body)
  session.run(
    `MATCH (n) WHERE ID(n)=${req.params.id} SET n=${util.inspect(data)}`
  ).then(() => {
    res.send({ worked: true })
  })
})

app.post('/api/link/:type/:from/:to', async (req, res) => {
  let { from, to, type } = req.params
  let response = await session.run(
    `MATCH (f),(t) WHERE ID(f)=${from} AND ID(t)=${to} CREATE (f)-[r:${type} ${util.inspect(req.body)}]->(t) RETURN f,t`
  )
  res.send({})
})

app.get('/api/q/:query', async (req, res) => {
  let { records } = await session.run(
    `MATCH (n) WHERE n.name=~"(?i).*${req.params.query}.*" RETURN n LIMIT 25`
  )
  records = records.map(processNode)
  res.send(records)
})

app.get('/api/:type/q/:query', async (req, res) => {
  let { records } = await session.run(
    `MATCH (n:${req.params.type}) WHERE n.name=~"(?i).*${req.params.query}.*" RETURN n LIMIT 25`
  )
  records = records.map(processNode)
  res.send(records)
})

app.get('/api/:type/q/', async (req, res) => {
  let { records } = await session.run(
    `MATCH (n:${req.params.type}) RETURN n LIMIT 25`
  )
  records = records.map(processNode)
  res.send(records)
})


app.get('/api/', (req, res) => {
  session.run(
    'MATCH (n) RETURN n LIMIT 25'
  ).then(({ records }) => {
    records = records.map(processNode)
    res.send(records)
  })
})

app.get('/api/:id', (req, res) => {
  let id = req.params.id
  session.run(`MATCH (n) WHERE ID(n)=${id} RETURN n`).then(({ records }) => {
    let record = records[0]
    res.send(processNode(record))
  })
})

app.get('/api/edges/:id', (req, res) => {
  let id = req.params.id
  session.run(`MATCH (n)-[r]-(e) WHERE ID(n)=${id} RETURN type(r),r,ID(e),e.name`).then(({ records }) => {
    records = records.map(fixRecords)
    records = records.map(rec => {
      return {
        edge_type: rec['r'].type,
        edge_properties: rec['r'].properties,
        name: rec['e.name'],
        id: rec['ID(e)'].low
      }
    })
    let data = {}
    records.forEach(e => {
      let type = e.edge_type
      delete e.edge_type
      if (type in data) {
        data[type].push(e)
      } else {
        data[type] = [e]
      }
    })
    res.send(data)

  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// https.createServer({
//   key: fs.readFileSync('./server.key'),
//   cert: fs.readFileSync('./server.crt')
// }, app).listen(port, () => console.log(`Example app listening at https://localhost:${port}`))

function processNode(r) {
  let x = r._fields[0]
  x.id = x.identity.low
  delete x.identity
  return x
}

function fixRecords(rec) {
  let data = {}
  for (let i = 0; i < rec.keys.length; i++) {
    data[rec.keys[i]] = rec._fields[i]
  }
  return data
}