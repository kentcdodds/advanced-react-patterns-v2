const path = require('path')
const express = require('express')

const app = express()

app.use(express.static('./build'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'))
})

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    'Server running at http://0.0.0.0:' + server.address().port,
  )
})
