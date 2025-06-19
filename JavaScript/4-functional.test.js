const { pipe, branch } = require('./4-functional');

describe('pipe function', () => {
  test('should apply functions in sequence', () => {
    const add1 = (x) => x + 1;
    const multiply2 = (x) => x * 2;
    const subtract3 = (x) => x - 3;
    
    const pipeline = pipe(add1, multiply2, subtract3);
    const result = pipeline(5);
    
    // 5 -> 6 -> 12 -> 9
    expect(result).toBe(9);
  });

  test('should work with single function', () => {
    const double = (x) => x * 2;
    const pipeline = pipe(double);
    
    expect(pipeline(5)).toBe(10);
  });

  test('should work with no functions (identity)', () => {
    const pipeline = pipe();
    
    expect(pipeline(42)).toBe(42);
    expect(pipeline('test')).toBe('test');
  });

  test('should work with object transformations', () => {
    const addField = (obj) => ({ ...obj, added: true });
    const incrementId = (obj) => ({ ...obj, id: obj.id + 1 });
    
    const pipeline = pipe(addField, incrementId);
    const result = pipeline({ id: 1, name: 'test' });
    
    expect(result).toEqual({ id: 2, name: 'test', added: true });
  });

  test('should handle async functions', async () => {
    const asyncAdd = async (x) => x + 1;
    const asyncMultiply = async (x) => x * 2;
    
    const pipeline = pipe(asyncAdd, asyncMultiply);
    const result = await pipeline(5);
    
    expect(result).toBe(12);
  });

  test('should preserve function execution order', () => {
    const log = [];
    const fn1 = (x) => { log.push('fn1'); return x; };
    const fn2 = (x) => { log.push('fn2'); return x; };
    const fn3 = (x) => { log.push('fn3'); return x; };
    
    const pipeline = pipe(fn1, fn2, fn3);
    pipeline('test');
    
    expect(log).toEqual(['fn1', 'fn2', 'fn3']);
  });
});