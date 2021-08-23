import { Segment } from 'util/commandType'

export const getSegmentVar = (segment: Segment) => {
  switch (segment) {
    case 'LOCAL':
      return 'LCL'
    case 'ARGUMENT':
      return 'ARG'
    case 'THIS':
      return 'THIS'
    case 'THAT':
      return 'THAT'
  }
}

export const arithmetic = ['add', 'sub', 'neg', 'eq', 'gt', 'lt', 'and', 'or', 'not']
export const pushpop = ['push', 'pop']
export const programFlow = ['label', 'if-goto', 'goto']
export const functionCall = ['call', 'function', 'return']
