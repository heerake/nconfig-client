import socketClient from 'socket.io-client'

interface NConfigClientOptionInterface {
  url: string
  areaId: string
  env: string
  autoUpdateClose?: boolean
  autoUpdateTime?: number
}

class NConfigClient {
  private options: NConfigClientOptionInterface
  private readyCallback?: Function
  private isReady: boolean
  private socket: SocketIOClient.Socket
  private data: any
  private autoUpdateId?: number

  constructor(opts: NConfigClientOptionInterface) {
    this.options = opts
    this.isReady = false

    this.socket = socketClient(opts.url)

    this.socket.on('connect', () => {
      this.socket.emit('init', {
        id: opts.areaId,
        env: opts.env
      })
    })

    this.socket.on('initdata', (data: any) => {
      this.isReady = true
      this.data = data

      if (this.readyCallback) {
        this.readyCallback(true)
        this.readyCallback = undefined
      }
    })

    this.socket.on('getalldata', (data: any) => {
      this.data = data
    })

    this.socket.on('update', (data: any) => {
      this.data[data.key] = data.value
    })

    if (!opts.autoUpdateClose) {
      this.startAutoUpdate()
    }
  }
  ready() {
    if (this.isReady)
      return Promise.resolve(true)

    return new Promise((res, rej) => {
      this.readyCallback = res
    }).catch(() => {
      return false
    })
  }
  get(key: string) {
    if (!this.isReady)
      throw new Error('Socket Not Ready!')

    return this.data[key]
  }
  updateAllData() {
    this.socket.emit('getalldata', (data: any) => {
      this.data = data
    })
  }
  startAutoUpdate() {
    this.stopAutoUpdate()

    this.autoUpdateId = this.autoUpdateId = setInterval(() => {
      this.updateAllData()
    }, this.options.autoUpdateTime || 300000) // 5 minutes
  }
  stopAutoUpdate() {
    if (this.autoUpdateId) {
      clearInterval(this.autoUpdateId)
      this.autoUpdateId = undefined
    }
  }
}

export default NConfigClient