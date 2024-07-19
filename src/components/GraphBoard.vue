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
import { selectRandomVariables, drawLines, calculateSlopeAndIntercept, check_answer, drawGraph } from '../utils/plot.js';
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
    drawGraph(this.x_abs_val,this.y_abs_val,this.points,this.slope, this.yIntercept,this.$refs.canvas.width, this.$refs.canvas.height, this.$refs.canvas.getContext('2d'));
    drawLines(this.x_abs_val,this.y_abs_val,this.points,this.canvasWidth,this.canvasHeight,this.$refs.canvas.getContext('2d'), this.slope, this.yIntercept);
  },
methods: {
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

      drawGraph(this.x_abs_val,this.y_abs_val,this.points,this.slope, this.yIntercept,this.$refs.canvas.width, this.$refs.canvas.height, this.$refs.canvas.getContext('2d'));
    },

    submit() {this.message = check_answer(this.points,this.maxPoints,this.slope,this.var1,this.yIntercept,this.var2);
      console.log(this.message);
    },
  reset() {
    this.points = [];
    this.slope = null;
    this.yIntercept = null;
    this.message = '';
    drawGraph(this.x_abs_val,this.y_abs_val,this.points,this.slope, this.yIntercept,this.$refs.canvas.width, this.$refs.canvas.height, this.$refs.canvas.getContext('2d'));
  },
  updateVariables() {
    const { var1, var2 } = selectRandomVariables(this.slope_abs_val, this.y_intercept_abs_val);
    this.var1 = var1;
    this.var2 = var2;
    this.reset();
  },

  }
}
</script>

