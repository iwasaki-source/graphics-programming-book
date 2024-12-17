(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  let util = null;
  let canvas = null;
  let ctx = null;
  let image = null;
  let startTime = null;

  window.addEventListener('load', () => {
    util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
    canvas = util.canvas;
    ctx = util.context;

    util.imageLoader('./image/viper.png', (loadImage) => {
      image = loadImage;
      initialize();
      startTime = Date.now();
      render();
    })
  });

  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  function render() {
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');

    let nowTime = (Date.now() - startTime) / 1000;
    let s = Math.sin(nowTime);
    let x = s * 100.0;

    ctx.drawImage(image, CANVAS_WIDTH / 2 + x, CANVAS_HEIGHT / 2);

    requestAnimationFrame(render);
  }

  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

})();