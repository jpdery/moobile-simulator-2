/*
---

name: Device.Andorid

description:

license: MIT-style license.

author:
  - Tollot Michele (michele.tollot@gmail.com)

requires:
  - Device

provides:
  - Device.Android

...
*/

Moobile.Simulator.Device['Andoid'] = new Class({

  Extends: Moobile.Simulator.Device,

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  glare: null,

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  statusBar: null,

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  statusBarSystem: null,

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  statusBarTime: null,
  
    /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  statusBarBrowser: null,
  
    /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  factoryOrientation: 'portrait',
  
  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.1
   */
  setup: function() {

    this.parent();

    this.require('Android/styles.css');

    var wrapper = this.simulator.getDeviceElement();
    var content = this.simulator.getScreenElement();

    this.glare = new Element('div.simulator-glare');
    this.glare.inject(wrapper, 'top');

    this.statusBar = new Element('div.simulator-status-bar');
    this.statusBarBrowser = new Element('div.simulator-status-bar-browser');
    this.statusBarTime = new Element('div.simulator-status-bar-time');
    this.statusBarSystem = new Element('div.simulator-status-bar-system');

    this.statusBar.inject(content, 'bottom');
    this.statusBarBrowser.inject(this.statusBar);
    this.statusBarTime.inject(this.statusBar);
    this.statusBarSystem.inject(this.statusBar);

    this.defineOption('glare', 'Show Screen Glare', {
      active: true,
      enable:  function() { wrapper.removeClass('without-glare') },
      disable: function() { wrapper.addClass('without-glare') }
    });
  },

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  teardown: function() {
    this.glare.destroy();
    this.glare = null;
    this.statusBar.destroy();
    this.statusBar = null;
    this.statusBarTime = null;
    this.statusBarBrowser = null;
    this.statusBarSystem = null;
    this.parent();
  }
});

/*
---

name: Device.GalaxyTab

description:

license: MIT-style license.

author:
  - Tollot Michele (michele.tollot@gmail.com)

requires:
  - Device

provides:
  - Device.GalaxyTab

...
*/

Moobile.Simulator.Device['GalaxyTab'] = new Class({

  Extends: Moobile.Simulator.Device['Andoid'],

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  browserBar: null,
  
  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  browserAddress: null,

  /**
   * @author Tollot Michele (michele.tollot@gmail.com)
   * @since  0.2
   */
  factoryOrientation: 'landscape',

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.1
   */
  setup: function() {

    this.parent();

    this.require('GalaxyTab/styles.css');

    var wrapper = this.simulator.getDeviceElement();
    var content = this.simulator.getScreenElement();

    this.browserBar = new Element('div.simulator-browser-bar');
    this.browserBar.inject(content, 'top');
    
    this.browserAddress = new Element('input.simulator-browser-address',{'readonly':'readonly'});
    this.browserAddress.inject(this.browserBar, 'top');
    
    this.defineOption('browser-bar', 'Show Navigation Bar', {
      active: false,
      enable:  function() { wrapper.addClass('with-browser-bar'); },
      disable: function() { wrapper.removeClass('with-browser-bar'); }
    });
    
    this.defineOption('browser-address', 'Set Navigation Address', {
      active: true,
      enable:  function() { this.browserAddress.show(); },
      disable: function() { this.browserAddress.hide(); },
      value: function( address ) { this.browserAddress.set('value',address); }
    });

  },

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  teardown: function() {
    this.browserBar.destroy();
    this.browserBar = null;
    this.parent();
  },

  /**
   * @author Tollot Michele(michele.tollot@gmail.com)
   * @since  0.2
   */
  getSize: function() {
    return {
      x: 1030,
      y: 1509
    };
  }

});