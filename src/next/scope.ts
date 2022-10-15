
export type Pipe<T> = (data: T) => Promise<undefined | T> | undefined | T

export class Signal<T> {
  pipes: Pipe<T>[] = []

  addPipe(pipe: Pipe<T>) {
    this.pipes.push(pipe)
  }

  async emit<Context extends T>(context: Context): Promise<Context | undefined> {
    let current: Context | undefined = context

    for (const pipe of this.pipes) {
      current = await pipe(current) as Context

      if (typeof current === 'undefined') return
    }
    return current
  }
}

export class Scope<Signals> {
  signal = new Signal<Signals>()

  constructor(public name: string) {}

  addPipe(middleware: Pipe<Signals>) {
    this.signal.addPipe(middleware)
  }

  use<T>(plugin: Scope<T | Signals>) {
    this.addPipe(context => {
      return plugin.signal.emit<Signals>(context)
    })
  }

  emit(context: Signals) {
    return this.signal.emit(context)
  }
}
