<template>
  <div class="graph-board">
    <div id="equation-display" v-if="var1 !== null && var2 !== null">Click two points on the coordinate plane to graph the equation y = {{ var1 }}x + {{ var2 }}.</div>
    <canvas ref="canvas" @click="handleClick" width="500" height="500"></canvas>
  </div>
  <div>
    <button @click="submit">Submit</button>
    <button @click="reset">Reset</button>
    <button @click="updateVariables">New Equation</button>
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
import { selectRandomVariables,labelPoints, drawLines, calculateSlopeAndIntercept } from '../utils/plot.js';
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
      slope_abs_val: 5,
      y_intercept_abs_val: 5,
      x_abs_val: 10,
      y_abs_val: 10,
      canvasWidth: 500,
      canvasHeight: 500
      };
  },
  mounted() {
    const { var1, var2 } = selectRandomVariables(this.slope_abs_val, this.y_intercept_abs_val);
    this.var1 = var1;
    this.var2 = var2;
    this.drawGraph();
    drawLines(this.x_abs_val,this.y_abs_val,this.points,this.canvasWidth,this.canvasHeight,this.$refs.canvas.getContext('2d'), this.slope, this.yIntercept);
  },
methods: {
  drawGraph() {
    const ctx = this.$refs.canvas.getContext('2d');
    const numPoints = this.x_abs_val +this.y_abs_val + 1;
    const step = this.$refs.canvas.width / (numPoints - 1);
    ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      // Draw grid and labels
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < numPoints; i++) {
        const pos = step * i;
        const label = i - this.x_abs_val; // Shift index to get labels from -10 to 10

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
      drawLines(this.x_abs_val,this.y_abs_val,this.points,this.canvasWidth,this.canvasHeight,this.$refs.canvas.getContext('2d'), this.slope, this.yIntercept);
      labelPoints(this.x_abs_val,this.y_abs_val,this.points,this.canvasWidth,this.$refs.canvas.getContext('2d'));
    },
    handleClick(event) {
      if (this.points.length >= this.maxPoints) {
        this.points = []; // Reset if two points were already selected
        this.slope = null;
        this.yIntercept = null;
      }

      const rect = this.$refs.canvas.getBoundingClientRect();
      const numPoints = Math.abs(this.x_abs_val)*2+1; // From -10 to 10 inclusive
      const step = this.$refs.canvas.width / (numPoints - 1);
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const graphX = Math.round((x / step) - Math.abs(this.x_abs_val));
      const graphY = Math.round(-(y / step) + Math.abs(this.y_abs_val));

      this.points.push({ x: graphX, y: graphY });

      if (this.points.length === this.maxPoints) {
        const { slope, yIntercept } = calculateSlopeAndIntercept(this.points);
        this.slope = slope;
        this.yIntercept = yIntercept;
        drawLines(this.x_abs_val,this.y_abs_val,this.points,this.canvasWidth,this.canvasHeight,this.$refs.canvas.getContext('2d'), this.slope, this.yIntercept);
      }

      this.drawGraph(); // Redraw the graph to update the view
    },

    submit() {
    if (this.points.length === this.maxPoints) {
      const { slope, yIntercept } = calculateSlopeAndIntercept(this.points);
      this.slope = slope;
      this.yIntercept = yIntercept;
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
  updateVariables() {
    const { var1, var2 } = selectRandomVariables(this.slope_abs_val, this.y_intercept_abs_val);
    this.var1 = var1;
    this.var2 = var2;
    this.reset();
    //displayEquation(this.var1, this.var2, this.canvasWidth,this.$refs.canvas.getContext('2d'));
  },

  }
}
</script>

