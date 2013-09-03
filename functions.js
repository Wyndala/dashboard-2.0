/**
 * Created with JetBrains PhpStorm.
 * User: michael
 * Date: 21.08.13
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */
window.addEvent('domready', function() {
    var urlObject = window.location.search.slice(1).parseQueryString();
    console.log(urlObject);

    new Tileboard({tileClass: 'FeedTile', entryUrl: urlObject.entryUrl});
    //new Tileboard({tileClass: 'FeedTile', entryUrl: 'http://unterwegsinkarlmarxstadt.de/feed/'});
});