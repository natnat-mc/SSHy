// Really struggling to encode string as a binary array buffer
// this technique seems to work, but why!
// Adapted from the following
// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
//
function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf))
}

function str2ab(str) {
	var buf = new ArrayBuffer(str.length * 1) // 2 bytes for each char
	var bufView = new Uint8Array(buf)
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i)
	}
	return buf
}
function setProxyEncoding(en) {
	wsproxyEncoding = en
}

window.onload = function () {
	document.getElementById('login_cred').style.display = 'block'
	// Sets the default colorScheme to material
	settings = new SSHyClient.settings()
	settings.setColorScheme(1)

	// Build the default wsProxy URL for display on sidenav
	buildWSProxyURL()
	//setProxyEncoding('binary');

	// Connect upon hitting Enter from the password field
	document
		.getElementById('password')
		.addEventListener('keyup', function (event) {
			if (event.key !== 'Enter') return
			document.getElementById('connect').click()
			event.preventDefault()
		})
}

// Run every time the webpage is resized
window.onresize = function () {
	clearTimeout(resizeInterval)
	resizeInterval = setTimeout(resize, 400)
}

// Recalculates the terminal Columns / Rows and sends new size to SSH server + xtermjs
function resize() {
	if (term) {
		// Calculate best rows and columns for the div
		fitAddon.fit()
		// Let the SSH session know the new size
		transport.auth.mod_pty('window-change', term.cols, term.rows)
		// Update the side panel
		document.getElementById('termCols').value = term.cols
		document.getElementById('termRows').value = term.rows
	}
}

// Build the entire websocket url eg (wss://localhost:5999/) based on http protocol
function buildWSProxyURL(portPassed) {
	// Decide if we're using secure ws or not
	if (window.location.protocol == 'https:') {
		wsproxyProto = 'wss'
	}

	var port
	if (portPassed) {
		port = ''
	} else {
		port = ':' + wsproxyPorts[wsproxyProto]
	}

	// Build the wsproxyURL up
	wsproxyURL = wsproxyProto + '://' + wsproxyURL + port + '/'

	document.getElementById('websockURL').value = wsproxyURL
}

// Changes the websocket proxy URL ** BEFORE ** connection ONLY
function modProxyURL(newURL) {
	if (!ws) {
		// Strip it down to barebones URL:PORT(optional)
		matches =
			/^w?s{0,2}:?\/{0,2}(([a-z0-9]+\.)*[a-z0-9]+\.?[a-z]+)\:?([0-9]{1,5})?/g.exec(
				newURL
			)
		var port = ''
		if (newURL.match(':')) {
			port = ':' + matches[matches.length - 1]
		}

		wsproxyURL = matches[1] + port
		buildWSProxyURL(port)
	}
}

// Toggles the settings navigator
function toggleNav(size) {
	document.getElementById('settingsNav').style.width = size + 'px'
	settings.sidenavElementState = size
	// We need to update the network traffic whenever the nav is re-opened
	if (size && transport) {
		settings.setNetTraffic(transport.parceler.recieveData, true)
		settings.setNetTraffic(transport.parceler.transmitData, false)
	}
	var element = document.getElementById('gear').style
	element.visibility = element.visibility === 'hidden' ? 'visible' : 'hidden'
}
// Rudimentary checks that an IP address is external and is a valid hostname or IP address
function validate(id, text) {
	if (!text) {
		document.getElementById(id).style.borderBottom = 'solid 2px #ff4d4d'
	} else {
		if (id == 'ipaddress') {
			// incase we have a error for the port
			if (text.includes(':')) {
				if (!validate_port(text.split(':')[1])) {
					document.getElementById(id).style.borderBottom =
						'solid 2px #ff4d4d'
					return
				} else {
					document.getElementById(id).style.borderBottom =
						'solid 2px #c9c9c9'
					document.getElementById('failure').style.display = 'none'
				}
			} else {
				// if we're not doing ports then hide the failure message
				document.getElementById('failure').style.display = 'none'
			}
			// test for valid domain name
			if (
				!/^([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+(\:[0-9]{1,5})?$/.test(text)
			) {
				if (check_internal(text)) {
					display_error(
						'Be aware - IP addresses are resolved at the websocket proxy'
					)
				}
				// test ip aswell.
				if (
					!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$|(\:[0-9]{1,5}))){4}$/.test(
						text
					)
				) {
					document.getElementById(id).style.borderBottom =
						'solid 2px #ff4d4d'
					return
				} else {
					if (check_internal(text)) {
						display_error(
							'Could no resolve hostname: Please use an external address'
						)
					}
					document.getElementById(id).style.borderBottom =
						'solid 2px #c9c9c9'
					return
				}
				document.getElementById(id).style.borderBottom =
					'solid 2px #ff4d4d'
				return
			}
		}
		document.getElementById(id).style.borderBottom = 'solid 2px #c9c9c9'
	}
}
// Validates the port is 0 > port < 65536
function validate_port(port_num) {
	if (port_num > 0 && port_num < 65536) {
		return port_num
	} else {
		display_error('Invalid port: port must be between 1 - 65535')
		validate('ipaddress', '')
	}
}
// checks for 10.*.*.*, 192.168.*.*, 172.16.*.*, 127.0.0.1 & loocalhost
function check_internal(ip_address) {
	if (
		/10\.\d+\.\d+\.\d+/.test(ip_address) ||
		/192\.168\.\d+\.\d+/.test(ip_address) ||
		/172\.16\.\d+\.\d+/.test(ip_address)
	) {
		return true
	} else if (ip_address == '127.0.0.1' || ip_address == 'localhost') {
		return true
	}

	return false
}
// Displays a given err on the page
function display_error(err) {
	// remove the loading cog and set the 'connecting' to connect
	document.getElementById('load-container').style.display = 'none'
	document.getElementById('connect').value = 'connect'

	document.getElementById('failure').innerText = err
	document.getElementById('failure').style.display = 'block'
}
// Initialises xtermjs
function termInit() {
	// Define the terminal rows/cols
	term = new Terminal({
		//cols: 80,
		//rows: 24
	})

	// start xterm.js
	term.open(document.getElementById('terminal'), true)
	fitAddon = new FitAddon()
	term.loadAddon(fitAddon)

	fitAddon.fit()
	term.focus()

	// set the color scheme to whatever the user's changed it to in the mean time
	var colName = document.getElementById('currentColor').innerHTML
	for (i = 0; i < settings.colorSchemes.length; i++) {
		if (settings.colorSchemes[i][0] == colName) {
			settings.setColorScheme(i)
			break
		}
	}

	// clear the modal elements on screen
	document.getElementById('load-container').style.display = 'none'
	document.getElementById('login_cred').style.display = 'none'
}
// Binds custom listener functions to xtermjs's Terminal object
function startxtermjs() {
	termInit()

	// sets up some listeners for the terminal (keydown, paste)
	term.onData(data => {
		if (!ws || !transport || !transport.auth.authenticated) {
			// If no connection dont send, and unauthenticated connections handled
			// elsewhere
			return
		}
		if (data.length > 5000) {
			// Apparently long strings kill SSHyClient.parceler, although it is
			// probably best to sort that there rather than here...
			var blocks
			blocks = splitSlice(data)
			//console.log("ondata length ",blocks.length);
			for (var i = 0; i < blocks.length; i++) {
				//console.log("ondata block ",i,blocks[i].charCodeAt(0))
				transport.expect_key(blocks[i])
			}
		} else {
			//console.log("ondata ",data.charCodeAt(0), data.substr(1))
			transport.expect_key(data)
		}
	})

	term.attachCustomKeyEventHandler(e => {
		// Sanity Checks
		if (e.type != 'keydown') {
			return
		}

		// If websocket is closed, ran out of attempts to authenticate, or just
		// waiting to confirm the username and password, dont forward keys
		if (
			!ws ||
			!transport ||
			transport.auth.failedAttempts >= 5 ||
			transport.auth.awaitingAuthentication
		) {
			return false
		}
		var pressedKey
		/** IE isn't very good so it displays one character keys as full names in .key
						EG - e.key = " " to e.key = "Spacebar"
						so assuming .char is one character we'll use that instead **/
		if (e.char && e.char.length == 1) {
			pressedKey = e.char
		} else {
			pressedKey = e.key
		}

		if (pressedKey.length == 1 && e.shiftKey && e.ctrlKey) {
			// allows ctrl + shift + v for pasting
			// and dont forward those keys to the terminal
			if (e.key == 'V') {
				return false
			}
		}

		return
	})
}

// Starts the SSH client in scripts/transport.js
function startSSHy() {
	var html_ipaddress = document.getElementById('ipaddress').value
	var termUsername = document.getElementById('username').value
	var termPassword = document.getElementById('password').value

	if (wsproxyEncoding == 'binary') {
	} else {
		wsproxyEncoding = 'base64'
	}

	// find the port number
	if (html_ipaddress.includes(':')) {
		var split = html_ipaddress.split(':')
		html_ipaddress = split[0]
		html_port = validate_port(split[1])
	} else {
		html_port = 22
	}

	if (termUsername.length == 0 || termPassword.length == 0) {
		validate('username', termUsername)
		validate('password', termPassword)
		return
	}

	// Error checking is done so remove any currently displayed errors
	document.getElementById('failure').style.display = 'none'
	document.getElementById('connect').value = 'Connecting...'
	document.getElementById('load-container').style.display = 'block'

	// Disable websocket proxy modifications
	document.getElementById('websockURL').disabled = true

	// Initialise the window title
	document.title = 'SSHy Client'
	// Opens the websocket!
	wsproxyURL += html_ipaddress + ':' + html_port

	if (wsproxyEncoding == 'binary') {
		ws = new WebSocket(wsproxyURL)
		ws.binaryType = 'arraybuffer'
	} else {
		ws = new WebSocket(wsproxyURL, 'base64')
	}

	// Sets up websocket listeners
	ws.onopen = function (e) {
		transport = new SSHyClient.Transport(ws, settings)
		transport.auth.termUsername = termUsername
		transport.auth.termPassword = termPassword
		transport.auth.hostname = html_ipaddress
	}
	// Send all recieved messages to SSHyClient.Transport.handle()
	ws.onmessage = function (e) {
		// Convert the recieved data from base64 to a string
		if (wsproxyEncoding == 'binary') {
			// ArrayBuffer to String
			transport.parceler.handle(ab2str(e.data))
		} else {
			// Convert the recieved data from base64 to a string
			transport.parceler.handle(atob(e.data))
		}
	}
	// Whenever the websocket is closed make sure to display an error if appropriate
	ws.onclose = function (e) {
		// Set the sidenav websocket proxy color to yellow
		document.getElementById('websockURL').classList.remove('brightgreen')
		document.getElementById('websockURL').classList.add('brightyellow')
		if (term) {
			// Don't display an error if SSH transport has already detected a graceful exit
			if (transport.closing) {
				return
			}
			term.write(
				'\n\n\rWebsocket connection to ' +
					transport.auth.hostname +
					' was unexpectedly closed.'
			)
			// If there is no keepAliveInterval then inform users they can use it
			if (!settings.keepAliveInterval) {
				term.write(
					'\n\n\rThis was likely caused by he remote SSH server timing out the session due to inactivity.\r\n- Session Keep Alive interval can be set in the settings to prevent this behaviour.'
				)
			}
		} else {
			// Since no terminal exists we need to initialse one before being able to write the error
			termInit()
			term.write(
				'WebSocket connection failed: Error in connection establishment: code ' +
					e.code
			)
		}
	}
	// Just a little abstraction from ws.send
	ws.sendB64 = function (e) {
		if (wsproxyEncoding == 'binary') {
			this.send(str2ab(e))

			transport.parceler.transmitData += e.length
			transport.settings.setNetTraffic(
				transport.parceler.transmitData,
				false
			)
		} else {
			this.send(btoa(e))
			transport.parceler.transmitData += e.length
			settings.setNetTraffic(transport.parceler.transmitData, false)
		}
	}

	// Set the sidenav websocket proxy color to green
	document.getElementById('websockURL').classList.add('brightgreen')
}

document.title = title
document.querySelector('#ipaddress').value = defaultHost
document.querySelector('#username').value = defaultLogin
