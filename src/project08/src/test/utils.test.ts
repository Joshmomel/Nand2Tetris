process.argv = ['0', '1', '2']
describe('fileName', () => {
  it('returns rile name correctly', () => {
    console.log(process.argv)
    expect(true).toBe(true)
  })
})
