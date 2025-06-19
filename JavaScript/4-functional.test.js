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


describe('branch function', () => {
  test('should execute correct branch based on request property', () => {
    const mockDomestic = jest.fn((req) => ({ ...req, processed: 'domestic' }));
    const mockInternational = jest.fn((req) => ({ ...req, processed: 'international' }));
    
    const brancher = branch({
      type: {
        domestic: mockDomestic,
        international: mockInternational
      }
    });
    
    const request = { type: 'domestic', amount: 100 };
    const result = brancher(request);
    
    expect(mockDomestic).toHaveBeenCalledWith(request);
    expect(mockInternational).not.toHaveBeenCalled();
    expect(result.processed).toBe('domestic');
  });

  test('should work with different branch keys', () => {
    const mockHandlerA = jest.fn((req) => ({ ...req, result: 'A' }));
    const mockHandlerB = jest.fn((req) => ({ ...req, result: 'B' }));
    
    const brancher = branch({
      category: {
        typeA: mockHandlerA,
        typeB: mockHandlerB
      }
    });
    
    const request = { category: 'typeB', data: 'test' };
    const result = brancher(request);
    
    expect(mockHandlerB).toHaveBeenCalledWith(request);
    expect(mockHandlerA).not.toHaveBeenCalled();
    expect(result.result).toBe('B');
  });

  test('should throw error when no matching way found', () => {
    const brancher = branch({
      type: {
        domestic: (req) => req,
        international: (req) => req
      }
    });
    
    const request = { type: 'unknown', amount: 100 };
    
    expect(() => brancher(request)).toThrow('No matching way found');
  });

  test('should throw error when property is missing', () => {
    const brancher = branch({
      type: {
        domestic: (req) => req,
        international: (req) => req
      }
    });
    
    const request = { amount: 100 }; // missing 'type' property
    
    expect(() => brancher(request)).toThrow('No matching way found');
  });

  test('should work with complex branch handlers', () => {
    const complexHandler = pipe(
      (req) => ({ ...req, step1: true }),
      (req) => ({ ...req, step2: true })
    );
    
    const brancher = branch({
      workflow: {
        complex: complexHandler,
        simple: (req) => ({ ...req, simple: true })
      }
    });
    
    const request = { workflow: 'complex', id: 1 };
    const result = brancher(request);
    
    expect(result).toEqual({
      workflow: 'complex',
      id: 1,
      step1: true,
      step2: true
    });
  });

  test('should handle numeric keys', () => {
    const brancher = branch({
      status: {
        1: (req) => ({ ...req, result: 'active' }),
        0: (req) => ({ ...req, result: 'inactive' })
      }
    });
    
    const result = brancher({ status: 1 });
    expect(result.result).toBe('active');
  });

  test('should handle boolean keys', () => {
    const brancher = branch({
      isActive: {
        true: (req) => ({ ...req, result: 'enabled' }),
        false: (req) => ({ ...req, result: 'disabled' })
      }
    });
    
    const result = brancher({ isActive: true });
    expect(result.result).toBe('enabled');
  });
});