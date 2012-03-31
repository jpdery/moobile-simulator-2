
// The default resource path

Moobile.Simulator.setResourcePath('resources')

// Toolbar

new Unit({

	Prefix: 'toolbar',

	readySetup: function() {
		document.getElements('.toolbar .tool.open').addEvent('click', this.onOpen.bind(this));
		document.getElements('.toolbar .tool.device .option').addEvent('click', this.onDeviceSelect.bind(this));
		document.getElements('.toolbar .tool.orientation .option').addEvent('click', this.onOrientationSelect.bind(this));
	},

	onOpen: function(e) {
		this.publish('open');
	},

	onDeviceSelect: function(e) {
		this.publish('select device', e.target.get('data-value'));
	},

	onOrientationSelect: function(e) {
		this.publish('select orientation', e.target.get('data-value'));
	}

});

// Open Dialog

new Unit({

	Prefix: 'open',

	input: null,

	openButton: null,

	closeButton: null,

	readySetup: function() {
		this.input = document.getElement('.open-dialog input');
		this.input.set('value', LocalStorage.get('file'));
		document.getElement('.open-dialog .button.open').addEvent('click', this.onOpenButtonClick.bind(this))
		document.getElement('.open-dialog .button.close').addEvent('click', this.onCloseButtonClick.bind(this))
		this.subscribe('toolbar.open', this.onRequestOpen.bind(this));
	},

	toggle: function() {
		document.getElements('.open-dialog, .simulator').toggleClass('flipped');
	},

	onRequestOpen: function() {
		this.toggle();
	},

	onOpenButtonClick: function() {
		this.publish('file', this.input.get('value'));
		this.toggle();
	},

	onCloseButtonClick: function() {
		this.toggle();
	}

});

// Simulator

new Unit({

	Prefix: 'simulator',

	simulator: null,

	reflection: null,

	readySetup: function() {

		if (Browser.safari)
			document.body.addClass('safari');
		if (Browser.chrome)
			document.body.addClass('chrome');

		this.reflection = document.getElement('.content .reflection');
		this.subscribe('toolbar.select device', this.onRequestDeviceChange.bind(this));
		this.subscribe('toolbar.select orientation', this.onRequestOrientationChange.bind(this));
		this.subscribe('open.file', this.onOpenFile.bind(this));
		this.create();
	},

	create: function() {

		var device = LocalStorage.get('device');
		if (device === null) {
			device = 'iPhone';
		}

		var orientation = LocalStorage.get('orientation')
		if (orientation === null) {
			orientation = 'portrait';
		}

		var file = LocalStorage.get('file');

		var options = {
			deviceOrientation: orientation,
			devicePixelRatio: 1,
			container: this.reflection
		}

		this.simulator = Moobile.Simulator.create(device, file, options);
		this.simulator.addEvent('devicechange', this.onDeviceChange.bind(this));
		this.simulator.addEvent('deviceorientationchange', this.onDeviceOrientationChange.bind(this));

		this.reflect();
	},

	reflect: function() {

		var s = this.simulator.getDeviceSize();
		var o = this.simulator.getDeviceOrientation();

		switch (o) {
			case 'portrait':  this.reflection.setStyle('height', s.y); break;
			case 'landscape': this.reflection.setStyle('height', s.x); break;
		}

		return this;
	},

	onOpenFile: function(file) {
		LocalStorage.set('file', file);
		this.simulator.setApplication(file);
	},

	onRequestDeviceChange: function(device) {
		LocalStorage.set('device', device);
		this.simulator.setDeviceAnimated(device);
	},

	onRequestOrientationChange: function(orientation) {
		LocalStorage.set('orientation', orientation);
		this.simulator.setDeviceOrientationAnimated(orientation);
	},

	onDeviceChange: function(name) {
		this.reflect();
	},

	onDeviceOrientationChange: function(orientation) {
		this.reflect();
	}

});
