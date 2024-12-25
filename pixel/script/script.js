(() => {

  let canvas = null;
  let ctx = null;
  let image = null;
  const CANVAS_SIZE = 512;

  console.log('a');
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
    console.log(imageData);
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