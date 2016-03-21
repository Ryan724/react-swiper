const errorMargin = 0.0001;
/**
 * [stepper description]
 * @param  {[type]} frameRate [一秒多少帧:帧率]
 * @param  {[type]} x         [当前值]
 * @param  {[type]} v         [当前速度]
 * @param  {[type]} destX     [目标值]
 * @param  {[type]} k         [弹性系数]
 * @param  {[type]} b         [阻尼系数]
 * @return {[type]}           [description]
 */
export default function stepper(frameRate, x, v, destX, k, b) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  const Fspring = -k * (x - destX);

  // Damping constant, in kg / s
  const Fdamper = -b * v;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  const a = Fspring + Fdamper;

  // if (window.hackOn) frameRate = 1 / 300;

  const newV = v + a * frameRate;
  const newX = x + newV * frameRate;

  if (Math.abs(newV - v) < errorMargin && Math.abs(newX - x) < errorMargin) {
    return [destX, 0];
  }
  return [newX, newV];
}
