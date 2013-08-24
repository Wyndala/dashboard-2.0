/**
 * Created with JetBrains PhpStorm.
 * User: Ralf Michael
 * Date: 24.08.13
 * Time: 15:54
 * To change this template use File | Settings | File Templates.
 */

var Tileboard = new Class({
    tileCount: 8,
    tiles: [],
    tileList: [],
    container: null,
    margin: 10,

    initialize: function() {
        this.container = $$('.container')[0];
        this.initTiles();
        var tileboard = this;
        $$('.tile').addEvent('click', function() {

            if (this.getStyle('width').toInt() <= Math.ceil(tileboard.tileWidth)) {
                var newWidth = window.getSize().x / 2;
                var newHeight = window.getSize().y / 1.5;

            } else {
                var newWidth = tileboard.tileWidth;
                var newHeight = tileboard.tileWidth;
            }
            tileboard.changeTileWidth(this.retrieve('tileObj'), newWidth, newHeight);
        });

        window.addEvent('resize', function() {
            tileboard.actualizeTiles();
        });
    },

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
                    if (tile.x == xIt && tile.y == yIt) {
                        tile.element.setStyles({width: newWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                        rightEnd += newWidth;
                    } else if (yIt == tile.y) {
                        this.tiles[xIt][yIt].element.setStyles({width: newRightColumnWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                        rightEnd += newRightColumnWidth;

                    } else {
                        this.tiles[xIt][yIt].element.setStyles({height: newBottomRowHeight, top: bottomEnd});
                    }

                    if (this.tiles[xIt][yIt].element.getStyle('width').toInt() > this.tiles[xIt][yIt].element.getStyle('height').toInt()) {
                        this.tiles[xIt][yIt].element.removeClass('hoch');
                        this.tiles[xIt][yIt].element.addClass('quer');
                    } else if (this.tiles[xIt][yIt].element.getStyle('width').toInt() < this.tiles[xIt][yIt].element.getStyle('height').toInt()){
                        this.tiles[xIt][yIt].element.removeClass('quer');
                        this.tiles[xIt][yIt].element.addClass('hoch');
                    } else {
                        this.tiles[xIt][yIt].element.removeClass('quer');
                        this.tiles[xIt][yIt].element.addClass('hoch');
                    }
                }
            }
            if (tile.y == yIt) {
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
            tile.x = x;
            tile.y = y;

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


            var tile = new Tile(x, y);
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
            console.log(calculatedHeight < possibleHeight);
            console.log(calculatedHeight);
            console.log(tempTileWidth);
            console.log(overlappingTiles + ' / ' + tempTileCount);
            console.log(this.rows);
        }

        return tileWidth;
    },

    initTilesArray: function (columns) {
        for (var i=0; i < columns; i++) {
            this.tiles[i] = [];
        }
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