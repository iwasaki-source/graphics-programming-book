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
    let outputData = binarizationFilter(imageData);

    ctx.putImageData(outputData, 0, 0);
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