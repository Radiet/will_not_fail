$(document).ready(function() {
  Crafty.init();
  Crafty.sprite(128, "sprite.png", {
    grass: [0,0,1,1],
    stone: [1,0,1,1]
  });
  Crafty.sprite(90, "hood.png", {
    hoodF: [7,0,0,1.5],
    hoodB: [3,0,0,1.5],
    hoodL: [1,0,0,1.5],
    hoodR: [5,0,0,1.5]
  });

  iso = Crafty.isometric.init(128);

  var z = 0;
  var charSelected = false
  var currentChar
  var pretentTpMove = false
  window.borderedField = []
  window.fields = []

  for(var i = 20; i >= 0; i--) {
    for(var y = 0; y < 20; y++) {
      var which = Crafty.randRange(0,1);
      var tile = Crafty.e("2D, DOM, "+ (!which ? "grass" : "grass") +", Mouse")
      .attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("click", function(e) {
        //destroy on right click
        if(e.button === 0){
          console.log(this.attr('y'), this.attr('x'), this.attr('z'))
          if(charSelected){
            console.log('a')
            if(this.pretentTpMove == true){
              getDirection(this.attr('y'), this.attr('x'))
            }else{
              charSelected = false
            }
            borderedField.forEach(function(e){
              removeBorder(e, 'move')
            })
            // charSelected = false;
          }
        }
      }).bind("mouseover", function() {
        addBorder(this)
      }).bind("mouseout", function() {
        removeBorder(this)
      });
      iso.place(i,y,0, tile);
      if(fields[tile.attr('y')] == undefined)
        fields[tile.attr('y')] = []
      fields[tile.attr('y')][tile.attr('x')] = tile
      tile.pretentTpMove = false
    }
  }

  function addBorder (tile, move){
    if(tile.has("grass")) {
      tile.sprite(0,1,1,1);
    } else {
      tile.sprite(1,1,1,1);
    }
    if (move != undefined) {
      tile.pretentTpMove=true
    }
  }
  function removeBorder (tile, move){

    if (move != undefined) {
      tile.pretentTpMove=false
    }
    if(tile.pretentTpMove != true){
      if(tile.has("grass")) {
        tile.sprite(0,0,1,1);
      } else {
        tile.sprite(1,0,1,1);
      }
    }
  }

  window.man = Crafty.e("2D, DOM, hoodF, Mouse")
              .bind("click", function(e) {
                if(e.button === 0){
                  charSelected = true
                  currentChar = this
                  var cur_x = this.attr('x') - 35
                  var cur_y = this.attr('y') + 90
                  borderRange(cur_y, cur_x)
                  console.log(this.attr('y'), this.attr('x'))
                }
              })

  var man2 = Crafty.e("2D, DOM, hoodF, Mouse")
              .bind("click", function(e) {
                if(e.button === 0){
                  charSelected = true
                  currentChar = this
                  var cur_x = this.attr('x') - 35
                  var cur_y = this.attr('y') + 90
                  borderRange(cur_y, cur_x)
                  console.log(this.attr('y'), this.attr('x'))
                }
              })
  iso.place(0,0.5,2, man);
  man.attr('y', 230).attr('x', 675).attr('z', 10000)
  man2.attr('y', 134).attr('x', 739).attr('z', 10000)

  function moveTo(direction, element){
    var y = element.attr('y')
    var x = element.attr('x')
    pos = getPosition(direction, y, x)

    switch(direction){
      case 'front':
        element.sprite(7,0,0,1.5);
        break
      case 'back':
        element.sprite(3,0,0,1.5);
        break
      case 'left':
        element.sprite(1,0,0,1.5);
        break
      case 'right':
        element.sprite(5,0,0,1.5);
        break
    }
    element.attr('y', pos['y']).attr('x', pos['x']).attr('z', 10000+ i)
  }

  function getDirection(y, x) {
      var fromY = currentChar.attr('y') + 90
      var fromX = currentChar.attr('x') - 35
      while(true){
        if(fromY>y && fromX<x) moveTo('right', currentChar)
        else if(fromY<y && fromX>x) moveTo('left', currentChar)
        else if(fromY>y && fromX>x) moveTo('back', currentChar)
        else if(fromY==y && fromX>x)  moveTo('back', currentChar)
        else if(fromY>y && fromX==x)  moveTo('back', currentChar)
        else if(fromY==y && fromX==x) break
        else moveTo('front', currentChar)
        fromY = currentChar.attr('y') + 90
        fromX = currentChar.attr('x') - 35
      }
  }

  function getPosition(direction, y, x){
    switch(direction){
      case 'front':
        incY = 32
        incX = 64
        break
      case 'back':
        incY = -32
        incX = -64
        break
      case 'left':
        incY = 32
        incX = -64
        break
      case 'right':
        incY = -32
        incX = 64
        break
      case 'kananbawah':
        incY = 0
        incX = -128
        break
      case 'kiribawah':
        incY = -64
        incX = 0
        break
      case 'kananatas':
        incY = 64
        incX = 0
        break
      case 'kiriatas':
        incY = 0
        incX = 128
        break
    }
    var y = y + incY
    var x = x + incX
    return {'y': y, 'x': x}
  }

  function borderRange (cur_y, cur_x){
    dir = [['front', 2], ['back', 2], ['left', 2], ['right', 2], ['kananbawah', 1], ['kiribawah', 1], ['kananatas', 1], ['kiriatas', 1]]

    dir.forEach(function(e){
      y = cur_y
      x = cur_x

      for( var i =0; i<e[1]; i++){
        pos =getPosition(e[0], y, x)
        field = fields[pos['y']][pos['x']]
        borderedField.push(field)
        addBorder(field, 'move')
        y = pos['y']
        x = pos['x']
      }
    })

  }
  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    if(e.button > 1) return;
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
        dy = base.y - e.clientY;
        base = {x: e.clientX, y: e.clientY};
      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
  });
});
