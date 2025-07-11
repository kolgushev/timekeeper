import * as dotenv from 'dotenv'
import { app as electronApp, BrowserWindow, ipcMain, dialog } from 'electron'

dotenv.config()

const isProduction = process.env.IS_PRODUCTION !== 'false'

// silence errors
if(!isProduction) {
    dialog.showErrorBox = function(title, content) {
        console.log(`${title}\n${content}`);
    }
}

// can't do top-level await in NodeJS
;(async () => {
	await electronApp.whenReady()

	let window: BrowserWindow | undefined

	const createWindow = () => {
        const settings: Electron.BrowserWindowConstructorOptions = {
			autoHideMenuBar: true,
			center: true,
			width: 1920,
			height: 1080,
			minWidth: 960,
			minHeight: 540,
			acceptFirstMouse: true,
			frame: true,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
        }

        if(!isProduction) {
            settings.x = -1920
            settings.y = 0
        }
        
		window = new BrowserWindow(settings)
        
		window.loadFile('client/index.html')
        if(!isProduction) window.webContents.openDevTools()
	}
	createWindow()

	// App listeners
	electronApp.on('window-all-closed', () => {
		// Custom handling for Darwin because MacOS is weird
		if (process.platform !== 'darwin') {
			electronApp.quit()
			return 0
		}
	})

	electronApp.on('activate', () => {
		// Custom handling for Darwin because MacOS is weird
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

})()
