<template>
  <Panel header="圖表" toggleable class="m-1">
    <div class="flex flex-wrap">
      <div class="w-12 xl:w-6 px-1">
        <div ref="LossChart" class="bg-white w-full h-12rem mx-1" />
      </div>
      <div class="w-12 xl:w-6 px-1">
        <div ref="AccuracyChart" class="bg-white w-full h-12rem mx-1" />
      </div>
    </div>
  </Panel>
</template>

<script setup>
  import { ref, onMounted, defineExpose } from 'vue';

  const LossChart = ref(null); // 損失圖表
  const AccuracyChart = ref(null); // 正確率圖表

  const lossTrain = []; // 訓練損失
  const lossVadidate = []; // 驗證損失
  const accuracyTrain = []; // 訓練正確率
  const accuracyVadidate = []; // 驗證正確率

  let lossChart = null; // 損失圖表實例
  let accuracyChart = null; // 損失圖表實例

  // 損失圖表參數
  const chartOption = {
    title: { left: '30%' },
    xAxis: { type: 'value', name: '批次', boundaryGap: false, scale: true },
    yAxis: { type: 'value', scale: true },
    tooltip: { trigger: 'axis' },
    legend: { data: ['訓練', '驗證'], right: 5 },
    grid: { bottom: 30, right: 50 },
    series: [
      { name: '訓練', type: 'line', showSymbol: false },
      {
        name: '驗證',
        type: 'line',
        lineStyle: { color: '#fc8452' },
        itemStyle: { color: '#fac858' },
        markPoint: { symbolSize: [200, 30], label: { formatter: (o) => `${o.name}${o.value?.toFixed(6)}` } },
      },
    ],
  };

  // 繪製損失正確率圖表
  const PlotLossAccuracy = (batch, loss, accuracy, isTrain = true) => {
    if (isTrain) {
      lossTrain.push({ value: [batch, loss] });
      accuracyTrain.push({ value: [batch, accuracy] });
    } else {
      lossVadidate.push({ value: [batch, loss] });
      accuracyVadidate.push({ value: [batch, accuracy] });
    }
    lossChart.setOption({ series: [{ data: lossTrain }, { data: lossVadidate }] });
    accuracyChart.setOption({ series: [{ data: accuracyTrain }, { data: accuracyVadidate }] });
  };

  // 刪除損失正確率圖表數據
  const SpliceLossTrain = () => {
    const size = lossTrain.length / 3;
    lossTrain.splice(0, size);
    accuracyTrain.splice(0, size);
  };

  // 重置損失正確率圖表
  const Reset = () => {
    lossTrain.length = 0;
    lossVadidate.length = 0;
    accuracyTrain.length = 0;
    accuracyVadidate.length = 0;
  };

  defineExpose({ PlotLossAccuracy, SpliceLossTrain, Reset });

  // 初始化損失圖表
  onMounted(() => {
    lossChart = window.echarts.init(LossChart.value);
    accuracyChart = window.echarts.init(AccuracyChart.value);
    chartOption.series[1].data = lossTrain;
    lossChart.setOption(chartOption);
    lossChart.setOption({ title: { text: '損失圖表' }, yAxis: { name: '損失' }, series: [{}, { markPoint: { data: [{ type: 'min', name: '最低' }] } }] });
    accuracyChart.setOption(chartOption);
    accuracyChart.setOption({ title: { text: '正確率圖表' }, yAxis: { name: '正確率%', max: 100 }, series: [{}, { markPoint: { data: [{ type: 'max', name: '最高' }] } }] });

    window.onresize = () => {
      lossChart.resize();
      accuracyChart.resize();
    };
  });
</script>
