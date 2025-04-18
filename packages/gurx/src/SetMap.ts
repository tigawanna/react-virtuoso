export class SetMap<T> {
  map = new Map<symbol, Set<T>>()

  delete(id: symbol) {
    return this.map.delete(id)
  }

  get(id: symbol) {
    return this.map.get(id)
  }

  getOrCreate(id: symbol) {
    let record = this.map.get(id)
    if (record === undefined) {
      record = new Set<T>()
      this.map.set(id, record)
    }
    return record
  }

  use(id: symbol, cb: (value: Set<T>) => unknown) {
    const set = this.get(id)
    if (set !== undefined) {
      cb(set)
    }
  }
}
