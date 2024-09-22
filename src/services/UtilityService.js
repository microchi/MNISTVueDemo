export default class UtilityService {
  // 提示對話框
  static Alert(title, text, icon = 'info', timer = 1000) {
    return window.Swal.fire({ icon, title, text, timer });
  }

  // 載入中對話框
  static Loading(title) {
    return window.Swal.fire({
      title,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => window.Swal.showLoading(),
    });
  }

  // 將 TensorFlow 模型摘要 轉換為 JSON 格式
  static SummaryToJSON = (lines) => {
    // 初始化JSON結構
    const result = { Layers: [] };

    const layersStart = lines.findIndex((line) => line.startsWith('=')); // 層開始
    const layersEnd = lines.findIndex((line, index) => index > layersStart && line.startsWith('=')); // 層結束

    // 處理數據行
    for (let i = layersStart + 1; i < layersEnd; i++) {
      const row = lines[i].trim();
      // 跳過空行和分隔行
      if (!row || row.startsWith('_')) continue;
      const parts = row.split(/\s+/);
      const layer = {
        Type: parts[1] && parts[1].startsWith('(') ? parts[1].slice(1, -1) : '',
        InputShape: parts.find((p) => p.startsWith('[[')),
        OutputShape: parts.find((p) => p.startsWith('[null')),
        Parameters: parseInt(parts[parts.length - 1].replace(',', '')),
      };
      result.Layers.push(layer);
    }

    // 提取總參數信息
    for (let i = layersEnd + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('Total params:')) {
        result.TotalParameters = parseInt(line.split(':')[1].trim().replace(',', '')); // 總參數
      } else if (line.startsWith('Trainable params:')) {
        result.TrainableParameters = parseInt(line.split(':')[1].trim().replace(',', '')); // 訓練參數
      } else if (line.startsWith('Non-trainable params:')) {
        result.NonTrainableParameters = parseInt(line.split(':')[1].trim().replace(',', '')); // 非訓練參數
      }
    }

    return result;
  };
}
