const path = require('path')
const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const dialog = electron.dialog

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
    dialog.showErrorBox('Buzzz', 'BZZZZB! BZZZB! BZZZB! BZZZB! BZZZB!')
  })
}

function removeTray() {
  appIcon.destroy()
  app.quit()
}

app.on('ready', putInTray)