class ASTNode {
  public children: ASTNode[]
  public parent: ASTNode | null
  public type: string | null
  public label: string | null

  constructor(type: string | null = null, label: string | null = null) {
    this.children = []
    this.parent = null

    this.type = type
    this.label = label
  }

  addChild(node: ASTNode) {
    node.parent = this
    this.children.push(node)
  }

  getLength() {
    return this.children.length
  }

  static getByType(parent: ASTNode, types: string[]) {
    const stack: ASTNode[] = []
    const targetLabelList = []
    stack.push(parent)

    while (stack.length > 0) {
      let child = stack.pop()
      for (let i = 0; i < child!.children.length; i++) {
        if (!child) continue
        const next = child.children[i]
        stack.push(next)
        if (next.type !== null) {
          if (types.includes(next.type)) {
            targetLabelList.push(next)
          }
        }
      }
    }

    return targetLabelList
  }

  static getByLabel(parent: ASTNode, label: string) {
    const stack: ASTNode[] = []
    const targetLabelList = []
    stack.push(parent)

    while (stack.length > 0) {
      let child = stack.pop()
      for (let i = 0; i < child!.children.length; i++) {
        if (!child) continue
        const next = child.children[i]
        stack.push(next)
        if (next.label !== null) {
          if (next.label === label) {
            targetLabelList.push(next)
          }
        }
      }
    }

    return targetLabelList
  }


}

export default ASTNode
