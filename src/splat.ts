const sound = new Entity()
sound.addComponent(new Transform())
sound.getComponent(Transform).position = Camera.instance.position
sound.addComponent(new AudioSource(new AudioClip("sounds/splat.mp3")))
engine.addEntity(sound)

export class Splat extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    sound.getComponent(AudioSource).playOnce()
  }
}