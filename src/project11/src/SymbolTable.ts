export type Kind = 'static' | 'field' | 'argument' | 'var'

export interface TableValue {
  type: string,
  kind: Kind,
  kindIndex: { [key: string]: number }
}

class SymbolTable {
  table: { [key: string]: [name: string, kind: Kind, index: number] };
  kindIndex: { [key: string]: number } = {};

  constructor() {
    this.table = {}
    this.kindIndex = {
      static: 0,
      field: 0,
      argument: 0,
      var: 0
    }
  }


  //example: [value int argument]
  define(name: string, type: string, kind: Kind): void {
    console.log(`1 symbolTable define :: kind ${kind} kindIndex[kind] ${this.kindIndex[kind]}`)
    this.table[name] = [type, kind, this.kindIndex[kind]++]
    console.log(`2 this.table[name]`, this.table[name])
  }

  varCount(kind: Kind): number {
    return this.kindIndex[kind]
  }

  kindOf(name: string): Kind | 'none' {
    const kind = this.table[name]
    if (kind === undefined) return 'none'
    return kind[1]
  }

  typeOf(name: string): string {
    const kind = this.table[name]
    if (kind === undefined) return 'none'
    return kind[0]
  }

  indexOf(name: string): number {
    const kind = this.table[name]
    if (kind === undefined) return -1
    return kind[2]
  }

  reset() {
    this.table = {}
    this.kindIndex = {
      static: 0,
      field: 0,
      argument: 0,
      var: 0
    }
  }
}

export default SymbolTable
