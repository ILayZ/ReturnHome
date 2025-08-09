(function(global){
  function updateJumper(enemy, player, time){
    const detectionRange = enemy.detectionRange || 150;
    if(!enemy.state) enemy.state = 'idle';
    switch(enemy.state){
      case 'idle':
        if(Math.abs(player.x - enemy.x) < detectionRange && enemy.body.onFloor()){
          enemy.state = 'charge';
          enemy.chargeTime = time + 500;
          if(enemy.setVelocityX) enemy.setVelocityX(0);
          if(enemy.setFrame) enemy.setFrame(1);
        }
        break;
      case 'charge':
        if(time > enemy.chargeTime){
          enemy.state = 'jump';
          const direction = player.x < enemy.x ? -1 : 1;
          if(enemy.setVelocityY) enemy.setVelocityY(-350);
          if(enemy.setVelocityX) enemy.setVelocityX(150 * direction);
          if(enemy.setFrame) enemy.setFrame(2);
        }
        break;
      case 'jump':
        if(enemy.body.onFloor()){
          enemy.state = 'recover';
          enemy.recoverTime = time + 500;
          if(enemy.setVelocityX) enemy.setVelocityX(0);
          if(enemy.setFrame) enemy.setFrame(0);
        }
        break;
      case 'recover':
        if(time > enemy.recoverTime){
          enemy.state = 'idle';
        }
        break;
    }
  }

  function resolveCollision(player, enemy){
    if(player.body.touching.down && enemy.body.touching.up){
      if(typeof enemy.onDefeat === 'function') enemy.onDefeat();
      return 'defeat';
    } else {
      if(typeof player.takeDamage === 'function') player.takeDamage();
      return 'damage';
    }
  }

  if(typeof module !== 'undefined' && module.exports){
    module.exports = { updateJumper, resolveCollision };
  } else {
    global.updateJumper = updateJumper;
    global.resolveCollision = resolveCollision;
  }
})(this);
