import { formatObject } from '../format-object';
import { isEmpty } from '../is-empty';

// Mock the isEmpty function to isolate formatObject testing
jest.mock('../is-empty');

const mockedIsEmpty = isEmpty as jest.MockedFunction<typeof isEmpty>;

describe('formatObject', () => {
  beforeEach(() => {
    mockedIsEmpty.mockClear();
  });

  it('should return the same object when no empty values', () => {
    const obj = { a: 1, b: 'test', c: true };
    mockedIsEmpty.mockReturnValue(false);

    const result = formatObject(obj);

    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1, b: 'test', c: true });
    expect(mockedIsEmpty).toHaveBeenCalledTimes(3);
  });

  it('should remove keys with empty values', () => {
    const obj = { a: 1, b: null, c: 'test', d: undefined, e: 0 };
    mockedIsEmpty
      .mockReturnValueOnce(false) // a: 1
      .mockReturnValueOnce(true)  // b: null
      .mockReturnValueOnce(false) // c: 'test'
      .mockReturnValueOnce(true)  // d: undefined
      .mockReturnValueOnce(false); // e: 0

    const result = formatObject(obj);

    expect(result).toEqual({ a: 1, c: 'test', e: 0 });
  });

  it('should handle empty object', () => {
    const obj = {};
    const result = formatObject(obj);

    expect(result).toEqual({});
    expect(mockedIsEmpty).not.toHaveBeenCalled();
  });

  it('should handle object with only empty values', () => {
    const obj = { a: null, b: undefined, c: '' };
    mockedIsEmpty.mockReturnValue(true);

    const result = formatObject(obj);

    expect(result).toEqual({});
  });

  it('should handle nested objects recursively', () => {
    const nestedObj = { x: null, y: 'keep' };
    const obj = {
      a: 1,
      b: nestedObj,
      c: 'test'
    };

    // Setup mock implementation
    mockedIsEmpty.mockImplementation((value) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        return true;
      }
      if (typeof value === 'object' && value !== null) {
        // 检查是否是空对象（没有可枚举属性）
        if (Object.keys(value).length === 0) {
          return true;
        }
        return false; // 对于非空对象返回false
      }
      return false;
    });

    const result = formatObject(obj);

    expect(result).toEqual({
      a: 1,
      b: { y: 'keep' },
      c: 'test'
    });
  });

  it('should handle deeply nested objects', () => {
    const deepNested = {
      level1: {
        level2: {
          empty: null,
          keep: 'value'
        },
        emptyArray: []
      },
      keep: 'top'
    };

    // Setup mock returns for all isEmpty calls
    mockedIsEmpty.mockImplementation((value) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        return true;
      }
      if (typeof value === 'object' && value !== null) {
        return false; // For object type checks
      }
      return false;
    });

    const result = formatObject(deepNested);

    expect(result).toEqual({
      level1: {
        level2: {
          keep: 'value'
        }
      },
      keep: 'top'
    });
  });

  it('should handle arrays within objects', () => {
    const obj = {
      a: [1, 2, 3],
      b: [],
      c: 'test'
    };

    mockedIsEmpty
      .mockReturnValueOnce(false) // a: [1, 2, 3] (object type)
      .mockReturnValueOnce(false) // b: [] (object type)
      .mockReturnValueOnce(false); // c: 'test'

    // For array processing, formatObject doesn't check array elements
    // It only checks if the array itself is "empty"
    mockedIsEmpty
      .mockReturnValueOnce(false); // b: [] would be considered empty in isEmpty

    const result = formatObject(obj);

    // Arrays are not iterated through by formatObject, only checked as objects
    expect(result).toEqual({
      a: [1, 2, 3],
      c: 'test'
    });
  });

  it('should handle Date objects', () => {
    const date = new Date('2023-01-01');
    const obj = {
      validDate: date,
      emptyString: '',
      keepNumber: 42
    };

    mockedIsEmpty.mockImplementation((value) => {
      if (value === '') {
        return true;
      }
      return false;
    });

    const result = formatObject(obj);

    expect(result).toEqual({
      validDate: date,
      keepNumber: 42
    });
  });

  it('should handle objects with Symbol properties', () => {
    const sym = Symbol('test');
    const obj: any = { a: 1 };
    obj[sym] = 'symbol value';
    obj.empty = null;

    mockedIsEmpty.mockImplementation((value) => {
      if (value === null) {
        return true;
      }
      return false;
    });

    const result = formatObject(obj);

    expect(result.a).toBe(1);
    expect(result[sym]).toBe('symbol value');
    expect(result.empty).toBeUndefined();
  });

  it('should handle objects without prototype (Object.create(null))', () => {
    const obj = Object.create(null);
    obj.a = 1;
    obj.b = null;

    mockedIsEmpty
      .mockReturnValueOnce(false) // a: 1
      .mockReturnValueOnce(true);  // b: null

    const result = formatObject(obj);

    expect(result.a).toBe(1);
    expect(result.b).toBeUndefined();
  });

  it('should modify the original object and return it', () => {
    const obj = { a: 1, b: null, c: 'test' };
    mockedIsEmpty
      .mockReturnValueOnce(false) // a: 1
      .mockReturnValueOnce(true)  // b: null
      .mockReturnValueOnce(false); // c: 'test'

    const result = formatObject(obj);

    expect(result).toBe(obj); // Same reference
    expect(obj.b).toBeUndefined(); // Original object is modified
  });

  it('should handle recursive objects with circular references', () => {
    const obj: any = { a: 1, b: null };
    obj.self = obj;

    mockedIsEmpty
      .mockReturnValueOnce(false) // a: 1
      .mockReturnValueOnce(true)  // b: null
      .mockReturnValue(false);    // self: object (prevent infinite recursion in test)

    // This would normally cause infinite recursion, but in the real implementation
    // the isEmpty function should handle circular references
    expect(() => {
      formatObject(obj);
    }).not.toThrow();
  });

  it('should preserve object order', () => {
    const obj = {
      first: 1,
      empty: null,
      second: 2,
      alsoEmpty: undefined,
      third: 3
    };

    mockedIsEmpty
      .mockReturnValueOnce(false) // first
      .mockReturnValueOnce(true)  // empty
      .mockReturnValueOnce(false) // second
      .mockReturnValueOnce(true)  // alsoEmpty
      .mockReturnValueOnce(false); // third

    const result = formatObject(obj);

    const keys = Object.keys(result);
    expect(keys).toEqual(['first', 'second', 'third']);
  });
});