import Token from "../Token";

class XmlPrinter {

  static printIntermediate(tokens: Token[]) {
    let xml = `<tokens> \n`

    for (let i = 0; i < tokens.length; i++) {
      xml += `<${tokens[i].type}>${tokens[i].value}</${tokens[i].type}> \n`
    }

    xml += `</tokens> \n`

    return xml
  }
}

export default XmlPrinter
