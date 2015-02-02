define([
    'intern!object',
    'intern/chai!assert',
    'base/functional/lib/config',
    'base/functional/lib/poll',
    'require'
], function(registerSuite, assert, config, poll, require) {

    var url = config.homepageUrl;

    // Register the tests to be run
    registerSuite({

        name: 'home',

        'Homepage promos should be displayed': function() {
            return this.remote
                .get(require.toUrl(url))
                .findAllByCssSelector('.promo-grid > li')
                .then(function (promos) {
                    assert.ok(promos.length === 16, 'There should be 16 promos on the homepage');
                })
                .end()
                .findAllByCssSelector('#promo-1 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-1 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-2 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-2 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-3 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-3 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-4 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-4 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-5 a.fxos-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-5 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-6 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-6 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-7 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-7 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-8 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-8 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-9 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-9 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-10 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-10 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-11 > a.panel-link')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-11 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-12 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-12 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-13 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-13 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-14 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-14 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-15 > a')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-15 link should be displayed');
                })
                .end()
                .findAllByCssSelector('#promo-16 a.twt-account')
                .then(function (promo) {
                    assert.ok(promo.length === 1, 'Promo-16 link should be displayed');
                })
        },

        'Hovering over promo should reveal the link': function() {
            return this.remote
                .get(require.toUrl(url))
                .findById('promo-1')
                .moveMouseTo(10, 10)
                .end()
                .findByCssSelector('#promo-1 > a.panel-link')
                .then(function(element) {
                    return poll.until(element, 'isDisplayed').then(function() {
                        assert.isTrue(true);
                    });
                });
        },

        'Homepage newsletter form is displayed': function() {
            return this.remote
                .get(require.toUrl(url))
                .findByCssSelector('.newsletter-form')
                .then(function (form) {
                    assert.ok(form.isDisplayed(), 'Newsletter form should be visible');
                })
        },

        'Homepage newsletter form submission': function() {
            return this.remote
                .get(require.toUrl(url))
                .findById('id_email')
                .click()
                .type('noreply@mozilla.com')
                .end()
                .findById('id_privacy')
                .then(function(element) { return poll.until(element, 'isDisplayed')})
                .click()
                .end()
                .findByCssSelector('.newsletter-form')
                .submit()
                .end()
                .getCurrentUrl()
                .then(function (url) {
                    assert.isTrue(url.indexOf('sign-up-for-mozilla') !== -1);
                })
        }
    });

});
