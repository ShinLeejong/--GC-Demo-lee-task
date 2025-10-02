goog.provide("mygame");

goog.require("lime.Sprite");
goog.require("lime.Text");
goog.require("lime.animation.MoveBy");
goog.require("lime.scheduleManager");

mygame.start = function (scene) {
  const obj = new lime.Sprite()
    .setSize(400, 400)
    .setFill("#b0b0b0")
    .setPosition(100, 0)      // 씬 좌표에서 박스 앵커(0.5,0.5)가 (100,0)
    .setAnchorPoint(0, 0);

  scene.appendChild(obj);

  const text = new lime.Text()
    .setText("Hello World, lee-task!")
    .setAnchorPoint(0.5, 0.5);

  // 부모 중앙에 두기: 부모 사이즈의 절반 좌표로 배치
  const { width, height } = obj.getSize();
  text.setPosition(width / 2, height / 2);

  obj.appendChild(text);

  lime.scheduleManager.callAfter(function () {
    const move = new lime.animation.MoveBy(0, 100).setDuration(1);
    obj.runAction(move);
  }, 1000);
};
