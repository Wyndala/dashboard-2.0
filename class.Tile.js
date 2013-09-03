/**
 * Created with JetBrains PhpStorm.
 * User: michael
 * Date: 21.08.13
 * Time: 17:59
 * To change this template use File | Settings | File Templates.
 */

var Tile = new Class({
    Implements: Options,
    options: {
        x: 0,
        y: 0,
        entry: null
    },

    element: null,

    initialize: function(options) {
        this.setOptions(options);
        this.element = new Element('div', {'class': 'tile'});

        this.setContent();

        this.element.setStyles({top: this.options.y, left: this.options.x});
        this.element.inject($$('.container')[0]);


        this.element.store('tileObj', this);
    },

    setContent: function() {
        var content = new Element('div', {'class': 'content'});


        var img = new Element('img', {'src': 'http://lorempixel.com/800/800/people/Dummy-Text?'+Math.random()});
        img.inject(content);
        content.inject(this.element);
    },

    getCoordinates: function() {
        return {x: this.options.x, y: this.options.y}
    },

    getX: function() {
        return this.options.x;
    },

    getY: function() {
        return this.options.y;
    },

    setX: function(x) {
        this.options.x = x;
    },

    setY: function(y) {
        this.options.y = y;
    },

    getEntry: function() {
        return this.options.entry
    }

});

var FeedTile = new Class({
    Extends: Tile,

    initialize: function(options) {
        this.parent(options);
        this.element.addClass('feed');
    },

    setContent: function() {
        var content = new Element('div', {'class': 'content'});

        var entry = this.getEntry();
        var h2 = new Element('h2', {'text': entry.title});
        var entryContent = new Element('div', {'html': entry.content});
        var entryLink = new Element('a', {'href': entry.link, 'text': 'Zum Artikel', 'target': '_blank'});
        h2.inject(content);
        entryContent.inject(content);
        entryLink.inject(content);
        content.inject(this.element);
    }
});

var MenuTile = new Class({
    Extends: Tile,
    entry: null,

    initialize: function(options) {
        this.parent(options);
        this.element.addClass('menu');
    },

    setContent: function() {
        var content = new Element('div', {'class': 'content'});

        var entry = this.getEntry();
        var h2 = new Element('h2', {'text': entry.title});
        var entryContent = new Element('div', {'html': entry.content});
        h2.inject(content);
        entryContent.inject(content);
        content.inject(this.element);
    }
});