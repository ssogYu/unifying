import { isEmpty } from '../is-empty';

describe('isEmpty', () => {
  describe('Default behavior', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n\r')).toBe(true);
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return true for empty Set and Map', () => {
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(new Map())).toBe(true);
    });

    it('should return true for NaN', () => {
      expect(isEmpty(NaN)).toBe(true);
    });

    it('should return true for invalid Date', () => {
      const invalidDate = new Date('invalid');
      expect(isEmpty(invalidDate)).toBe(true);
    });

    it('should return true for empty ArrayBuffer and TypedArray', () => {
      expect(isEmpty(new ArrayBuffer(0))).toBe(true);
      expect(isEmpty(new Uint8Array(0))).toBe(true);
      expect(isEmpty(new Int16Array(0))).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
      expect(isEmpty('test'));
    });

    it('should return false for numbers (including 0)', () => {
      expect(isEmpty(42)).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(-1)).toBe(false);
      expect(isEmpty(3.14)).toBe(false);
    });

    it('should return false for boolean values', () => {
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([0])).toBe(false);
      expect(isEmpty([''])).toBe(false);
      expect(isEmpty([null, undefined])).toBe(false);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty({ key: null })).toBe(false);
      expect(isEmpty({ '': '' })).toBe(false);
    });

    it('should return false for non-empty Set and Map', () => {
      expect(isEmpty(new Set([1]))).toBe(false);
      expect(isEmpty(new Map([['key', 'value']]))).toBe(false);
    });

    it('should return false for valid Date', () => {
      const validDate = new Date('2023-01-01');
      expect(isEmpty(validDate)).toBe(false);
    });

    it('should return false for RegExp', () => {
      expect(isEmpty(/test/)).toBe(false);
      expect(isEmpty(/^test$/g)).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isEmpty(function() {})).toBe(false);
      expect(isEmpty(() => {})).toBe(false);
      expect(isEmpty(function test() { return 1; })).toBe(false);
    });

    it('should return false for Promise', async () => {
      const promise = Promise.resolve();
      expect(isEmpty(promise)).toBe(false);

      // 捕获 rejected Promise 以避免测试报错
      const promise2 = Promise.reject(new Error('test')).catch(() => {});
      expect(isEmpty(promise2)).toBe(false);
    });

    it('should return false for non-empty ArrayBuffer and TypedArray', () => {
      expect(isEmpty(new ArrayBuffer(8))).toBe(false);
      expect(isEmpty(new Uint8Array([1, 2, 3]))).toBe(false);
      expect(isEmpty(new Int16Array([1, 2]))).toBe(false);
    });

    it('should return false for Symbol', () => {
      expect(isEmpty(Symbol('test'))).toBe(false);
      expect(isEmpty(Symbol.iterator)).toBe(false);
    });
  });

  describe('Options configuration', () => {
    describe('trimString option', () => {
      it('should trim strings by default', () => {
        expect(isEmpty('   ')).toBe(true);
        expect(isEmpty('\t\n\r')).toBe(true);
        expect(isEmpty(' hello ')).toBe(false);
      });

      it('should not trim strings when trimString is false', () => {
        expect(isEmpty('   ', { trimString: false })).toBe(false);
        expect(isEmpty('\t\n\r', { trimString: false })).toBe(false);
        expect(isEmpty('', { trimString: false })).toBe(true);
        expect(isEmpty(' hello ', { trimString: false })).toBe(false);
      });
    });

    describe('zeroAsEmpty option', () => {
      it('should not treat 0 as empty by default', () => {
        expect(isEmpty(0)).toBe(false);
      });

      it('should treat 0 as empty when zeroAsEmpty is true', () => {
        expect(isEmpty(0, { zeroAsEmpty: true })).toBe(true);
        expect(isEmpty(-0, { zeroAsEmpty: true })).toBe(true);
        expect(isEmpty(0.0, { zeroAsEmpty: true })).toBe(true);
        expect(isEmpty(1, { zeroAsEmpty: true })).toBe(false);
      });
    });

    describe('falseAsEmpty option', () => {
      it('should not treat false as empty by default', () => {
        expect(isEmpty(false)).toBe(false);
      });

      it('should treat false as empty when falseAsEmpty is true', () => {
        expect(isEmpty(false, { falseAsEmpty: true })).toBe(true);
        expect(isEmpty(true, { falseAsEmpty: true })).toBe(false);
      });
    });

    describe('nanAsEmpty option', () => {
      it('should treat NaN as empty by default', () => {
        expect(isEmpty(NaN)).toBe(true);
      });

      it('should not treat NaN as empty when nanAsEmpty is false', () => {
        expect(isEmpty(NaN, { nanAsEmpty: false })).toBe(false);
      });
    });

    describe('deep option', () => {
      it('should perform shallow check by default', () => {
        expect(isEmpty([[], {}, ''])).toBe(false);
        expect(isEmpty({ a: [], b: {} })).toBe(false);
        expect(isEmpty(new Set([[], {}]))).toBe(false);
        expect(isEmpty(new Map([['a', []], ['b', {}]]))).toBe(false);
      });

      it('should perform deep check when deep is true', () => {
        expect(isEmpty([[], {}, ''], { deep: true })).toBe(true);
        expect(isEmpty([[''], {}], { deep: true })).toBe(true);
        expect(isEmpty([[], { key: 'value' }], { deep: true })).toBe(false);

        expect(isEmpty({ a: [], b: {} }, { deep: true })).toBe(true);
        expect(isEmpty({ a: [], b: { key: 'value' } }, { deep: true })).toBe(false);

        expect(isEmpty(new Set([[], {}]), { deep: true })).toBe(true);
        expect(isEmpty(new Set([[], { key: 'value' }]), { deep: true })).toBe(false);

        expect(isEmpty(new Map([['a', []], ['b', {}]]), { deep: true })).toBe(true);
        expect(isEmpty(new Map([['a', []], ['b', { key: 'value' }]]), { deep: true })).toBe(false);
      });

      it('should handle nested deep checks', () => {
        expect(isEmpty([[[[]]]], { deep: true })).toBe(true);
        expect(isEmpty([[[['value']]]], { deep: true })).toBe(false);

        expect(isEmpty({ a: { b: { c: {} } } }, { deep: true })).toBe(true);
        expect(isEmpty({ a: { b: { c: { key: 'value' } } } }, { deep: true })).toBe(false);
      });
    });

    describe('customValidator option', () => {
      it('should use custom validator when provided', () => {
        const customValidator = (value: unknown) => value === 'custom-empty';

        expect(isEmpty('custom-empty', { customValidator })).toBe(true);
        expect(isEmpty('other value', { customValidator })).toBe(false);
        expect(isEmpty(null, { customValidator })).toBe(true); // Default null check still applies
      });

      it('should prioritize custom validator over other checks', () => {
        const customValidator = (value: unknown) =>
          typeof value === 'string' && value.includes('special');

        expect(isEmpty('special-value', {
          trimString: false,
          customValidator
        })).toBe(true);

        expect(isEmpty('special', {
          zeroAsEmpty: true,
          falseAsEmpty: true,
          customValidator
        })).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle complex nested structures with deep option', () => {
      const complexData = {
        level1: {
          level2: {
            level3: {
              emptyArray: [],
              emptyObject: {},
              emptyString: ''
            }
          }
        },
        alsoEmpty: new Set([[], {}, new Map()])
      };

      expect(isEmpty(complexData, { deep: true })).toBe(true);
    });

    it('should handle mixed arrays with deep option', () => {
      expect(isEmpty([0, false, ''], {
        deep: true,
        zeroAsEmpty: true,
        falseAsEmpty: true
      })).toBe(true);

      expect(isEmpty([0, false, 'value'], {
        deep: true,
        zeroAsEmpty: true,
        falseAsEmpty: true
      })).toBe(false);
    });

    it('should handle Date objects correctly', () => {
      const validDate = new Date('2023-01-01');
      const invalidDate = new Date('invalid');

      expect(isEmpty(validDate)).toBe(false);
      expect(isEmpty(invalidDate)).toBe(true);
    });

    it('should handle ArrayBuffer views correctly', () => {
      const buffer1 = new ArrayBuffer(0);
      const buffer2 = new ArrayBuffer(8);
      const typedArray1 = new Uint8Array(0);
      const typedArray2 = new Uint8Array([1, 2, 3]);

      expect(isEmpty(buffer1)).toBe(true);
      expect(isEmpty(buffer2)).toBe(false);
      expect(isEmpty(typedArray1)).toBe(true);
      expect(isEmpty(typedArray2)).toBe(false);
    });

    it('should handle all options together', () => {
      const testData = {
        zeroValue: 0,
        falseValue: false,
        whitespace: '   ',
        nested: {
          emptyArray: [],
          nullValue: null
        }
      };

      const result = isEmpty(testData, {
        zeroAsEmpty: true,
        falseAsEmpty: true,
        trimString: true,
        deep: true
      });

      expect(result).toBe(true);
    });
  });

  describe('Type checking functions', () => {
    it('should handle class instances', () => {
      class TestClass {
        constructor(public value: string = '') {}
      }

      const emptyInstance = new TestClass('');
      const nonEmptyInstance = new TestClass('value');

      expect(isEmpty(emptyInstance)).toBe(false); // Class instances are not plain objects
      expect(isEmpty(nonEmptyInstance)).toBe(false);
    });

    it('should handle objects created with Object.create', () => {
      const nullProtoObj = Object.create(null);
      const plainObj = Object.create({});

      expect(isEmpty(nullProtoObj)).toBe(true);
      expect(isEmpty(plainObj)).toBe(true);
    });

    it('should handle objects with only non-enumerable properties', () => {
      const obj: any = {};
      Object.defineProperty(obj, 'hidden', {
        value: 'value',
        enumerable: false
      });

      expect(isEmpty(obj)).toBe(true); // No enumerable properties
    });
  });
});