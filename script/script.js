(() => {
  window.isKeyDown = {};

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  const SHOT_MAX_COUNT = 10;

  let viper = null;
  let util = null;
  let canvas = null;
  let ctx = null;
  let startTime = null;
  let shotArray = [];

  window.addEventListener('load', () => {
    util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
    canvas = util.canvas;
    ctx = util.context;

    initialize();
    loadCheck();
  });

  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');

    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
    }

    viper.setShotArray(shotArray);
  }

  function loadCheck() {
    let ready = true;
    ready = ready && viper.ready;

    shotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready) {
      eventSetting();
      startTime = Date.now();
      render();
    } else {
      setTimeout(loadCheck, 100);
    }
  }

  function eventSetting() {
    window.addEventListener('keydown', (event) => {
      console.log(event.key);
      isKeyDown[`key_${event.key}`] = true;
    });
    window.addEventListener('keyup', (event) => {
      isKeyDown[`key_${event.key}`] = false;
    })
  }

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');

    let nowTime = (Date.now() - startTime) / 1000;

    viper.update();

    shotArray.map((v) => {
      v.update();
    })

    requestAnimationFrame(render);
  }

  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

})();