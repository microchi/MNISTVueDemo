<template>
  <Panel header="手繪即時預測(在下方紅框中手繪數字)" toggleable class="m-1">
    <div class="flex flex-wrap">
      <div class="mx-1">
        <vue-drawing-canvas
          ref="VueCanvasDrawing"
          v-model:image="DrawingImage"
          :width="280"
          :height="280"
          line-join="round"
          :lineWidth="20"
          saveAs="png"
          class="border-pink-400 border-3"
          :outputWidth="28"
          :outputHeight="28"
        /><br />
        <Button label="重設" class="w-full" @click="VueCanvasDrawing.reset()" />
      </div>
      <div class="bg-white w-20rem h-20rem mx-1" ref="PredictChartElement" />
    </div>
  </Panel>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';
  import * as tf from '@tensorflow/tfjs';

  const VueCanvasDrawing = ref(null); // 手繪畫布
  const DrawingImage = ref(null); // 手繪圖片
  const PredictChartElement = ref(null); // 即時預測圖表

  // 即時預測圖表參數
  const PredictChartOption = {
    title: { left: 'center', text: '即時預測結果' },
    grid: { left: '50px', bottom: '30px' },
    xAxis: { type: 'category', data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    yAxis: { type: 'value', name: '機率', min: 0, max: 1, axisLabel: { formatter: (value) => `${value * 100}%` } },
    series: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], type: 'bar', showBackground: true, backgroundStyle: { color: '#EEEEEE' } }],
  };

  let predictChart = null; // 即時預測圖表實例

  // 初始化即時預測圖表
  onMounted(() => {
    predictChart = window.echarts.init(PredictChartElement.value);
    predictChart.setOption(PredictChartOption);
  });

  // 監控手繪圖片變化
  watch(DrawingImage, () => {
    if (window.model === null) return;

    // 若 手繪圖片為空 則 清除即時預測圖表
    if (VueCanvasDrawing.value.isEmpty()) {
      predictChart.setOption({ series: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }] });
      return;
    }

    const myImage = new Image();
    myImage.onload = () => {
      // tf.reshape 將張量塑為 [1, 28, 28, 1] 的四維張量。第一維 1 表示批次大小（batch size），即一次處理一張圖像。28, 28 是圖像的寬度和高度。最後一維 1 表示通道數，這裡是單通道（灰度圖像）。
      // tf.scalar(1).sub 表示用 1 塑造出的張量 1 減掉像素值 是讓圖像反轉 白轉黑 黑轉白
      // tf.browser.fromPixels(img, 1) 將圖像轉換為張量 1 表示灰度圖像
      // .toFloat().div(255) 將圖像值介於 0~255 之間的張量轉換為 0~1 之間的張量
      const result = window.model.predict(tf.reshape(tf.scalar(1).sub(tf.browser.fromPixels(myImage, 1).toFloat().div(255)), [1, 28, 28, 1])).dataSync();

      predictChart.setOption({ series: [{ data: Array.from(result) }] }); // 更新即時預測圖表
    };
    myImage.src = DrawingImage.value;
  });
</script>
