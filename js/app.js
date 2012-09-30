(function() {

var createItem = function(id, label, active) {
	return new Element('div.item').set('data-value', id).set('html', label).toggleClass('active', active);
};

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2
 */
var Settings = {

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setApplication: function(application) {
		LocalStorage.set('application', application);
		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getApplication: function() {
		return LocalStorage.get('application');
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setDevice: function(device) {
		LocalStorage.set('device', device);
		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getDevice: function() {
		return LocalStorage.get('device') || 'iPhone';
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setDeviceOption: function(device, option, value) {

		var deviceOptions = LocalStorage.get('device-options') || {};
		if (deviceOptions[device] == undefined) {
			deviceOptions[device] = {};
		}

		deviceOptions[device][option] = value;

		LocalStorage.set('device-options', deviceOptions);

		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getDeviceOption: function(device, option) {

		var deviceOptions = LocalStorage.get('device-options') || {};
		if (deviceOptions[device]) {
			return deviceOptions[device][option] || null;
		}

		return null;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setDeviceOptions: function(device, options) {

		var deviceOptions = LocalStorage.get('device-options') || {};
		if (deviceOptions[device] == undefined) {
			deviceOptions[device] = {};
		}

		deviceOptions[device] = options;

		LocalStorage.set('device-options', deviceOptions);

		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getDeviceOptions: function(device) {

		var deviceOptions = LocalStorage.get('device-options') || {};
		if (deviceOptions[device]) {
			return deviceOptions[device];
		}

		return null;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setDeviceOrientation: function(device, orientation) {
		var deviceOrientations = LocalStorage.get('device-orientations') || {};
		deviceOrientations[device] = orientation;
		LocalStorage.set('device-orientations', deviceOrientations);
		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getDeviceOrientation:function(device) {
		var deviceOrientations = LocalStorage.get('device-orientations') || {};
		return deviceOrientations[device] || 'portrait';
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	setDeviceScale: function(device, scale) {
		var deviceScales = LocalStorage.get('device-scales') || {};
		deviceScales[device] = scale;
		LocalStorage.set('device-scales', deviceScales);
		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	getDeviceScale:function(device) {
		var deviceScales = LocalStorage.get('device-scales') || {};
		return deviceScales[device] || 100;
	}
};

/**
 * Toolbar Unit
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2
 * @since  0.1
 */
new Unit({

	Prefix: 'toolbar',

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	readySetup: function() {

		var device = Settings.getDevice();

		var content = document.getElement('.content');
		var toolbar = document.getElement('.toolbar');

		this.openToolbarItem = toolbar.getElement('.toolbar-item-open');
		this.deviceToolbarItem = toolbar.getElement('.toolbar-item-device');
		this.optionToolbarItem = toolbar.getElement('.toolbar-item-option');
		this.detachToolbarItem = toolbar.getElement('.toolbar-item-detach');
		this.orientationToolbarItem = toolbar.getElement('.toolbar-item-orientation');

		this.openToolbarItem.addEvent('click:relay(.item)', this.onSelectOpen.bind(this));
		this.deviceToolbarItem.addEvent('click:relay(.item)', this.onSelectDevice.bind(this));
		this.optionToolbarItem.addEvent('click:relay(.item)', this.onSelectOption.bind(this));
		this.detachToolbarItem.addEvent('click:relay(.item)', this.onSelectDetach.bind(this));
		this.orientationToolbarItem.addEvent('click:relay(.item)', this.onSelectOrientation.bind(this));

		this.detachToolbarItem.toggleClass('disabled', !Settings.getApplication());

		var scale = Settings.getDeviceScale(device);
		var track = document.getElement('.track');
		var thumb = document.getElement('.thumb');

		var options = {
			mode: 'vertical',
			range: [100, 15],
		};

		this.scale = new Slider(track, thumb, options);
		this.scale.addEvent('change', this.onScaleChange.bind(this));
		this.scale.set(scale);

		this.subscribe('simulator.device change', this.onSimulatorDeviceChange.bind(this));
		this.subscribe('simulator.device option change', this.onSimulatorDeviceOptionChange.bind(this));
		this.subscribe('simulator.device orientation change', this.onSimulatorDeviceOrientationChange.bind(this));
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onSelectOpen: function(e) {
		this.publish('select open');
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onSelectDevice: function(e, element) {
		this.publish('select device', element.get('data-value'));
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onSelectOption: function(e, element) {
		this.publish('select option', element.get('data-value'));
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onSelectOrientation: function(e, element) {
		this.publish('select orientation', element.get('data-value'));
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onSelectDetach: function(e, element) {
		this.publish('select detach');
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onScaleChange: function(value) {

		Settings.setDeviceScale(Settings.getDevice(), value);

		var content = document.getElement('.content');
		if (content) {
			content.setStyle('transform', 'scale(' + (value / 100) + ')');
		}
	},

	// -------------------------------------------------------------------------
	// Simulator Events
	// -------------------------------------------------------------------------

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onSimulatorDeviceChange: function(simulator, device) {

		var items = this.optionToolbarItem.getElement('.items').empty();
		if (items === null)
			return;

		items.empty();

		var options = simulator.getDeviceOptions();
		if (options) {
			Object.each(options, function(option, id) {
				createItem(id, option.title, option.active).inject(items);
			});
		}

		var scale = Settings.getDeviceScale(device);
		if (scale) {
			this.scale.set(scale);
		}
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onSimulatorDeviceOptionChange: function(simulator, option, active) {
		var item = this.optionToolbarItem.getElement('.items .item[data-value=' + option + ']');
		if (item) {
			item.toggleClass('active', active);
		}
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onSimulatorDeviceOrientationChange: function(simulator, orientation) {

		var current = this.orientationToolbarItem.getElement('.items .item.active');
		if (current) {
			current.removeClass('active');
		}

		var item = this.orientationToolbarItem.getElement('.item[data-value=' + orientation + ']');
		if (item) {
			item.addClass('active');
		}
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onSimulatorOpenFile: function(file) {
		this.detachToolbarItem.toggleClass('disabled', !file);
	}

});

/**
 * Simulator Unit
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2
 * @since  0.1
 */
new Unit({

	Prefix: 'simulator',

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	readySetup: function() {

		document.body.addClass(Browser.name);

		this.reflection = document.getElement('.content .reflection');
		this.subscribe('toolbar.select open', this.onToolbarSelectOpen.bind(this));
		this.subscribe('toolbar.select device', this.onToolbarSelectDevice.bind(this));
		this.subscribe('toolbar.select option', this.onToolbarSelectOption.bind(this));
		this.subscribe('toolbar.select detach', this.onToolbarSelectDetach.bind(this));
		this.subscribe('toolbar.select orientation', this.onToolbarSelectOrientation.bind(this));

		var options = {
			container: this.reflection
		};

		this.simulator = new Moobile.Simulator(options);
		this.simulator.addEvent('devicechange', this.onDeviceChange.bind(this));
		this.simulator.addEvent('deviceoptionchange', this.onDeviceOptionChange.bind(this));
		this.simulator.addEvent('deviceorientationchange', this.onDeviceOrientationChange.bind(this));
		this.simulator.addEvent('deviceorientationanimationstart', this.onDeviceOrientationAnimationStart.bind(this));

		this.simulator.setDevice(Settings.getDevice());
		this.simulator.setApplication(Settings.getApplication());

		this.reflect();
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	reflect: function() {

		var s = this.simulator.getDeviceSize();
		var o = this.simulator.getDeviceOrientation();

		switch (o) {
			case 'portrait':  this.reflection.setStyle('height', s.y); break;
			case 'landscape': this.reflection.setStyle('height', s.x); break;
		}

		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onDeviceChange: function(device) {
		Settings.setDevice(device);
		this.simulator.setDeviceOptions(Settings.getDeviceOptions(device));
		this.simulator.setDeviceOrientation(Settings.getDeviceOrientation(device));
		this.publish('device change', [this.simulator, device]);
		this.reflect();
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onDeviceOptionChange: function(option, value) {
		Settings.setDeviceOption(Settings.getDevice(), option, value);
		this.publish('device option change', [this.simulator, option, value]);
		this.reflect();
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onDeviceOrientationChange: function(orientation) {
		Settings.setDeviceOrientation(Settings.getDevice(), orientation);
		this.publish('device orientation change', [this.simulator, orientation]);
		this.reflect();
	},

	onDeviceOrientationAnimationStart: function() {
		this.reflect();
	},

	// -------------------------------------------------------------------------
	// Subscribed
	// -------------------------------------------------------------------------

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onToolbarSelectOpen: function(device) {

		var element = document.getElement('.open');
		var content = document.getElement('.content');

		var form  = element.getElement('form');
		var path  = element.getElement('form input[type=text]');
		var close = element.getElement('.button-close');

		var application = Settings.getApplication();
		if (application) {
			path.value = application;
		}

		path.focus();

		element.toggleClass('visible');
		content.toggleClass('minimize');

		var onClose = function() {
			element.toggleClass('visible');
			content.toggleClass('minimize');
		}.bind(this);

		var onSubmit = function(e) {

			e.stop();

			var application = path.value;
			if (application) {
				Settings.setApplication(application);
				this.simulator.setApplication(application);
			}

			element.toggleClass('visible');
			content.toggleClass('minimize');

		}.bind(this);

		form.addEvent('submit:once', onSubmit);
		close.addEvent('click:once', onClose);
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onToolbarSelectDevice: function(device) {
		this.simulator.setDeviceAnimated(device);
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2
	 * @since  0.1
	 */
	onToolbarSelectOption: function(id) {
		var option = this.simulator.getDeviceOption(id);
		if (option) {
			this.simulator.setDeviceOption(id, !option.active);
		}
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onToolbarSelectOrientation: function(orientation) {
		this.simulator.setDeviceOrientationAnimated(orientation);
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2
	 */
	onToolbarSelectDetach: function() {

		var iframe = document.getElement('iframe');
		var source = iframe.get('src');
		if (source) {

			var frame = iframe.getSize();
			var popup = window.open(source, '_blank', 'height=' + frame.y + ',width=' + frame.x + ',location=no,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no');
			var resize = function() {

				var sizeX = popup.document.body.clientWidth;
				var sizeY = popup.document.body.clientHeight;
				if (sizeX == 0 && sizeY == 0) {
					resize.delay(50);
					return;
				}

				var resizeX = frame.x - sizeX;
				var resizeY = frame.y - sizeY;

				if (resizeX || resizeY) {
					popup.resizeTo(frame.x + resizeX, frame.y + resizeY);
				}
			};

			resize.delay(50);
		}
	}

});

})();