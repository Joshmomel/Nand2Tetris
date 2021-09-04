import Tokenizer from "../Tokenizer";
import fs from "fs";
import {filePath} from "../utils/utils";

describe('Tokenizer', () => {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  it('should creat Tokenizer', function () {

  });
})
