export function * arrayToGenerator<T>(arr: T[] | string){
    for(let i = 0; i < arr.length; i++) {
        yield arr[i]
    }
}

const a = arrayToGenerator(['a', 'b'])
a.next()
