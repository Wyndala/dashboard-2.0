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

        this.setContent();
        var anfasser = new Element('div', {'class': 'anfasser'});

        anfasser.inject(this.element);
        this.element.setStyles({top: y, left: x});
        this.element.inject($$('.container')[0]);


        this.element.store('tileObj', this);

        var myDrag = new Drag(anfasser, {
                stopPropagation: true,
                preventDefault: true,
                onStart: function(element) {
                    var droppable = element.getParent('.tile').retrieve('tileObj');
                    droppable.dragged = true;
                },
                onDrag : function(element, event){
                    var droppable = element.getParent('.tile').retrieve('tileObj');

                    var diffX = element.getPosition().x - droppable.element.getPosition().x;
                    var diffY = element.getPosition().y - droppable.element.getPosition().y;
                    window.tb.changeTileWidth(droppable, diffX + 10, diffY + 10);
                    //console.log()
                },
                onComplete: function(element) {
                    //var droppable = element.getParent('.tile').retrieve('tileObj');
                    //droppable.dragged = false;
                    element.setStyles({left: null, top: null});
                }

        });
    },

    setContent: function() {
        var content = new Element('div', {'class': 'content'});


        var img = new Element('img', {'src': 'http://lorempixel.com/800/800/people/Dummy-Text?'+Math.random()});
        img.inject(content);
        content.inject(this.element);
    }

});

var FeedTile = new Class({
    Extends: Tile,
    entry: null,

    initialize: function(x, y, entry) {
        this.parent(x,y);
        this.entry = entry;
    },

    setContent: function() {
        var content = new Element('div', {'class': 'content'});


        var h2 = new Element('h2', {'text': this.entry.title});
        var entryContent = new Element('h2', {'html': this.entry.content});
        h2.inject(content);
        content.inject(this.element);
    }
});