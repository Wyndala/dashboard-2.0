/**
 * Created with JetBrains PhpStorm.
 * User: michael
 * Date: 21.08.13
 * Time: 17:59
 * To change this template use File | Settings | File Templates.
 */

var Tile = new Class({

    x: 0,
    y: 0,
    element: null,

    initialize: function(x, y) {
        this.x = x;
        this.y = y;
        this.element = new Element('div', {'class': 'tile'});
        var content = new Element('div', {'class': 'content'});


        var img = new Element('img', {'src': 'http://lorempixel.com/1024/1024/people/Dummy-Text?'+Math.random()});
        img.inject(content);
        content.inject(this.element);
        this.element.setStyles({top: y, left: x});
        this.element.inject($$('.container')[0]);
        this.element.store('tileObj', this);
    }

});