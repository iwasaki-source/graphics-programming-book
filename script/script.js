(() => {
  window.isKeyDown = {};

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const ENEMY_MAX_COUNT = 10;
  const SHOT_MAX_COUNT = 10;

  let viper = null;
  let util = null;
  let canvas = null;
  let ctx = null;
  let scene = null;
  let startTime = null;
  let enemyArray = [];
  let shotArray = [];
  let singleShotArray = [];

  window.addEventListener('load', () => {
    util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
    canvas = util.canvas;
    ctx = util.context;

    initialize();
    loadCheck();
  });

  function initialize() {
    let i;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    scene = new SceneManager();

    viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');

    viper.setComing(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT + 50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );

    for (i = 0; i < ENEMY_MAX_COUNT; ++i) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, './image/enemy_small.png');
    }

    for (let i = 0; i < SHOT_MAX_COUNT; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
      singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
    }

    viper.setShotArray(shotArray, singleShotArray);
  }

  function loadCheck() {
    let ready = true;
    ready = ready && viper.ready;

    enemyArray.map((v) => {
      ready = ready && v.ready;
    });

    shotArray.map((v) => {
      ready = ready && v.ready;
    });

    singleShotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready) {
      eventSetting();
      sceneSetting();
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

  function sceneSetting() {
    scene.add('intro', (time) => {
      if (time > 2.0) {
        scene.use('invade');
      }
    });

    scene.add('invade', (time) => {
      if (scene.frame !== 0) return;

      for (let i = 0; i < ENEMY_MAX_COUNT; ++i) {
        if (enemyArray[i].life <= 0) {
          let e = enemyArray[i];
          e.set(CANVAS_WIDTH / 2, -e.height);
          e.setVector(0.0, 1.0);
          break;
        }
      }
    });
    scene.use('intro');
  }

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');

    let nowTime = (Date.now() - startTime) / 1000;

    scene.update();
    viper.update();

    enemyArray.map((v) => {
      v.update();
    });

    shotArray.map((v) => {
      v.update();
    });

    singleShotArray.map((v) => {
      v.update();
    });

    requestAnimationFrame(render);
  }

  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

})();