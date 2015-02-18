/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($) {
    'use strict';

    var fxNavConfig = {
        primaryId: 'os'
    };

    Mozilla.FxFamilyNav.init(fxNavConfig);

    var $appGroupSelector = $('.app-group-selector');
    var $apps = $('img', '.apps');
    var $categoryTriggers = $('a', $appGroupSelector);

    $appGroupSelector.on('click', 'a', function(event) {
        event.preventDefault();
        var $eventTarget = $(this);
        var category = $eventTarget.data('category');

        // reset all the app icons
        $apps.addClass('fade');
        // reset all the category selector buttons
        $categoryTriggers.removeClass('active-state');
        // set the clicked element to active
        $eventTarget.addClass('active-state');

        $apps.each(function(app) {
            var $currentImg = $(this);
            if ($currentImg.hasClass(category)) {
                $currentImg.removeClass('fade');
            }
        });
    });

    $('li:first-child a', $appGroupSelector).addClass('active-state').click();

    var $demoContainer = $('.demo');
    var $fxosHeroSpace = $('.fxos-hero-space');
    var $phoneViewContainer = $('.phone');

    var $stage = $('.stage');
    var $scrollHomescreen = $('.scroll-homescreen');
    var $swipeApps = $('.swipe-apps');

    /**
     * Toggles the active-state class on all links in the container, essentially
     * causing the newly active link to be set to active.
     * @params {object} container - The container in which to find the links.
     * @params {object} [button] - An optional button argument to specify which
     *                             element to set as active.
     */
    function setActiveButton(container, button) {
        if (button) {
            $('li > a', container).removeClass('active-state');
            button.addClass('active-state');
        } else {
            $('li > a', container).toggleClass('active-state');
        }
    }

    /**
     * Switches the state of the hero area from full to demo view.
     * @param {object} [demo] - The demo to enable and animate
     */
    function switchState(demo) {
        // hide both demos and ensure animation is disabled
        $stage.removeClass('animate');

        // entering demo mode, trim the container height
        $fxosHeroSpace.toggleClass('trim-height');
        // scales and fades the large phone image
        $phoneViewContainer.toggleClass('scale');
        // activate the demo area
        $demoContainer.toggleClass('fxos-active');

        // if a demo was specified show and enable animation
        if (demo) {
            demo.addClass('animate');
            setActiveButton($demoContainer, $(demo.data('button')));
        }
    }

    $phoneViewContainer.on('click', 'a', function(event) {

        var targetID = event.currentTarget.id;

        // only handle clicks for the demo triggers
        if (targetID.indexOf('trigger') > -1) {
            event.preventDefault();
            var demo = targetID === 'trigger-swipe' ? $swipeApps : $scrollHomescreen;
            switchState(demo);
        }
    });

    $demoContainer.on('click', 'a', function(event) {

        event.preventDefault();
        var targetID = event.currentTarget.id;

        if (targetID === 'close-demo') {
            // close the demo view and switch back to default
            switchState();
        } else if (targetID === 'scroll-homescreen') {
            // show the scroll homescreen animation
            $swipeApps.removeClass('animate');
            setActiveButton($demoContainer);
            $scrollHomescreen.addClass('animate');
        } else if (targetID === 'swipe-apps') {
            // show swipe apps anim and make it play
            $scrollHomescreen.removeClass('animate');
            setActiveButton($demoContainer);
            $swipeApps.addClass('animate');
        }
    });

    var COUNTRY_CODE = '';
    /*
    * Get country code via geo-ip lookup
    */
    function getGeoLocation () {
        try {
            console.log('COUNTRY_CODE', geoip_country_code());
            COUNTRY_CODE = geoip_country_code().toLowerCase();
        } catch (e) {
            console.log('error', e);
            COUNTRY_CODE = '';
        }
    }

    /*
    * Set newsletter default options based on cc
    */
    function setNewsletterDefaults () {
        var countrySelection = $('#id_country option[value='+ COUNTRY_CODE +']');

        // if cc is in the country option list, select it
        // remove the default selection first
        if (countrySelection.length !== 0) {
            $('#id_country option:selected').prop('selected', false);
            countrySelection.prop('selected', true);
        }

        // for ve and co set the default language to es
        // other countries auto select based on cc
        switch(COUNTRY_CODE) {
        case 've':
            $('#id_lang option[value="es"]').prop('selected', true);
            break;
        case 'co':
            $('#id_lang option[value="es"]').prop('selected', true);
            break;
        default:
            $('#id_lang option[value="' + COUNTRY_CODE + '"]').prop('selected', true);
        }
    }

    window.trackGAEvent = function (eventsArray, callback) {
        if (!pause_ga_tracking) {
            var timer = null;
            var hasCallback = typeof(callback) == 'function';
            var gaCallback = function () {
                clearTimeout(timer);
                callback();
            };

            if (typeof(window._gaq) == 'object') {
                if (hasCallback) {
                    timer = setTimeout(gaCallback, 500);
                    window._gaq.push(eventsArray, gaCallback);
                } else {
                    window._gaq.push(eventsArray);
                }
            } else if (hasCallback) {
                callback();
            }
        }
    };

    /*
    * Track telecom provider link clicks/page exits in Google Analytics
    */
    function trackProviderExit (e) {
        e.preventDefault();
        var $this = $(this);
        var href = this.href;

        var callback = function () {
            window.location = href;
        };

        trackGAEvent(['_trackEvent', 'FxOs Consumer Page', 'Get A Phone Exit', $this.text()], callback);
    }

    /*
    * Set page specific content relating to geo for partner data etc
    */
    function setPartnerContent () {

        var $window = $(window);
        var $provider = $('#provider-links').find('.provider[data-country="' + COUNTRY_CODE + '"]');

        // if there are partners available, update UI
        if (COUNTRY_CODE !== '' && $provider.length > 0) {
            // show get phone calls to action
            $('#primary-cta-phone').removeClass('hidden');

            // if country has more than one provider, show the multi intro text
            if ($provider.find('li').length > 1) {
                $('#provider-text-single').hide();
                $('#provider-text-multi').show();
            }

            // show the provider applicable for the user country.
            $provider.show();

            // setup GA event tracking on telecom provider exit links
            $('#provider-links a').on('click', trackProviderExit);

            // persistent pencil icon is distracting/obtrusive on small screens
            if ($window.width() > 480) {
                $('#signup-toggle-icon').fadeIn();
            }
        } else {
            $('#primary-cta-signup').removeClass('hidden');
        }
    }

    $script('//geo.mozilla.org/country.js', function() {
        getGeoLocation();
        setNewsletterDefaults();
        setPartnerContent();
    });

})(jQuery);
