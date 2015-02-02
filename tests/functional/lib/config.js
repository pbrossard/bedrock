define(['intern'], function(intern) {

    var domain = intern.args.d || '127.0.0.1:8000';
    var protocol = intern.args.d ? 'https://' : 'http://';
    var rootAddress = protocol + domain + '/';
    var defaultLocale = 'en-US';

    return {

        // URLs
        domain: domain,
        url: rootAddress,
        homepageUrl: rootAddress + defaultLocale,

        // Locales
        defaultLocale: defaultLocale,

        // Async testing in milliseconds
        testTimeout: 22000

    };

});
