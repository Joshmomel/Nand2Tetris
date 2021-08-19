import { Segment } from 'util/commandType'

export const SP_BASE = 257
export const LCL_BASE = 300
export const ARG_BASE = 400
export const THIS_BASE = 3000
export const THAT_BASE = 3010
export const STATIC_BASE = 16
export const TEMP_BASE = 5

export const getSegmentBase = (segment: Segment) => {
  switch (segment) {
    case 'LOCAL':
      return LCL_BASE
    case 'ARGUMENT':
      return ARG_BASE
    case 'THIS':
      return THIS_BASE
    case 'THAT':
      return THAT_BASE
    case 'STATIC':
      return STATIC_BASE
    case 'TEMP':
      return TEMP_BASE
  }
}

export const arithmetic = ['add', 'sub', 'neg', 'eq', 'gt', 'lt', 'and', 'or', 'not']
export const pushpop = ['push', 'pop']
