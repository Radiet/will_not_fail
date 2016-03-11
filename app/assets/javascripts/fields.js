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
  for(var i = 20; i >= 0; i--) {
    for(var y = 0; y < 20; y++) {
      var which = Crafty.randRange(0,1);
      var tile = Crafty.e("2D, DOM, "+ (!which ? "stone" : "grass") +", Mouse")
      .attr('z',i+1 * y+1).areaMap([64,0],[128,32],[128,96],[64,128],[0,96],[0,32]).bind("click", function(e) {
        //destroy on right click
        if(e.button === 2) this.destroy();
      }).bind("mouseover", function() {
        if(this.has("grass")) {
          this.sprite(0,1,1,1);
        } else {
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

  var man = Crafty.e("2D, DOM, hoodF, Mouse")
  iso.place(0,0.5,2, man);
  man.attr('y', 230).attr('x', 675).attr('z', 10000)
  // man.attr('y', -25).attr('x', 25).attr('z', 15)
  // man.attr('y', -125).attr('x', 90).attr('z', 15) left first
  // man.attr('y', 70).attr('x', 350).attr('z', 15)

  var frontMan = Crafty.e("2D, DOM, hoodF, Mouse")
    .bind("click", function(e) {
        if(e.button === 0){
          moveToFront('front', spriteMan)
          console.log(man)
          man.sprite(7,0,0,1.5);
        }
      })

  iso.place(0,0.5,2, frontMan);
  frontMan.attr('y', man.attr('y')+32).attr('x', man.attr('x')+65).attr('z', 10000)

  var backMan = Crafty.e("2D, DOM, hoodB, Mouse")
    .bind("click", function(e) {
        if(e.button === 0){
          moveToFront('back', spriteMan)
          console.log(man)
          man.sprite(3,0,0,1.5);
        }
      })

  iso.place(0,0.5,2, backMan);
  backMan.attr('y', man.attr('y')-32).attr('x', man.attr('x')-65).attr('z', 10000)

  var leftMan = Crafty.e("2D, DOM, hoodR, Mouse")
    .bind("click", function(e) {
        if(e.button === 0){
          moveToFront('right', spriteMan)
          console.log(man)
          man.sprite(5,0,0,1.5);
        }
      })

  iso.place(0,0.5,2, leftMan);
  leftMan.attr('y', man.attr('y')-32).attr('x', man.attr('x')+65).attr('z', 9000)

  var rightMan = Crafty.e("2D, DOM, hoodL, Mouse")
    .bind("click", function(e) {
        if(e.button === 0){
          moveToFront('left', spriteMan)
          console.log(man)
          man.sprite(1,0,0,1.5);
        }
      })

  iso.place(0,0.5,2, rightMan);
  rightMan.attr('y', man.attr('y')+32).attr('x', man.attr('x')-65).attr('z', 10000)

  var spriteMan = [leftMan, man, frontMan, backMan, rightMan]

  function moveToFront(direction, element){
    switch(direction){
      case 'front':
        incY = 32
        incX = 65
        break
      case 'back':
        incY = -32
        incX = -65
        break
      case 'left':
        incY = 32
        incX = -65
        break
      case 'right':
        incY = -32
        incX = 65
        break
    }

    element.forEach(function(elem, i){
      var y = elem.attr('y') + incY
      var x = elem.attr('x') + incX
      elem.attr('y', y).attr('x', x).attr('z', 10000+ i)
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
