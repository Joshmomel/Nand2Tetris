import { ArithmeticType, PushPopType, Segment } from './commandType'

export const printCommand = (
  command: PushPopType | ArithmeticType,
  segment: Segment | string,
  index: number | string
) => `// command:${command} : segment: ${segment} : index: ${index}`

export const filePath = process.argv[2] ?? 'static/BasicTest.vm'

export const fileName = filePath.split('.')[0].split('/')[1]
