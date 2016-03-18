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
  Crafty.sprite(90, "hood_ene.png", {
    hoodEneF: [7,0,0,1.5],
    hoodEneB: [3,0,0,1.5],
    hoodEneL: [1,0,0,1.5],
    hoodEneR: [5,0,0,1.5]
  });

  iso = Crafty.isometric.init(128);

  var z = 0;
  var charSelected = false
  var currentChar
  var pretentTpMove = false
  var borderedField = []
  var fields = []

  for(var i = 12; i >= 0; i--) {
    for(var y = 0; y < 30; y++) {

      var which = Crafty.randRange(0,1);

      if ((i==0 || i==12) && which) { continue; }

      var tile = Crafty.e("2D, DOM, "+ (!which ? "grass" : "grass") +", Mouse")
        .attr('z',i+1 * y+1)
        .areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32])
        .bind("click", function(e) {
          tileClick(e, this)
        })
        .bind("mouseover", function() {
          // addBorder(this)
        })
        .bind("mouseout", function() {
          // removeBorder(this)
        });

      iso.place(i,y,0, tile);
      tile.pretentTpMove = false

      if(fields[tile.attr('y')] == undefined) { fields[tile.attr('y')] = [] }
      fields[tile.attr('y')][tile.attr('x')] = tile
    }
  }

  var man0   = Crafty.e("2D, DOM, hoodR, Mouse")
              .bind("click", function(e){ charClick(e, this) })
  var man1   = Crafty.e("2D, DOM, hoodR, Mouse")
              .bind("click", function(e){ charClick(e, this) })

  var ene0  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })
  var ene1  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })
  var ene2  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })

  man0.attr('y', 774).attr('x', 227).attr('z', 100+774)
  man1.attr('y', 710).attr('x', 227).attr('z', 100+710)

  ene0.attr('y', 6).attr('x', 1379).attr('z', 100+6)
  ene1.attr('y', 6).attr('x', 1251).attr('z', 100+6)
  ene2.attr('y', 134).attr('x', 1379).attr('z', 100+134)

  function moveTo(direction, element){
    var y   = element.attr('y')
    var x   = element.attr('x')
    var pos = getPosition(direction, y, x)

    changeSpriteDirection(direction, element)

    element.attr('y', pos['y']).attr('x', pos['x']).attr('z', 10000)
  }

  function getDirection(y, x) {
      var fromY = currentChar.attr('y') + 90
      var fromX = currentChar.attr('x') - 35

      while(true){
        if (fromY>y && fromX<x) moveTo('right', currentChar)
        else if (fromY<y && fromX>x) moveTo('left', currentChar)
        else if (fromY>y && fromX>x) moveTo('back', currentChar)
        else if (fromY==y && fromX>x)  moveTo('back', currentChar)
        else if (fromY>y && fromX==x)  moveTo('back', currentChar)
        else if (fromY==y && fromX==x) break
        else moveTo('front', currentChar)
        fromY = currentChar.attr('y') + 90
        fromX = currentChar.attr('x') - 35
      }

  }

  function changeSpriteDirection (direction, element) {
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

  function showBorderRange (cur_y, cur_x){
    dir = [['front', 2], ['back', 2], ['left', 2], ['right', 2],
          ['kananbawah', 1], ['kiribawah', 1], ['kananatas', 1], ['kiriatas', 1]]

    for (var i = 0; i < dir.length ; i++) {
      addBorderRange(dir[i], cur_y, cur_x)
    };

  }

  function addBorderRange (e, cur_y, cur_x) {
      var y = cur_y
      var x = cur_x

      for( var i =0; i<e[1]; i++){

        var pos = getPosition(e[0], y, x)
        if(fields[pos['y']] === undefined || fields[pos['y']][pos['x']] === undefined) { continue; }

        var field = fields[pos['y']][pos['x']]
        addBorder(field, 'move')
        borderedField.push(field)

        y = pos['y']
        x = pos['x']
      }
    }


    function addBorder (tile, move){

      if (tile === undefined) { return; }

      if (tile.has("grass")) {
        tile.sprite(0,1,1,1);
      } else {
        tile.sprite(1,1,1,1);
      }

      if (move != undefined) {
        tile.pretentTpMove=true
      }

    }

    function removeBorder (tile, move){

      if (tile === undefined) { return; }

      if (move != undefined) {
        tile.pretentTpMove=false
      }

      if (tile.pretentTpMove != true){
        if (tile.has("grass")) {
          tile.sprite(0,0,1,1);
        } else {
          tile.sprite(1,0,1,1);
        }
      }

    }

    function cleanBorder () {
      borderedField.forEach(function(e){
        removeBorder(e, 'move')
      })
    }

    function cancelBorder () {
      borderedField.forEach(function(e){
        removeBorder(e)
      })
    }

    function getBorderSight (element) {
      var cur_x = element.attr('x') - 35
      var cur_y = element.attr('y') + 90

      cleanBorder
      showBorderRange(cur_y, cur_x)
    }

    function charClick (event, element) {
      if(event.button === 0){

        charSelected  = true
        currentChar   = element
        console.log(element.attr('y'), element.attr('x'))

        getBorderSight(element)
      }
    }

    function tileClick (e, element) {
      if (e.button === 0) {
        addBorder(element)
        console.log(element.attr('y'), element.attr('x'), element.attr('z'))
        if (charSelected) {
          if (element.pretentTpMove == true) {
            getDirection(element.attr('y'), element.attr('x'))
          } else {
            charSelected = false
          }
          cleanBorder()
        }
      }else{
        removeBorder(element)
      }
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
