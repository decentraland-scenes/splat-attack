import { Splat } from "./splat"

/*
 * Adapted from the grid sampling solution versino 4 to the total circles area problem.
 * link: https://rosettacode.org/wiki/Total_circles_area#Grid_Sampling_Version_4
 */

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
base.addComponent(new Transform({ scale: new Vector3(2, 1, 2) }))
engine.addEntity(base)

// Maths
// NOTE: Alos works with any circle with an arbitrary radius
class Circle {
  constructor(public x: number, public y: number, public r: number) {}
}

const circles: Circle[] = []

const x_min_diffs: number[] = []
const x_max_diffs: number[] = []
const y_min_diffs: number[] = []
const y_max_diffs: number[] = []
const sample_size = 256

function calculateArea(): number {
  for (let c of circles) {
    x_min_diffs.push(c.x - c.r)
    x_max_diffs.push(c.x + c.r)
    y_min_diffs.push(c.y - c.r)
    y_max_diffs.push(c.y + c.r)
  }
  let x_min = Math.min(...x_min_diffs)
  let x_max = Math.max(...x_max_diffs)
  let y_min = Math.min(...y_min_diffs)
  let y_max = Math.max(...y_max_diffs)

  let dx = (x_max - x_min) / sample_size
  let dy = (y_max - y_min) / sample_size

  let count = 0

  // Range
  for (let r = 0; r < sample_size; r++) {
    let y = y_min + r * dy
    for (let c = 0; c < sample_size; c++) {
      let x = x_min + c * dx
      for (let i = 0; i < circles.length; i++) {
        if (Math.pow(x - circles[i].x, 2) + Math.pow(y - circles[i].y, 2) <= Math.pow(circles[i].r, 2)) {
          count += 1
          break
        }
      }
    }
  }
  let areaCovered = count * dx * dy
  return areaCovered
}

// Splat
const splatShape = new GLTFShape("models/splat.glb")
const splatCache = new Entity()
splatCache.addComponent(new Transform({ scale: new Vector3(0, 0, 0) }))
splatCache.addComponent(splatShape)
engine.addEntity(splatCache)

// Controls
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  const splat = new Splat(splatShape, new Transform())
  let transform = splat.getComponent(Transform)
  transform.position.copyFrom(e.hit.hitPoint)
  circles.push(new Circle(transform.position.x, transform.position.z, 0.5))
})

// UI
const canvas = new UICanvas()
const text = new UIText(canvas)
text.adaptWidth = true
text.fontSize = 16
text.color = Color4.Teal()
text.value = "Press 'E' to Calculate Area"

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, () => {
  let areaCoveredText = calculateArea()
  if(areaCoveredText) {
    text.value = `Press 'E' to Recalculate\nArea Covered: ${areaCoveredText.toFixed(2)}m`
  } else {
    text.value = "Press 'E' to Recalculate\nArea Covered: 0m"
  }
  log("Calculating...")
  log(`Approximated Area Covered: ${areaCoveredText}m`)
})
