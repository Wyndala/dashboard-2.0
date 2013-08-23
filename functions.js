/**
 * Created with JetBrains PhpStorm.
 * User: michael
 * Date: 21.08.13
 * Time: 16:31
 * To change this template use File | Settings | File Templates.
 */
window.addEvent('domready', function() {
    tileCount = 16;
    tiles = [];
    tileList = [];
    container = $$('.container')[0];
    margin = 10;
    initTiles();
    $$('.tile').addEvent('click', function() {

        if (this.getStyle('width').toInt() <= Math.ceil(tileWidth)) {
            var newWidth = tileWidth * 2.5;
            var newHeight = tileWidth * 2.5;

        } else {
            var newWidth = tileWidth;
            var newHeight = tileWidth;
        }
        changeTileWidth(this.retrieve('tileObj'), newWidth, newHeight);
    });
/*
    $$('.tile').addEvent('mouseover', function() {

        if (this.getStyle('width').toInt() <= Math.ceil(tileWidth)) {
            var newWidth = tileWidth * 2.5;
            var newHeight = tileWidth * 2.5;

        } else {
            var newWidth = tileWidth;
            var newHeight = tileWidth;
        }
        changeTileWidth(this.retrieve('tileObj'), newWidth, newHeight);
    });*/

});

window.addEvent('resize', function() {
    actualizeTiles();
});

function changeTileWidth(tile, newWidth, newHeight) {
    var diffNewOldWidth = newWidth - tileWidth;
    var diffNewOldHeight = newHeight - tileWidth;
    var columns = tiles.length;

    var rightEnd = 0;
    var bottomEnd = 0;
    var newRightColumnWidth = tileWidth - diffNewOldWidth / (columns - 1);
    var newBottomRowHeight = tileWidth - diffNewOldHeight / (rows - 1);

    for (var yIt = 0;yIt < rows; yIt++) {
        for (var xIt = 0;xIt < columns; xIt++) {
            if (typeof tiles[xIt][yIt] != 'undefined') {
                if (tile.x == xIt && tile.y == yIt) {
                    tile.element.setStyles({width: newWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                    rightEnd += newWidth;
                } else if (yIt == tile.y) {
                    tiles[xIt][yIt].element.setStyles({width: newRightColumnWidth, height: newHeight, left: rightEnd, top: bottomEnd});
                    rightEnd += newRightColumnWidth;

                } else {
                    tiles[xIt][yIt].element.setStyles({height: newBottomRowHeight, top: bottomEnd});
                }

                if (tiles[xIt][yIt].element.getStyle('width').toInt() > tiles[xIt][yIt].element.getStyle('height').toInt()) {
                    tiles[xIt][yIt].element.removeClass('hoch');
                    tiles[xIt][yIt].element.addClass('quer');
                } else if (tiles[xIt][yIt].element.getStyle('width').toInt() < tiles[xIt][yIt].element.getStyle('height').toInt()){
                    tiles[xIt][yIt].element.removeClass('quer');
                    tiles[xIt][yIt].element.addClass('hoch');
                } else {
                    tiles[xIt][yIt].element.removeClass('quer');
                    tiles[xIt][yIt].element.addClass('hoch');
                }
            }
        }
        if (tile.y == yIt) {
            bottomEnd += newHeight;
        } else {
            bottomEnd += newBottomRowHeight;
        }

    }

}

function actualizeTiles() {
    tileWidth = getTileWidth();
    var top = 0;
    var left = 0;
    var modulo = container.getSize().x / tileWidth;
    var i = 0;
    var x = 0;
    var y = -1;
    tiles = [];
    initTilesArray(modulo);
    for (var it = 0; it < tileCount; it++) {
        x = it % modulo;
        if (!x) {
            y++;
        }


        var tile = tileList[it];
        tiles[x][y] = tile;
        tileList.push(tile);
        left =  i * tileWidth;
        tile.element.setStyles({width: tileWidth, height: tileWidth, top: top, left: left});

        if (!((it+1) % modulo)) {
            top += tileWidth;
            left = 0;
        }

        i = (it+1) % modulo;

    }
}

function initTiles() {
    tileWidth = getTileWidth();
    var modulo = container.getSize().x / tileWidth;
    initTilesArray(modulo);
    var top = 0;
    var left = 0;
    var i = 0;
    var x = 0;
    var y = -1;

    for (var it = 0; it < tileCount; it++) {
        x = it % modulo;
        if (!x) {
            y++;
        }


        var tile = new Tile(x, y);
        tiles[x][y] = tile;
        tileList.push(tile);
        left =  i * tileWidth;
        tile.element.setStyles({width: tileWidth, height: tileWidth, top: top, left: left});

        if (!((it+1) % modulo)) {
            top += tileWidth;
            left = 0;
        }

        i = (it+1) % modulo;

    }

    $$('.tile').each(function(tile, index) {



    });
}

function getTileWidth() {
    var possibleHeight = container.getSize().y;
    var possibleWidth = container.getSize().x;
    var tileWidth = possibleWidth / tileCount;
    var tempTileWidth = tileWidth;

    var tempTileCount = tileCount;

    var overlappingTiles = tileCount - tempTileCount;
    rows = Math.floor(overlappingTiles / tempTileCount) + 1;
    var tempRows = rows;
    var calculatedHeight = tileWidth * rows;

    while (calculatedHeight < possibleHeight) {
        tileWidth = tempTileWidth;
        rows = tempRows;
        tempTileCount--;
        tempTileWidth = possibleWidth / tempTileCount;

        overlappingTiles = tileCount - tempTileCount;

        tempRows = Math.ceil(overlappingTiles / tempTileCount) + 1;


        calculatedHeight = tempTileWidth * tempRows;
        console.log(calculatedHeight < possibleHeight);
        console.log(tempTileWidth);
        console.log(overlappingTiles + ' / ' + tempTileCount);
        console.log(rows);
    }

    return tileWidth;
}

function initTilesArray(columns) {
    for (var i=0; i < columns; i++) {
        tiles[i] = [];
    }
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}