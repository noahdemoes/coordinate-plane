<template>
  <div class="graph-board">
    <div id="equation-display" v-if="var1 !== null && var2 !== null">Click two points on the coordinate plane to graph the equation y = {{ var1 }}x + {{ var2 }}.</div>
    <canvas ref="canvas" @click="handleClick" width="500" height="500"></canvas>
  </div>
  <div>
    <button @click="submit">Submit</button>
    <button @click="reset">Reset</button>
    <button @click="selectRandomVariables">New Equation</button>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<style scoped>


#equation-display {
font-size: 16px;
font-weight: bold;
text-align: center;
margin-bottom: 10px;
}
.graph-board button {
margin: 10px;
}

.graph-board canvas {
  border: none;
}
</style>



<script>
  export default {
  data() {
      return {
      points: [],
      maxPoints: 2,
      slope: null,
      yIntercept: null,
      var1: null, // Slope from the equation
      var2: null, // Y-intercept from the equation
      message: '',
      };
  },
  mounted() {
      this.selectRandomVariables();
      this.drawGraph();
  },
methods: {
  selectRandomVariables() {
    do {
      this.var1 = Math.floor(Math.random() * 11) - 5;
    } while (this.var1 === 0);
    this.var2 = Math.floor(Math.random() * 11) - 5;
  },
  drawGraph() {
    const ctx = this.$refs.canvas.getContext('2d');
    const numPoints = 21;
    const step = this.$refs.canvas.width / (numPoints - 1);
    ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      // Draw grid and labels
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < numPoints; i++) {
        const pos = step * i;
        const label = i - 10; // Shift index to get labels from -10 to 10

        // Draw vertical grid lines
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, this.$refs.canvas.height);
        ctx.strokeStyle = '#ddd';
        ctx.stroke();

        // Draw horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(this.$refs.canvas.width, pos);
        ctx.stroke();

        // Labels
        if (label !== 0) { // Avoid drawing over origin labels
          ctx.fillText(label, pos, this.$refs.canvas.height / 2 + 15);
          ctx.fillText(-label, this.$refs.canvas.width / 2 - 15, pos);
        }
      }

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(this.$refs.canvas.width / 2, 0);
      ctx.lineTo(this.$refs.canvas.width / 2, this.$refs.canvas.height);
      ctx.moveTo(0, this.$refs.canvas.height / 2);
      ctx.lineTo(this.$refs.canvas.width, this.$refs.canvas.height / 2);
      ctx.strokeStyle = '#000';
      ctx.stroke();

      // Redraw lines between points, labels, and equations if any
      this.drawLines();
      this.labelPoints();
      this.displayEquation();
    },
    handleClick(event) {
      if (this.points.length >= this.maxPoints) {
        this.points = []; // Reset if two points were already selected
        this.slope = null;
        this.yIntercept = null;
      }

      const rect = this.$refs.canvas.getBoundingClientRect();
      const numPoints = 21; // From -10 to 10 inclusive
      const step = this.$refs.canvas.width / (numPoints - 1);
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const graphX = Math.round((x / step) - 10);
      const graphY = Math.round(-(y / step) + 10);

      this.points.push({ x: graphX, y: graphY });

      if (this.points.length === this.maxPoints) {
        this.calculateSlopeAndIntercept();
        this.drawLines();
      }

      this.drawGraph(); // Redraw the graph to update the view
    },

    submit() {
    if (this.points.length === this.maxPoints) {
      this.calculateSlopeAndIntercept();
      if (this.slope === this.var1 && this.yIntercept === this.var2) {
        this.message = 'Correct! Great job.';
      } else {
        this.message = "Incorrect, let's try again.";
      }
    } else {
      this.message = 'Please select exactly two points.';
    }
  },
  reset() {
    this.points = [];
    this.slope = null;
    this.yIntercept = null;
    this.message = '';
    this.drawGraph();
  },
    calculateSlopeAndIntercept() {
      const [p1, p2] = this.points;
      if (p1.x !== p2.x) {
        this.slope = (p2.y - p1.y) / (p2.x - p1.x);
        this.yIntercept = p1.y - this.slope * p1.x;
      } else {
        this.slope = Infinity; // Slope of a vertical line is undefined
        this.yIntercept = null;
      }
    },
    drawLines() {
  if (this.points.length < 2 || this.slope === null) return;

  const ctx = this.$refs.canvas.getContext('2d');
  const canvasWidth = this.$refs.canvas.width;
  const canvasHeight = this.$refs.canvas.height;
  const numPoints = 21; // From -10 to 10 inclusive
  const step = canvasWidth / (numPoints - 1);

  // Calculate start and end points of the line on the canvas
  const xStart = -10; // Start from leftmost point on the canvas
  const xEnd = 10;   // End at the rightmost point on the canvas
  const yStart = this.slope * xStart + this.yIntercept;
  const yEnd = this.slope * xEnd + this.yIntercept;

  // Convert these points to canvas coordinates
  const canvasXStart = (xStart + 10) * step;
  const canvasYStart = canvasHeight - (yStart + 10) * step;
  const canvasXEnd = (xEnd + 10) * step;
  const canvasYEnd = canvasHeight - (yEnd + 10) * step;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(canvasXStart, canvasYStart);
  ctx.lineTo(canvasXEnd, canvasYEnd);
  ctx.strokeStyle = 'blue'; // Change the line color to blue
  ctx.lineWidth = 2; // Optional: Set the line width
  ctx.stroke();
}
,
    labelPoints() {
      const numPoints = 21; // From -10 to 10 inclusive
      const step = this.$refs.canvas.width / (numPoints - 1);
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.font = "12px Arial";
      this.points.forEach((point, index) => {
        const canvasX = (point.x + 10) * step;
        const canvasY = (10 - point.y) * step;
        ctx.fillText(`Point ${index + 1}: (${point.x}, ${point.y})`, canvasX, canvasY - 10);
      });
    },
    displayEquation() {
    if (this.var1 !== null && this.var2 !== null) {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.font = "14px Arial";
    }
  }
}
}
</script>

