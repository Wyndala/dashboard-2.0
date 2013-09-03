/**
 * Tileboard for a lot of content
 * @author Ralf Michael
 * @type {Class}
 */

var Tileboard = new Class({
    Implements: Options,
    tileCount: 8,
    tiles: [],
    tileList: [],
    container: null,
    margin: 10,
    options: {
        cssOptions: {
            'tileClass': '.tile',
            'containerClass': '.container'
        },
        tileObject: 'Tile',
        tileOptions: {},
        entries: {},
        entryUrl: ''
    },
    /**
     * Constructor of the Tileboard Class
     */
    initialize: function(options) {
        this.setOptions(options);
        this.container = $$(this.options.cssOptions.containerClass)[0];
        if (this.options.entryUrl.length) {
            this.getEntries(this.options.entryUrl, function(data) {
                this.tileCount = data.responseData.feed.entries.length;
                this.options.entries = data.responseData.feed.entries;
                this.initTiles();
                this.addEvents();
            }.bind(this));
        } else {
            this.initTiles();
            this.addEvents();
        }


    },

    addEvents: function() {
        var tileboard = this;
        $$(this.options.cssOptions.tileClass).addEvent('click', function() {

            if (this.getStyle('width').toInt() <= Math.ceil(tileboard.tileWidth)) {
                var newWidth = tileboard.tileWidth * 2;
                var newHeight = tileboard.tileWidth * 1;

            } else {
                var newWidth = tileboard.tileWidth;
                var newHeight = tileboard.tileWidth;
            }
            if (!this.retrieve('tileObj').dragged) {
                tileboard.changeTileWidth(this.retrieve('tileObj'), newWidth, newHeight);
            } else {
                this.retrieve('tileObj').dragged = false;
            }
        });

        window.addEvent('resize', function() {
            tileboard.actualizeTiles();
        });
    },

    /**
     * Changes the width and height of a given Tile
     * @param {Tile} tile
     * @param {Number] newWidth
     * @param {Number] newHeight
     */
    changeTileWidth: function(tile, newWidth, newHeight) {
        var diffNewOldWidth = newWidth - this.tileWidth;
        var diffNewOldHeight = newHeight - this.tileWidth;
        var columns = this.tiles.length;

        var rightEnd = 0;
        var bottomEnd = 0;
        var newRightColumnWidth = this.tileWidth - diffNewOldWidth / (columns - 1);
        var newBottomRowHeight = this.tileWidth - diffNewOldHeight / (this.rows - 1);

        for (var yIt = 0;yIt < this.rows; yIt++) {
            for (var xIt = 0;xIt < columns; xIt++) {
                if (typeof this.tiles[xIt][yIt] != 'undefined') {
                    if (tile.getX() == xIt && tile.getY() == yIt) {
                        tile.element.setStyles({width: newWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                        rightEnd += newWidth;
                    } else if (yIt == tile.getY()) {
                        this.tiles[xIt][yIt].element.setStyles({width: newRightColumnWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                        rightEnd += newRightColumnWidth;

                    } else {
                        this.tiles[xIt][yIt].element.setStyles({height: newBottomRowHeight, top: bottomEnd});
                    }
                }
            }
            if (tile.getY() == yIt) {
                bottomEnd += newHeight;
            } else {
                bottomEnd += newBottomRowHeight;
            }

        }

    },

     actualizeTiles: function() {
        this.tileWidth = this.getTileWidth();
        var top = 0;
        var left = 0;
        var modulo = this.container.getSize().x / this.tileWidth;
        var i = 0;
        var x = 0;
        var y = -1;
        this.tiles = [];
        this.initTilesArray(modulo);
        for (var it = 0; it < this.tileCount; it++) {
            x = it % modulo;
            if (!x) {
                y++;
            }

            var tile = this.tileList[it];
            this.tiles[x][y] = tile;
            tile.setX(x);
            tile.setY(y);

            left =  i * this.tileWidth;
            tile.element.setStyles({width: this.tileWidth, height: this.tileWidth, top: top, left: left});

            if (!((it+1) % modulo)) {
                top += this.tileWidth;
                left = 0;
            }

            i = (it+1) % modulo;

        }
    },

    initTiles: function () {
        this.tileWidth = this.getTileWidth();
        var modulo = this.container.getSize().x / this.tileWidth;
        this.initTilesArray(modulo);
        var top = 0;
        var left = 0;
        var i = 0;
        var x = 0;
        var y = -1;

        for (var it = 0; it < this.tileCount; it++) {
            x = it % modulo;
            if (!x) {
                y++;
            }

            var tile = new window[this.options.tileClass]({
                x: x,
                y: y,
                entry: this.options.entries[it]
            });

            this.tiles[x][y] = tile;
            this.tileList.push(tile);
            left =  i * this.tileWidth;
            tile.element.setStyles({width: this.tileWidth, height: this.tileWidth, top: top, left: left});

            if (!((it+1) % modulo)) {
                top += this.tileWidth;
                left = 0;
            }

            i = (it+1) % modulo;

        }

    },

    getTileWidth: function() {
        var possibleHeight = this.container.getSize().y;
        var possibleWidth = this.container.getSize().x;
        var tileWidth = possibleWidth / this.tileCount;
        var tempTileWidth = tileWidth;

        var tempTileCount = this.tileCount;

        var overlappingTiles = this.tileCount - tempTileCount;
        this.rows = Math.floor(overlappingTiles / tempTileCount) + 1;
        var tempRows = this.rows;
        var calculatedHeight = tileWidth * this.rows;

        while (calculatedHeight < possibleHeight) {
            tileWidth = tempTileWidth;
            this.rows = tempRows;
            tempTileCount--;
            tempTileWidth = possibleWidth / tempTileCount;

            overlappingTiles = this.tileCount - tempTileCount;

            tempRows = Math.ceil(overlappingTiles / tempTileCount) + 1;


            calculatedHeight = tempTileWidth * tempRows;
        }

        return tileWidth;
    },

    initTilesArray: function (columns) {
        for (var i=0; i < columns; i++) {
            this.tiles[i] = [];
        }
    },

    getEntries: function(url, callback) {
        this.getJSONP('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=16&q=' + url + '&callback=?', function(data){
            if (typeof callback == 'function') {
                callback(data);
            }
        });
    },

    destroy: function() {

    },

    getJSONP: function(url, success) {

        var ud = '_' + +new Date,
            script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0]
                || document.documentElement;

        window[ud] = function(data) {
            head.removeChild(script);
            success && success(data);
        };

        script.src = url.replace('callback=?', 'callback=' + ud);
        head.appendChild(script);

    }
});