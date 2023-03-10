const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  const agents = [];
  
  for(let i = 0; i < 40; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x,y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#89CFF0';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
      for (let j = i + 1; j < agents.length; j++){ // start j line on index + 1 to limit calls, save computing power
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos); //helps with lines

        if (dist > 200) continue; // limits the amount of lines

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }
    
    agents.forEach(agent => {
      agent.update();  
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

//create a class and constructor for new points on canvas
class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  getDistance(v){
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy); // pythagoras to calc lines between agents
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1,1), random.range(-1, 1));
    this.radius = random.range(8, 34);
  }
  //restrict animation to canvas

  bounce(width, height){
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }
  //create looped movement
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context){
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 6;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}