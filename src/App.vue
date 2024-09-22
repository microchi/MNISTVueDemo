<script setup></script>

<template>
  <Panel header="超參數" toggleable class="m-1">
    <div class="flex flex-wrap">
      <div class="w-12 xl:w-6 p-1">
        <div class="flex align-items-center border-1 border-round">
          <label class="p-1">模型類型</label>
          <SelectButton v-model="ModelType" :options="ModelTypeOpetions" optionLabel="label" :allowEmpty="false" :disabled="IsTaining" />
        </div>
        <div class="flex align-items-center border-1 border-round">
          <label class="p-1">權重優化器</label>
          <SelectButton v-model="Optimizer" :options="OptimizerOpetions" :allowEmpty="false" :disabled="IsTaining" />
        </div>
        <div class="flex align-items-center border-1 border-round">
          <ToggleButton v-model="IsShuffle" onIcon="pi pi-check" offIcon="pi pi-times" class="w-7rem" onLabel="洗牌" offLabel="不洗牌" :disabled="IsTaining" />
          <ToggleButton v-model="IsBatchNormalization" onIcon="pi pi-check" offIcon="pi pi-times" class="w-10rem" onLabel="批次標準化" offLabel="不標準化" :disabled="IsTaining" />
          <ToggleButton v-model="IsDropOut" onIcon="pi pi-check" offIcon="pi pi-times" class="w-10rem" onLabel="丟棄部分神經" offLabel="不丟棄神經" :disabled="IsTaining" />
          <ToggleButton v-model="IsMaxPooling" onIcon="pi pi-check" offIcon="pi pi-times" class="w-8rem" onLabel="最大池化" offLabel="不池化" :disabled="IsTaining" />
        </div>
        <div class="flex align-items-center border-1 border-round">
          <label class="p-1">驗證比率</label>
          <InputNumber v-model="ValidationSplit" showButtons buttonLayout="horizontal" suffix="%" :min="0" :max="100" :disabled="IsTaining">
            <template #incrementbuttonicon> <span class="pi pi-plus" /> </template>
            <template #decrementbuttonicon> <span class="pi pi-minus" /> </template>
          </InputNumber>
        </div>
        <div class="flex align-items-center border-1 border-round">
          <label class="p-1">批次大小數</label>
          <InputNumber v-model="BatchSize" showButtons buttonLayout="horizontal" :min="1" :max="100" :disabled="IsTaining">
            <template #incrementbuttonicon> <span class="pi pi-plus" /> </template>
            <template #decrementbuttonicon> <span class="pi pi-minus" /> </template>
          </InputNumber>
        </div>
        <div class="flex align-items-center border-1 border-round">
          <label class="p-1">訓練世代數</label>
          <InputNumber v-model="Epochs" showButtons buttonLayout="horizontal" :min="1" :max="100" :disabled="IsTaining">
            <template #incrementbuttonicon> <span class="pi pi-plus" /> </template>
            <template #decrementbuttonicon> <span class="pi pi-minus" /> </template>
          </InputNumber>
        </div>
      </div>
      <div v-if="ModelSummary" class="w-12 xl:w-6 p-1">
        模型摘要
        <Tag class="mx-1" severity="danger" :value="`總參數:${ModelSummary.TotalParameters}`"></Tag>
        <Tag class="mx-1" severity="warn" :value="`訓練參數:${ModelSummary.TrainableParameters}`"></Tag>
        <Tag class="mx-1" severity="secondary" :value="`非訓練參數:${ModelSummary.NonTrainableParameters}`"></Tag>
        <DataTable :value="ModelSummary.Layers" size="small" scrollable scrollHeight="14rem" class="p-datatable-hoverable">
          <Column header="層">
            <template #body="slotProps"><div v-text="slotProps.index + 1" /></template>
          </Column>
          <Column field="Type" header="類型"></Column>
          <Column field="InputShape" header="輸入"></Column>
          <Column field="OutputShape" header="輸出"></Column>
          <Column field="Parameters" header="參數"></Column>
        </DataTable>
      </div>
    </div>
    <div class="flex align-items-center">
      <Button class="mx-1" icon="pi pi-play-circle" label="開始訓練" @click="Training" :disabled="IsTaining" size="small" />
      <Button class="mx-1" icon="pi pi-save" label="暫存模型" @click="Save" :disabled="IsTaining" size="small" />
      <Button class="mx-1" icon="pi pi-upload" label="載入暫存模型" @click="Load" :disabled="IsTaining" size="small" />
      <tag class="mx-1" :value="`目前世代:${EpochCount}`" severity="warn" />
      <tag class="mx-1" :value="`訓練批次:${TrainBatchCount}/${TotalBatchCount}(${((TrainBatchCount / TotalBatchCount) * 100).toFixed(1)}%)`" />
      <tag class="mx-1" :value="`驗證正確率:${ValidationAccuracy}%`" severity="success" />
      <tag class="mx-1" :value="`測試正確率:${TestAccuracy}%`" severity="success" /> <= 訓練目標測試正確率超過99.38%
    </div>
  </Panel>
  <LossAccuracy ref="LossAccuracyComponent" />
  <TestResult v-model="TestExampleImages" v-model:labels="TestExamplesLabels" v-model:predictions="TestExamplesPredictions" />
  <DrawPrediction />
</template>

<script setup>
  import { ref, nextTick, watch, onMounted } from 'vue';
  import UtilityService from './services/UtilityService';
  import DataService from './services/DataService';
  import ModelService from './services/ModelService';
  import * as tf from '@tensorflow/tfjs';

  import LossAccuracy from './components/LossAccuracy.vue';
  import TestResult from './components/TestResult.vue';
  import DrawPrediction from './components/DrawPrediction.vue';

  const { Loading, Alert, SummaryToJSON } = UtilityService;
  const { CreateModel } = ModelService;

  // 模型類型選項
  const ModelTypeOpetions = ref([
    { label: 'DenseNet 全連結神經網路', value: 'DenseNet' },
    { label: 'ConvNet 卷積神經網路', value: 'ConvNet' },
  ]);
  const ModelType = ref(ModelTypeOpetions.value[0]); // 模型類型

  // 優化器選項
  const OptimizerOpetions = ref(['sgd', 'adagrad', 'adadelta', 'adam', 'adamax', 'rmsprop']);
  const Optimizer = ref('sgd'); // 權重優化器

  const IsShuffle = ref(false); // 是否洗牌
  const IsDropOut = ref(false); // 是否丟棄部分神經元
  const IsBatchNormalization = ref(false); // 是否使用批次標準化
  const IsMaxPooling = ref(false); // 是否使用最大池化

  const ModelSummary = ref(null); // 模型摘要
  const IsTaining = ref(false); // 是否正在訓練

  const ValidationSplit = ref(15); // 留15%的訓練資料進行驗證 避免過度擬合
  const BatchSize = ref(200); // 批次大小
  const Epochs = ref(3); // 訓練世代

  const TrainBatchCount = ref(0); // 訓練批次
  const TotalBatchCount = ref(0); // 批次總數
  const EpochCount = ref(0); // 訓練世代
  const ValidationAccuracy = ref(0); // 驗證正確率
  const TestAccuracy = ref(99.38); // 測試正確率

  const TestExampleImages = ref({}); // 測試範例圖片
  const TestExamplesLabels = ref([]); // 測試範例標籤
  const TestExamplesPredictions = ref([]); // 測試範例預測結果

  const LossAccuracyComponent = ref(null); // 損失正確率元件

  let testExampleImages = null; // 測試範例圖片

  // 更新測試範例預測結果
  const examplePrediction = () => (TestExamplesPredictions.value = Array.from(model.predict(testExampleImages).argMax(1).dataSync()));

  // 載入模型摘要
  const summary = () => {
    const lines = [];
    model.summary(200, [0.6, 0.7, 0.8, 0.9, 1], (o) => lines.push(o));
    ModelSummary.value = SummaryToJSON(lines);
  };

  // 開始訓練
  const Training = async () => {
    IsTaining.value = true;
    ModelSummary.value = null;

    LossAccuracyComponent.value.Reset(); // 重置損失正確率圖表

    window.model = CreateModel(ModelType.value.value, IsShuffle.value, IsDropOut.value, IsBatchNormalization.value, IsMaxPooling.value); // 建立模型
    summary(); // 載入模型摘要

    // 編譯模型
    model.compile({
      optimizer: Optimizer.value, // 權重優化器
      loss: 'categoricalCrossentropy', // 多分類損失函數
      metrics: ['accuracy'], // 評估指標 正確率
    });

    const trainImages = DataService.GetTrainImages(); // 取得訓練資料圖片
    const trainLabels = DataService.GetTrainLabels(); // 取得訓練資料標籤

    const validationSplit = ValidationSplit.value / 100.0; // 驗證比率

    // 計算訓練批次總數
    TotalBatchCount.value = Math.ceil((trainImages.shape[0] * (1 - validationSplit)) / BatchSize.value) * Epochs.value;

    TrainBatchCount.value = 0; // 訓練批次數
    EpochCount.value = 0; // 訓練世代數
    ValidationAccuracy.value = 0.0; // 驗證正確率
    TestAccuracy.value = 0.0; // 測試正確率

    // 訓練
    await model.fit(trainImages, trainLabels, {
      shuffle: IsShuffle.value, // 洗牌
      batchSize: BatchSize.value, // 批次大小
      validationSplit, // 訓練資料驗證比例
      epochs: Epochs.value, // 訓練世代
      callbacks: {
        // 批次完成
        onBatchEnd: async (batch, logs) => {
          TrainBatchCount.value++;

          if (batch % 10 === 0) {
            LossAccuracyComponent.value.PlotLossAccuracy(TrainBatchCount.value, logs.loss, logs.acc * 100); // 繪製損失正確率圖表
            tf.tidy(() => examplePrediction()); // 釋放張量 後 更新測試範例預測結果
          }

          await tf.nextFrame(); // 等待下一幀
        },
        // 世代完成
        onEpochEnd: async (epoch, logs) => {
          EpochCount.value++;

          ValidationAccuracy.value = (logs.val_acc * 100).toFixed(3); // 驗證正確率

          TestAccuracy.value = (model.evaluate(DataService.GetTestImages(), DataService.GetTestLabels())[1].dataSync()[0] * 100).toFixed(3); // 測試資料正確率

          LossAccuracyComponent.value.PlotLossAccuracy(TrainBatchCount.value, logs.val_loss, logs.val_acc * 100, false); // 繪製損失正確率圖表

          tf.tidy(() => examplePrediction()); // 釋放張量 後 更新測試範例預測結果

          if (EpochCount.value === 3) LossAccuracyComponent.value.SpliceLossTrain(); // 刪除損失正確率圖表數據

          await tf.nextFrame(); // 等待下一幀
        },
      },
    });

    IsTaining.value = false;
  };

  // 暫存模型
  const Save = () => model.save('localstorage://my-model').then(() => Alert('模型已暫存!'));

  // 載入暫存模型
  const Load = async () =>
    tf.loadLayersModel('localstorage://my-model').then((o) => {
      window.model = o;
      summary(); // 載入模型摘要

      Alert('暫存模型已載入!');
    });

  // 載入訓練資料與預訓練模型
  Loading('訓練資料載入中...');
  DataService.Load()
    .then(() => {
      TestExamplesLabels.value = Array.from(DataService.GetTestLabels(46).argMax(1).dataSync()); // 測試資料真實標籤

      Loading('預訓練模型載入中...');

      return tf.loadLayersModel('pretraining/pretraining.json');
    })
    .then((o) => {
      window.model = o;

      summary(); // 載入模型摘要

      testExampleImages = DataService.GetTestImages(46); // 取得測試資料圖片
      TestExamplesPredictions.value = Array.from(model.predict(testExampleImages).argMax(1).dataSync()); // 測試資料預測標籤
      TestExampleImages.value = testExampleImages;

      Alert('預訓練模型已載入!');
    });
</script>
