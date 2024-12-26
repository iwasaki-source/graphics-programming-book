(() => {

  let canvas = null;
  let ctx = null;
  let image = null;
  const CANVAS_SIZE = 512;

  window.addEventListener('load', () => {
    imageLoader('./image/sample.jpg', (loadedImage) => {
      image = loadedImage;
      initialize();
      render();
    });
  });

  function initialize() {
    canvas = document.body.querySelector('#main_canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx = canvas.getContext('2d');
  }

  function render() {
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // let outputData = invertFilter(imageData);
    // let outputData = grayscaleFilter(imageData);
    // let outputData = binarizationFilter(imageData);
    // let outputData = laplacianFilter(imageData);
    let outputData = medianFilter(imageData);

    ctx.putImageData(outputData, 0, 0);
  }

  // メディアンフィルター
  function medianFilter(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    let out = ctx.createImageData(width, height);

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;

        let topIndex = (Math.max(i - 1, 0) * width + j) * 4;
        let bottomIndex = (Math.min(i + 1, height - 1) * width + j) * 4;
        let leftIndex = (i * width + Math.max(j - 1, 0)) * 4;
        let rightIndex = (i * width + Math.min(j + 1, width - 1)) * 4;
        let topLeftIndex = (Math.max(i - 1, 0) * width + Math.max(j - 1, 0)) * 4;
        let bottomLeftIndex = (Math.min(i + 1, height - 1) * width +Math.max(j - 1, 0)) * 4;
        let topRightIndex = (Math.max(i - 1, 0) * width + Math.min(j + 1, width - 1)) * 4;
        let bottomRightIndex = (Math.min(i + 1, height - 1) * width + Math.min(j + 1, width - 1)) * 4;

        let luminanceArray = [
          {index: index,            luminance: getLuminance(data, index)},
          {index: topIndex,         luminance: getLuminance(data, topIndex)},
          {index: bottomIndex,      luminance: getLuminance(data, bottomIndex)},
          {index: leftIndex,        luminance: getLuminance(data, leftIndex)},
          {index: rightIndex,       luminance: getLuminance(data, rightIndex)},
          {index: topLeftIndex,     luminance: getLuminance(data, topLeftIndex)},
          {index: bottomLeftIndex,  luminance: getLuminance(data, bottomLeftIndex)},
          {index: topRightIndex,    luminance: getLuminance(data, topRightIndex)},
          {index: bottomRightIndex, luminance: getLuminance(data, bottomRightIndex)}
        ];

        luminanceArray.sort((a, b) => {
          return a.luminance - b.luminance;
        })

        let sorted = luminanceArray[4];

        out.data[index] = data[sorted.index];
        out.data[index + 1] = data[sorted.index + 1];
        out.data[index + 2] = data[sorted.index + 2];
        out.data[index + 3] = data[sorted.index + 3];
      }
    }
    return out;
  }

  // ラプラシアンフィルター
  function laplacianFilter(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    let out = ctx.createImageData(width, height);

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;

        let topIndex = (Math.max(i - 1, 0) * width + j) * 4;
        let bottomIndex = (Math.min(i + 1, height - 1) * width + j) * 4;
        let leftIndex = (i * width + Math.max(j - 1, 0)) * 4;
        let rightIndex = (i * width + Math.min(j + 1, width - 1)) * 4;

        let r = data[topIndex] +
                data[bottomIndex] +
                data[leftIndex] +
                data[rightIndex] +
                data[index] * -4;
        let g = data[topIndex + 1] +
                data[bottomIndex + 1] +
                data[leftIndex + 1] +
                data[rightIndex + 1] +
                data[index + 1] * -4;
        let b = data[topIndex + 2] +
                data[bottomIndex + 2] +
                data[leftIndex + 2] +
                data[rightIndex + 2] +
                data[index + 2] * -4;

        let value = (Math.abs(r) + Math.abs(g) + Math.abs(b)) / 3;

        out.data[index] = value;
        out.data[index + 1] = value;
        out.data[index + 2] = value;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // 二値化フィルター
  function binarizationFilter(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    let out = ctx.createImageData(width, height);

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;

        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];

        let luminace = (r + g + b) / 3;
        let value = luminace >= 128 ? 255 : 0;

        out.data[index] = value;
        out.data[index + 1] = value;
        out.data[index + 2] = value;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // グレイスケールフィルター
  function grayscaleFilter(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    let out = ctx.createImageData(width, height);

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;

        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];

        let luminace = (r + g + b) / 3;

        out.data[index] = luminace;
        out.data[index + 1] = luminace;
        out.data[index + 2] = luminace;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // ネガポジ反転フィルター
  function invertFilter(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    let out = ctx.createImageData(width, height);

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        out.data[index] = 255 - data[index];
        out.data[index + 1] = 255 - data[index + 1];
        out.data[index + 2] = 255 - data[index + 2];
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  function getLuminance(data, index) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    return (r + g + b) / 3;
  }

  function imageLoader(path, callback) {
    let target = new Image();
    target.addEventListener('load', () => {
      if (callback != null) {
        callback(target);
      }
    });
    target.src = path;
  }

})();