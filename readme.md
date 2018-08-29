# NConfig-Client

```
npm i nconfig-client -s
```

```
import NClientClient from 'nconfig-client'

let client = new NConfigClient({
  url: 'http://localhost:41892/registry',
  areaId: '111',
  env: 'dev'
})

client.ready().then(() => {
  client.get('key)
})

```