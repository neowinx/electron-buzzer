const path = require('path')
const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const dialog = electron.dialog

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');

let appIcon = null

function putInTray() {
  //http://www.flaticon.com/free-icon/joker-buzzer_87810#term=buzzer&page=1&position=2
  const iconName = process.platform === 'win32' ? 'joker-buzzer.png' : 'joker-buzzer.png'
  const iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Exit',
    click: function () {
      removeTray()
    }
  }])
  appIcon.setToolTip('Buzz me!')
  appIcon.setContextMenu(contextMenu)
  appIcon.on('click', () => {
    client.send(Buffer.from('Beep! Beep! Beep! Beep!'), 41234)
  })
}

function removeTray() {
  appIcon.destroy()
  app.quit()
}

app.on('ready', putInTray)

client.on('listening', function () {
  var address = client.address();
  console.log('client listening on ' + address.address + ":" + address.port);
  client.setBroadcast(true)
  client.setMulticastTTL(128);
  client.addMembership('230.185.192.108');
});

socket.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  dialog.showMessageBox({
    type: 'info',
    title: 'Buzzz',
    message: msg.toString()
  })
});

socket.on('listening', () => {
  var address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
  socket.setBroadcast(true)
  socket.setMulticastTTL(128);
  socket.addMembership('230.185.192.108');
});

socket.bind(41234);