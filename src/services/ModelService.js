import * as tf from '@tensorflow/tfjs';

const IMAGE_H = 28; // 圖片高
const IMAGE_W = 28; // 圖片寬

export default class ModelService {
  // 建立全連結模型
  static createDenseModel(isDropOut, isBatchNormalization) {
    const model = tf.sequential(); // 建立序列模型
    model.add(tf.layers.flatten({ inputShape: [IMAGE_H, IMAGE_W, 1] })); // 降維(攤平)成一維 (輸入層)

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    model.add(tf.layers.dense({ units: 128, activation: 'relu', kernelInitializer: 'varianceScaling' })); // 128 點 全連結 層 (隱藏層) relu(線性激活函數)

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    if (isDropOut) model.add(tf.layers.dropout({ rate: 0.5 })); // 隨機抛棄 50% 的神經元

    model.add(tf.layers.dense({ units: 64, activation: 'relu', kernelInitializer: 'varianceScaling' })); // 64 點 全連結 層 (隱藏層) relu(線性激活函數)

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    if (isDropOut) model.add(tf.layers.dropout({ rate: 0.5 })); // 隨機抛棄 50% 的神經元

    model.add(tf.layers.dense({ units: 10, activation: 'softmax', kernelInitializer: 'varianceScaling' })); // 10 點 全連結 層 (輸出層) softmax(正規化激活函數, 輸出值為0~1幾率)

    return model;
  }

  // 建立卷積模型
  static createConvModel(isDropOut, isBatchNormalization, isMaxPooling) {
    const model = tf.sequential(); // 建立序列模型

    model.add(
      tf.layers.conv2d({
        inputShape: [IMAGE_H, IMAGE_W, 1], // 輸入圖片大小 (輸入層)
        kernelSize: 3, // 3x3 卷積核
        filters: 16, // 16 個卷積濾鏡
        activation: 'relu', // 線性激活函數
        kernelInitializer: 'varianceScaling', // 初始化標準差為方差縮放
        padding: 'same',
      })
    );

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    if (isMaxPooling) model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 })); // 區域最大值取樣 池化核大小 2x2 步長 2

    model.add(tf.layers.conv2d({ kernelSize: 3, filters: 64, activation: 'relu', kernelInitializer: 'varianceScaling', padding: 'same' })); // 卷積濾鏡 32 個

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    if (isMaxPooling) model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 })); // 區域最大值取樣 池化核大小 2x2 步長 2

    model.add(tf.layers.conv2d({ kernelSize: 3, filters: 64, activation: 'relu', kernelInitializer: 'varianceScaling', padding: 'same' })); // 卷積濾鏡 64 個

    if (isBatchNormalization) model.add(tf.layers.batchNormalization()); // 批次正規化

    if (isMaxPooling) model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 })); // 區域最大值取樣 池化核大小 2x2 步長 2

    model.add(tf.layers.flatten()); // 降維(攤平)

    model.add(tf.layers.dense({ units: 64, activation: 'relu', kernelInitializer: 'varianceScaling' })); // 全連結層 64 個

    if (isDropOut) model.add(tf.layers.dropout({ rate: 0.5 })); // 隨機抛棄 50% 的神經元

    model.add(tf.layers.dense({ units: 10, activation: 'softmax', kernelInitializer: 'varianceScaling' })); // 10 點 全連結 層 (輸出層) softmax(正規化激活函數, 輸出值為0~1幾率)

    return model;
  }

  // 建立模型
  static CreateModel(modelType, isDropOut, isBatchNormalization, isMaxPooling) {
    // 為 DenseNet 或 ConvNet 則建立相對應的模型
    if (modelType === 'DenseNet') {
      return ModelService.createDenseModel(isDropOut, isBatchNormalization);
    } else if (modelType === 'ConvNet') {
      return ModelService.createConvModel(isDropOut, isBatchNormalization, isMaxPooling);
    }
  }
}
