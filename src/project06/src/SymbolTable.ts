class SymbolTable {
  private counter = 16;
  private readonly table = {
    SP: 0,
    LCL: 1,
    ARG: 2,
    THIS: 3,
    THAT: 4,
    R0: 0,
    R1: 1,
    R2: 2,
    R3: 3,
    R4: 4,
    R5: 5,
    R6: 6,
    R7: 7,
    R8: 8,
    R9: 9,
    R10: 10,
    R11: 11,
    R12: 12,
    R13: 13,
    R14: 14,
    R15: 15,
    SCREEN: 16384,
    KBD: 24576,
  } as { [key: string]: number };

  addLabel(symbol: string, line: number) {
    this.table[symbol] = line;
  }

  hasVariable(symbol: string) {
    return this.table[symbol] !== undefined && this.table[symbol] !== -1;
  }

  addVariable(symbol: string) {
    if (this.table[symbol] && this.table[symbol] !== -1) return;
    this.table[symbol] = this.counter;
    this.counter += 1;
  }

  getSymbol(symbol: string): number {
    return this.table[symbol];
  }
}

export default SymbolTable;
