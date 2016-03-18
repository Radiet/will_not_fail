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
  Crafty.sprite(90, "hood_end.png", {
    hoodEndF: [7,0,0,1.5],
    hoodEndB: [3,0,0,1.5],
    hoodEndL: [1,0,0,1.5],
    hoodEndR: [5,0,0,1.5]
  });

  iso = Crafty.isometric.init(128);

  var z = 0;
  var charSelected = false
  window.currentChar
  var pretentTpMove = false
  var borderedField = []
  var fields = []
  var contestant = ['player', 'enemy']
  var base = {
    player: {},
    enemy: {},
    turn: contestant[0]
  }

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
          addBorder(this)
        })
        .bind("mouseout", function() {
          removeBorder(this)
        });

      iso.place(i,y,0, tile);
      tile.pretentTpMove = false

      if(fields[tile.attr('y')] == undefined) { fields[tile.attr('y')] = [] }
      fields[tile.attr('y')][tile.attr('x')] = tile
    }
  }

  window.man0   = Crafty.e("2D, DOM, hoodR, Mouse")
              .bind("click", function(e){ charClick(e, this) })

  var man1   = Crafty.e("2D, DOM, hoodR, Mouse")
              .bind("click", function(e){ charClick(e, this) })

  var ene0  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })
  var ene1  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })
  var ene2  = Crafty.e("2D, DOM, hoodEneL, Mouse")
              .bind("click", function(e){ charClick(e, this) })

  man0.legion = contestant[0]
  man1.legion = contestant[0]
  ene0.legion = contestant[1]
  ene1.legion = contestant[1]
  ene2.legion = contestant[1]

  man0.played = false
  man1.played = false
  ene0.played = false
  ene1.played = false
  ene2.played = false

  man0.lastDirection = false
  man1.lastDirection = false
  ene0.lastDirection = false
  ene1.lastDirection = false
  ene2.lastDirection = false

  man0.attr('y', 774).attr('x', 227).attr('z', 100+774)
  man1.attr('y', 710).attr('x', 227).attr('z', 100+710)

  ene0.attr('y', 6).attr('x', 1379).attr('z', 100+6)
  ene1.attr('y', 6).attr('x', 1251).attr('z', 100+6)
  ene2.attr('y', 134).attr('x', 1379).attr('z', 100+134)


  base.player = {
    units: [man0, man1],
    image: 'hood.png'
  }

  base.enemy = {
    units: [ene0, ene1, ene2],
    image: 'hood_ene.png'
  }


  function moveTo(direction, element){
    var y   = element.attr('y')
    var x   = element.attr('x')
    var pos = getPosition(direction, y, x)
    var canMove   = true;
    currentField  = fields[pos['y']+90][pos['x']-35]
    if (currentField.pretentTpMove == false) { canMove = false }
    changeSpriteDirection(direction, element)

    element.attr('y', pos['y']).attr('x', pos['x']).attr('z', 100+pos['y'] )
    currentChar.lastDirection = direction

    return canMove
  }

  function getDirection(y, x) {
      var fromY = currentChar.attr('y') + 90
      var fromX = currentChar.attr('x') - 35
      var canMove = true
      while(canMove){
        if (fromY>y && fromX<x) canMove = moveTo('right', currentChar)
        else if (fromY<y && fromX>x) canMove = moveTo('left', currentChar)
        else if (fromY>y && fromX>x) canMove = moveTo('back', currentChar)
        else if (fromY==y && fromX>x)  canMove = moveTo('back', currentChar)
        else if (fromY>y && fromX==x)  canMove = moveTo('back', currentChar)
        else if (fromY==y && fromX==x) break
        else canMove = moveTo('front', currentChar)
        fromY = currentChar.attr('y') + 90
        fromX = currentChar.attr('x') - 35
      }

    currentChar.played = true
    currentChar.__image = "hood_end.png";
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
        cleanBorder()

        getBorderSight(element)
      }
    }

    function tileClick (e, element) {
      if (e.button === 0) {
        console.log(element.attr('y'), element.attr('x'), element.attr('z'))

        if (!charSelected ) { return; }
        if (currentChar.legion!='player' || currentChar.played || currentChar.legion!=base.turn) {
          cleanBorder()
          return;
        }

        if (element.pretentTpMove == true) {
          getDirection(element.attr('y'), element.attr('x'))

          var availableMove = checkForEndTurn()
          if (!availableMove) {
            changeTurn()
          }

        } else {
          charSelected = false
        }
        cleanBorder()
      }

    }

    function checkForEndTurn () {
      var currentTurn   = base.turn;
      var availableMove = false;

      base[currentTurn].units.forEach(function(e){
        if (e.played == false) { availableMove=true }
      })

      return availableMove;
    }

    function whiteListUnits () {
      base[base.turn].units.forEach(function(unit){
        unit.__image = base[base.turn].image;
        unit.played  = false;
        changeSpriteDirection(unit.lastDirection, unit)
      })
    }

    function changeTurn () {

      whiteListUnits()
      nextContestant  = contestant.indexOf(base.turn) + 1
      if (contestant[nextContestant] == undefined)
        nextContestant = 0
      base.turn       = contestant[nextContestant]
      if (base.turn != 'player')
        enemyMove()
    }

    function enemyMove () {
      console.log('move')
      var currentTurn = base.turn
      var target    = base.player.units[0];
      var target_y  = target.attr('y') + 90
      var target_x  = target.attr('x') - 35

      base[currentTurn].units.forEach(function(unit){
        currentChar = unit
        getDirection(target_y, target_x)
      })

      var availableMove = checkForEndTurn()
      if (!availableMove) {
        changeTurn()
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
