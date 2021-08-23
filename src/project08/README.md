## Virtual Machine

This Assembler is the implementation of the project 7 in [nand2tetris](https://www.nand2tetris.org/project07).

It has passed the tests given in project 7

## Run 🚀
You need to install [Node.js](https://nodejs.org/en/) locally
```bash
yarn install
```
To convert `.vm` to `.asm`
```shell
ts-node src/index.ts ${file_path}
## example 
ts-node src/index.ts static/StaticTest.vm 
```

## Test
Unit test cover the CodeWriter.ts
```shell
yarn test
```

### Test coverage

File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
CodeWriter.ts      |   79.45 |       72 |      75 |   82.61 | 168,173-189   

## Issues
Please post to `issues` if any questions
