# 基於 TensorFlow.js 和 Vue3 的 MNIST 手寫數字識別

這個專案展示了如何使用 TensorFlow.js 和 Vue3 來訓練和部署一個 MNIST 手寫數字識別模型。使用者可以通過調整各種超參數來優化模型性能，並使用 Apache ECharts 來可視化訓練過程。此外，還提供了一個即時手繪界面來測試訓練好的模型。

[![LICENSE MIT](https://img.shields.io/github/license/microchi/MNISTVueDemo)](https://raw.githubusercontent.com/microchi/MNISTVueDemo/master/LICENSE)

[線上展示](https://microchi.github.io/MNISTVueDemo/)

## 功能特點

- 使用 TensorFlow.js 在瀏覽器中訓練 MNIST 數據集
- 可調整的超參數，包括：
  - 模型類型(DenseNet 全連結神經網路、ConvNet 卷積神經網路)
  - 權重優化器(SGD, ADAGRAD, ADADELTA, ADAM, ADAMAX, RMSPROP)
  - 是否洗牌數據(Shuffle)
  - 是否丟棄部分神經元(DropOut)
  - 批次標準化(Batch Normalization)
  - 最大池化(Max Pooling)
  - 批次大小(Batch Size)
  - 驗證數據比例(Validation Split)
  - 訓練世代(Epochs)
- 使用 Apache ECharts 繪製即時損失和準確率圖表
- 提供線上手繪界面，用於即時測試訓練好的模型

## 安裝與運行

1. 克隆此專案：
   ```
   git clone https://github.com/microchi/MNISTVueDemo.git
   ```

2. 進入項目目錄：
   ```
   cd MNISTVueDemo
   ```

3. 安裝依賴：
   ```
   yarn
   ```

4. 運行開發服務器：
   ```
   yarn dev
   ```

5. 在瀏覽器中打開 `http://localhost:5173`

## 使用說明

1. 在界面上調整超參數
2. 點擊 "開始訓練" 按鈕
3. 觀察 ECharts 圖表中的訓練進度
4. 訓練完成後，使用手繪界面測試模型
5. 訓練目標 測試正確率超過預訓練模型(99.38%)

![Screen](https://microchi.github.io/MNISTVueDemo/screen.gif)

## 技術堆疊

- TensorFlow.js
- Vue3
- Apache ECharts
- PrimeVue

## 貢獻

歡迎提交 Pull Requests 或開 Issues 來改進這個專案。

## 致謝

本專案受到以下兩個專案的啟發：

- [TensorFlow.js MNIST 示例](https://github.com/tensorflow/tfjs-examples/tree/master/mnist)
- [MNIST Draw](https://github.com/mco-gh/mnist-draw)

感謝這些專案的作者提供了寶貴的參考和靈感。

## 許可證

本專案採用 MIT 許可證。詳情請見 [LICENSE](LICENSE) 文件。