# `@unifying/utils`

一个轻量级、高性能的 JavaScript/TypeScript 工具库，提供常用的工具函数。

## 特性

- 🚀 **轻量级**: 小巧精简，按需导入
- 📦 **TypeScript 支持**: 完整的 TypeScript 类型定义
- 🧪 **测试覆盖**: 完整的单元测试覆盖
- 🔧 **模块化**: 支持多种模块格式 (ESM, CommonJS, UMD)
- 🌳 **Tree Shaking**: 支持按需引入，减少打包体积

## 安装

```bash
npm install @unifying/utils
# 或
yarn add @unifying/utils
# 或
pnpm add @unifying/utils
```

## 使用

```javascript
// ES6 模块
import { deepClone, isEmpty, sleep } from '@unifying/utils';

// CommonJS
const { deepClone, isEmpty, sleep } = require('@unifying/utils');
```

## API 文档

### Object 模块

#### `deepClone(sourceData)`

深拷贝函数，支持各种复杂类型的深拷贝，包括循环引用的处理。

```javascript
import { deepClone } from '@unifying/utils';

const obj = { a: 1, b: { c: 2 } };
const clonedObj = deepClone(obj);
```

**特性:**
- 支持原始类型、对象、数组
- 支持 Date、RegExp、Map、Set 等内置对象
- 处理循环引用
- 保持原型链

#### `isEmpty(value, options?)`

判断值是否为空的通用工具函数，支持多种配置选项。

```javascript
import { isEmpty } from '@unifying/utils';

// 基础使用
isEmpty(null);              // true
isEmpty(undefined);         // true
isEmpty('');                // true
isEmpty([]);                // true
isEmpty({});                // true

// 配置选项
isEmpty(0, { zeroAsEmpty: true });        // true
isEmpty(false, { falseAsEmpty: true });   // true
isEmpty([[], {}], { deep: true });        // true
```

**配置选项:**
- `trimString` (boolean): 是否将空格字符串视为空 (默认: true)
- `zeroAsEmpty` (boolean): 是否将 0 视为空 (默认: false)
- `falseAsEmpty` (boolean): 是否将 false 视为空 (默认: false)
- `nanAsEmpty` (boolean): 是否将 NaN 视为空 (默认: true)
- `deep` (boolean): 是否检查嵌套对象 (默认: false)
- `customValidator` (function): 自定义空值判断函数

#### `formatObject(obj)`

格式化对象，去除空键值对，支持嵌套对象处理。

```javascript
import { formatObject } from '@unifying/utils';

const obj = {
  a: 1,
  b: '',
  c: {
    d: null,
    e: 'hello'
  }
};

const cleanedObj = formatObject(obj);
// 结果: { a: 1, c: { e: 'hello' } }
```

### Sleep 模块

#### `sleep(time)`

延迟函数，返回一个在指定时间后 resolve 的 Promise。

```javascript
import { sleep } from '@unifying/utils';

async function example() {
  console.log('开始');
  await sleep(1000); // 延迟 1 秒
  console.log('1秒后执行');
}
```

**参数:**
- `time` (number): 延迟时间（毫秒）

### Browser 模块

#### `canUseDOM()`

检测是否可以使用 DOM，即是否在浏览器环境中运行。

```javascript
import { canUseDOM, isBrowser } from '@unifying/utils';

if (canUseDOM()) {
  // 浏览器环境代码
  console.log('运行在浏览器中');
}

// 或者使用便捷变量
if (isBrowser) {
  console.log('浏览器环境');
}
```

#### `isBrowser`

便捷的布尔值，表示当前是否在浏览器环境中。

## 开发

```bash
# 安装依赖
yarn install

# 构建
yarn build

# 运行测试
yarn test

# 监听模式测试
yarn test:watch

# 生成测试覆盖率报告
yarn test:coverage
```

## License

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.14
- 添加完整的单元测试覆盖
- 优化 deepClone 函数性能
- 完善 TypeScript 类型定义
