<template>
  <Panel header="測試集預測結果" toggleable class="m-1">
    <div class="flex flex-wrap">
      <div v-for="(dataURL, index) in ImageDataURLs" :key="index" class="flex flex-wrap w-2rem mx-1">
        <Tag :severity="predictions[index] === labels[index] ? 'success' : 'danger'" :value="predictions[index]" class="w-2rem"></Tag>
        <img :src="dataURL" class="w-2rem" />
      </div>
    </div>
  </Panel>
</template>

<script setup>
  import { ref, watch, toRaw } from 'vue';

  const images = defineModel(); // 測試資料範例圖片
  const labels = defineModel('labels');
  const predictions = defineModel('predictions');

  const ImageDataURLs = ref([]); // 測試資料範例圖片Data URL

  // 將圖片轉換為dataURL
  const toDataURL = (data) => {
    const [width, height] = [28, 28];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const imageData = new ImageData(width, height);
    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      imageData.data[j + 0] = data[i] * 255;
      imageData.data[j + 1] = data[i] * 255;
      imageData.data[j + 2] = data[i] * 255;
      imageData.data[j + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  };

  // 顯示測試資料範例圖片
  const showImages = (myImages) => {
    const imageQuantity = myImages.shape[0]; // 測試資料範例數量
    for (let i = 0; i < imageQuantity; i++) {
      ImageDataURLs.value[i] = toDataURL(myImages.slice([i, 0], [1, myImages.shape[1]]).flatten().dataSync()); // 將圖片轉換為dataURL
    }
  };

  // 監控測試資料範例圖片變化
  watch(images, () => showImages(toRaw(images.value)));
</script>
