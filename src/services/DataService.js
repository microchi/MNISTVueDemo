import * as tf from '@tensorflow/tfjs';

const IMAGE_H = 28; // 圖片高
const IMAGE_W = 28; // 圖片寬
const IMAGE_SIZE = IMAGE_H * IMAGE_W; // 圖片大小
const NUM_CLASSES = 10; // 分類數
const NUM_DATASET_ELEMENTS = 65000; // 圖片數量

const NUM_TRAIN_ELEMENTS = 55000; // 訓練圖片數量

// 圖片位置(精靈格式) 784 x 65000
const MNIST_IMAGES_SPRITE_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
// 圖片標籤位置
const MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

export default class DataService {
  static datasetImages; // 圖片資料
  static datasetLabels; // 標籤資料
  static trainImages; // 訓練圖片
  static testImages; // 測試圖片
  static trainLabels; // 訓練標籤
  static testLabels; // 測試標籤

  // 載入資料
  static async Load() {
    const image = new Image();
    const canvas = document.createElement('canvas'); // 畫布
    const context = canvas.getContext('2d');

    // 載入圖片要求
    const imgRequest = new Promise((resolve) => {
      image.crossOrigin = ''; // 設爲可跨域請求

      // 圖片載入完成
      image.onload = () => {
        image.width = image.naturalWidth; // 原始圖片寬度 784 = 28 * 28
        image.height = image.naturalHeight; // 原始圖片高度 65000
        canvas.width = image.width; // 畫布寬度
        canvas.height = image.naturalHeight; // 畫布高度

        // 繪製圖片到畫布
        const datasetBytesBuffer = new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);
        const datasetBytesView = new Float32Array(datasetBytesBuffer);
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // 對 每個紅色像素點(因爲圖片為灰階所以只取紅色像素值)
        for (let i = 0; i < imageData.data.length / 4; i++) {
          datasetBytesView[i] = imageData.data[i * 4] / 255; // 將像素值介於 0~255 之間 換為 0~1 之間
        }

        this.datasetImages = new Float32Array(datasetBytesBuffer); // 圖片資料

        resolve();
      };

      image.src = MNIST_IMAGES_SPRITE_PATH; // 設定圖片位置 開始載入圖片
    });

    // 載入圖片標籤要求
    const labelsRequest = fetch(MNIST_LABELS_PATH).then(async (labelsResponse) => (this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())));

    await Promise.all([imgRequest, labelsRequest]); // 同步載入圖片及標簽

    // 將圖片及標籤分割為訓練及測試資料
    this.trainImages = this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.trainLabels = this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    this.testLabels = this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
  }

  // 取得訓練資料圖片
  static GetTrainImages() {
    return tf.tensor4d(this.trainImages, [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
  }

  // 取得訓練資料標籤
  static GetTrainLabels() {
    return tf.tensor2d(this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES]);
  }

  // 取得測試資料圖片
  static GetTestImages(limit) {
    return limit == null
      ? tf.tensor4d(this.testImages, [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1])
      : tf.tensor4d(this.testImages, [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]).slice([0, 0, 0, 0], [limit, IMAGE_H, IMAGE_W, 1]);
  }

  // 取得測試資料標籤
  static GetTestLabels(limit) {
    return limit == null
      ? tf.tensor2d(this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES])
      : tf.tensor2d(this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES]).slice([0, 0], [limit, NUM_CLASSES]);
  }
}
