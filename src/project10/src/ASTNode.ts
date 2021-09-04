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
}

export default ASTNode
