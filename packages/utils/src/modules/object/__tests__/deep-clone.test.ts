import { deepClone, isComplexDataType } from '../deep-clone';

describe('deepClone', () => {
  describe('isComplexDataType', () => {
    it('should return true for objects', () => {
      expect(isComplexDataType({})).toBe(true);
      expect(isComplexDataType({ a: 1 })).toBe(true);
    });

    it('should return true for arrays', () => {
      expect(isComplexDataType([])).toBe(true);
      expect(isComplexDataType([1, 2, 3])).toBe(true);
    });

    it('should return true for functions', () => {
      expect(isComplexDataType(function() {})).toBe(true);
      expect(isComplexDataType(() => {})).toBe(true);
    });

    it('should return false for primitive types', () => {
      expect(isComplexDataType(null)).toBe(false);
      expect(isComplexDataType(undefined)).toBe(false);
      expect(isComplexDataType(42)).toBe(false);
      expect(isComplexDataType('string')).toBe(false);
      expect(isComplexDataType(true)).toBe(false);
      expect(isComplexDataType(Symbol('test'))).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should handle primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(false)).toBe(false);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should handle Date objects', () => {
      const date = new Date('2023-01-01');
      const clonedDate = deepClone(date);

      expect(clonedDate).toEqual(date);
      expect(clonedDate).not.toBe(date);
      expect(clonedDate instanceof Date).toBe(true);
    });

    it('should handle RegExp objects', () => {
      const regex = /test/g;
      const clonedRegex = deepClone(regex);

      expect(clonedRegex).toEqual(regex);
      expect(clonedRegex).not.toBe(regex);
      expect(clonedRegex instanceof RegExp).toBe(true);
    });

    it('should handle plain objects', () => {
      const obj = {
        a: 1,
        b: 'string',
        c: true,
        d: null,
        e: undefined,
        f: {
          nested: 'value'
        }
      };

      const clonedObj = deepClone(obj);

      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.f).not.toBe(obj.f);
    });

    it('should handle arrays', () => {
      const arr = [1, 'string', true, null, undefined, [1, 2, 3]];
      const clonedArr = deepClone(arr);

      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr);
      expect(clonedArr[5]).not.toBe(arr[5]);
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      const clonedObj = deepClone(obj);

      expect(clonedObj.a).toBe(1);
      expect(clonedObj.self).toBe(clonedObj);
      expect(clonedObj).not.toBe(obj);
    });

    it('should handle nested circular references', () => {
      const obj1: any = { a: 1 };
      const obj2: any = { b: 2 };
      obj1.ref = obj2;
      obj2.ref = obj1;

      const clonedObj1 = deepClone(obj1);

      expect(clonedObj1.a).toBe(1);
      expect(clonedObj1.ref.b).toBe(2);
      expect(clonedObj1.ref.ref).toBe(clonedObj1);
    });

    it('should preserve object prototypes', () => {
      class Person {
        constructor(public name: string) {}
        greet() {
          return `Hello, ${this.name}`;
        }
      }

      const person = new Person('John');
      const clonedPerson = deepClone(person);

      expect(clonedPerson.name).toBe('John');
      expect(clonedPerson.greet()).toBe('Hello, John');
      expect(clonedPerson instanceof Person).toBe(true);
      expect(clonedPerson).not.toBe(person);
    });

    it('should handle properties with symbols', () => {
      const sym = Symbol('test');
      const obj: any = { a: 1 };
      obj[sym] = 'symbol value';

      const clonedObj = deepClone(obj);

      expect(clonedObj.a).toBe(1);
      expect(clonedObj[sym]).toBe('symbol value');
    });

    it('should handle non-enumerable properties', () => {
      const obj: any = { a: 1 };
      Object.defineProperty(obj, 'b', {
        value: 2,
        enumerable: false
      });

      const clonedObj = deepClone(obj);

      expect(clonedObj.a).toBe(1);
      expect(clonedObj.b).toBe(2);
    });

    it('should handle functions (shallow copy)', () => {
      const fn = function() { return 'test'; };
      const obj = {
        method: fn,
        arrow: () => 'arrow'
      };

      const clonedObj = deepClone(obj);

      expect(clonedObj.method).toBe(fn);
      expect(clonedObj.arrow).toBe(obj.arrow);
      expect(clonedObj.method()).toBe('test');
      expect(clonedObj.arrow()).toBe('arrow');
    });

    it('should handle complex nested structures', () => {
      const complexObj = {
        number: 42,
        string: 'test',
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        array: [1, 2, { nested: 'value' }],
        object: {
          nested: {
            deep: {
              value: 'found'
            }
          }
        },
        date: new Date('2023-01-01'),
        regex: /pattern/g,
        emptyArray: [],
        emptyObject: {}
      };

      const clonedObj = deepClone(complexObj);

      expect(clonedObj).toEqual(complexObj);
      expect(clonedObj).not.toBe(complexObj);
      expect(clonedObj.array).not.toBe(complexObj.array);
      expect(clonedObj.array[2]).not.toBe(complexObj.array[2]);
      expect(clonedObj.object).not.toBe(complexObj.object);
      expect(clonedObj.object.nested).not.toBe(complexObj.object.nested);
      expect(clonedObj.date).not.toBe(complexObj.date);
      expect(clonedObj.regex).not.toBe(complexObj.regex);
    });

    it('should handle empty objects and arrays', () => {
      expect(deepClone({})).toEqual({});
      expect(deepClone([])).toEqual([]);
      expect(deepClone({})).not.toBe({});
      expect(deepClone([])).not.toBe([]);
    });

    it('should handle Map and Set objects', () => {
      const set = new Set([1, 2, 3]);
      const map = new Map([['key', 'value']]);

      const clonedSet = deepClone(set);
      const clonedMap = deepClone(map);

      expect(clonedSet).toEqual(set);
      expect(clonedMap).toEqual(map);
      expect(clonedSet).not.toBe(set);
      expect(clonedMap).not.toBe(map);
    });
  });
});