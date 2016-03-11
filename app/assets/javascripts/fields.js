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

  for(var i = 20; i >= 0; i--) {
    for(var y = 0; y < 20; y++) {
      var which = Crafty.randRange(0,1);
      var tile = Crafty.e("2D, DOM, "+ (!which ? "stone" : "grass") +", Mouse")
      .attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("click", function(e) {
        //destroy on right click
        if(e.button === 0){
          if(charSelected){
            getDirection(this.attr('y'), this.attr('x'))
          }
        }
      }).bind("mouseover", function() {
        if(this.has("grass")) {
          console.log(this.attr('y'), this.attr('x'))
          this.sprite(0,1,1,1);
        } else {
          console.log(this.attr('y'), this.attr('x'))
          this.sprite(1,1,1,1);
        }
      }).bind("mouseout", function() {
        if(this.has("grass")) {
          this.sprite(0,0,1,1);
        } else {
          this.sprite(1,0,1,1);
        }
      });

      iso.place(i,y,0, tile);
    }
  }

  window.man = Crafty.e("2D, DOM, hoodF, Mouse")
              .bind("click", function(e) {
                if(e.button === 0){
                  charSelected = true
                  currentChar = this
                  console.log(this.attr('y'), this.attr('x'))
                }
              })
              .bind("mouseover", function() {
                  console.log(this.attr('y'), this.attr('x'))
              })
  var man2 = Crafty.e("2D, DOM, hoodF, Mouse")
              .bind("click", function(e) {
                if(e.button === 0){
                  charSelected = true
                  currentChar = this
                  console.log(this.attr('y'), this.attr('x'))
                }
              })
  iso.place(0,0.5,2, man);
  man.attr('y', 230).attr('x', 675).attr('z', 10000)
  man2.attr('y', 134).attr('x', 742).attr('z', 10000)

  function moveTo(direction, element){
    switch(direction){
      case 'front':
        incY = 32
        incX = 64
        element.sprite(7,0,0,1.5);
        break
      case 'back':
        incY = -32
        incX = -64
        element.sprite(3,0,0,1.5);
        break
      case 'left':
        incY = 32
        element.sprite(1,0,0,1.5);
        incX = -64
        break
      case 'right':
        incY = -32
        element.sprite(5,0,0,1.5);
        incX = 65
        break
    }

    var y = element.attr('y') + incY
    var x = element.attr('x') + incX
    element.attr('y', y).attr('x', x).attr('z', 10000+ i)
  }

  function getDirection(y, x) {
    window.fromY = currentChar.attr('y') + 90
    window.fromX = currentChar.attr('x') - 35
    if(fromY>y && fromX<x) moveTo('right', currentChar)
    else if(fromY<y && fromX>x) moveTo('left', currentChar)
    else if(fromY>y && fromX>x) moveTo('back', currentChar)
    else moveTo('front', currentChar)
    // 352 704
    // 320 640
    // 230 675
    // 90  35
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
