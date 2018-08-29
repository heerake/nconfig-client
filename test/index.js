const NConfigClient = require('../dist/index').default

let client = new NConfigClient({
  url: 'http://localhost:41892/registry',
  areaId: '111',
  env: 'dev'
})

client.ready().then(() => {
  debugger
  console.log(123)
  console.log(client.get('test2'))

})