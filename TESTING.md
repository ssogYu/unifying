# 单元测试指南

本项目使用 Jest 作为单元测试框架，为 `@unifying/utils` 和 `@unifying/react` 两个工具库提供了完整的测试覆盖。

## 快速开始

### 安装依赖

```bash
yarn install
```

### 运行测试

```bash
# 运行所有测试
yarn test

# 只运行 utils 库测试
yarn test:utils

# 只运行 react 库测试
yarn test:react

# 生成覆盖率报告
yarn test:coverage
```

### 监听模式

```bash
# utils 库监听模式
yarn workspace @unifying/utils run test:watch

# react 库监听模式
yarn workspace @unifying/react run test:watch
```

## 测试结构

### @unifying/utils 测试

```
packages/utils/src/
├── __tests__/
│   └── index.test.ts           # 主入口测试
├── modules/
│   ├── object/
│   │   └── __tests__/
│   │       ├── is-empty.test.ts     # isEmpty 函数测试
│   │       └── deep-clone.test.ts   # deepClone 函数测试
│   └── sleep/
│       └── __tests__/
│           └── index.test.ts        # sleep 函数测试
```

### @unifying/react 测试

```
packages/react/src/
├── __tests__/
│   └── index.test.ts           # 主入口测试
└── hooks/
    └── __tests__/
        ├── use-boolean.test.tsx            # useBoolean hook 测试
        ├── use-callback-ref.test.tsx       # useCallbackRef hook 测试
        ├── use-safe-layout-effect.test.tsx # useSafeLayoutEffect hook 测试
        └── use-effect-custom-async.test.tsx # useEffectCustomAsync hook 测试
```

## 测试覆盖率

项目设置以下覆盖率配置：

- **覆盖率目录**: `coverage/`
- **覆盖率格式**: `text`, `lcov`, `html`
- **覆盖率文件**:
  - 包括所有 `src/**/*.{ts,tsx}` 文件
  - 排除类型声明文件 (`.d.ts`)
  - 排除 index.ts 入口文件

### 覆盖率报告

运行 `yarn test:coverage` 后，可在以下位置查看报告：

- **终端输出**: 简单的文本覆盖率
- **HTML 报告**: `coverage/lcov-report/index.html`
- **Lcov 文件**: `coverage/lcov.info`

## 测试规范

### 命名规范

- 测试文件: `*.test.ts` 或 `*.test.tsx`
- 测试描述使用中文，清晰描述测试目的
- 使用 `describe` 组织相关测试
- 使用 `it` 或 `test` 编写具体测试用例

### 测试结构

```typescript
describe('模块/函数名', () => {
  describe('功能分组', () => {
    it('应该正确处理正常情况', () => {
      // 测试逻辑
    });

    it('应该正确处理边界情况', () => {
      // 测试逻辑
    });
  });
});
```

### 断言最佳实践

- 使用 `expect` 进行断言
- 优先使用具体的匹配器（如 `toBe`, `toEqual`, `toHaveBeenCalled`）
- 异步测试使用 `async/await` 和 `resolves/rejects`

## 常用测试场景

### 工具函数测试

```typescript
import { isEmpty } from '../is-empty';

describe('isEmpty', () => {
  it('应该正确识别空对象', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('应该正确处理配置选项', () => {
    expect(isEmpty(0, { zeroAsEmpty: true })).toBe(true);
  });
});
```

### React Hooks 测试

```typescript
import { renderHook, act } from '@testing-library/react';
import { useBoolean } from '../use-boolean';

describe('useBoolean', () => {
  it('应该正确管理布尔状态', () => {
    const { result } = renderHook(() => useBoolean(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1].on();
    });

    expect(result.current[0]).toBe(true);
  });
});
```

### 异步函数测试

```typescript
describe('异步函数测试', () => {
  it('应该正确处理 Promise', async () => {
    const result = await someAsyncFunction();
    expect(result).toBe(expectedValue);
  });
});
```

## 环境配置

### Jest 配置

- **@unifying/utils**: `jest.config.js`
  - 使用 `ts-jest` 预设
  - 测试环境: `node`
  - 支持 TypeScript

- **@unifying/react**: `jest.config.js`
  - 使用 `ts-jest` 预设
  - 测试环境: `jsdom`
  - 设置文件: `jest.setup.js`
  - 支持 JSX 和 DOM 操作

### 测试库依赖

- **Jest**: 核心测试框架
- **@testing-library/react**: React 组件测试
- **@testing-library/jest-dom**: DOM 断言扩展
- **@testing-library/user-event**: 用户交互模拟

## 调试技巧

### 单个测试文件

```bash
# 运行特定测试文件
yarn workspace @unifying/utils run test -- is-empty.test.ts

# 监听模式
yarn workspace @unifying/react run test:watch -- use-boolean.test.tsx
```

### 调试模式

在测试中使用 `console.log` 或 VS Code 的调试功能：

```typescript
it('调试测试', () => {
  console.log('调试信息:', someValue);
  // 或使用 VS Code 调试器
  debugger;
});
```

### 测试快照

对于 UI 组件，可以使用快照测试：

```typescript
import { render } from '@testing-library/react';

it('应该匹配快照', () => {
  const { asFragment } = render(<SomeComponent />);
  expect(asFragment()).toMatchSnapshot();
});
```

## 持续集成

项目建议在以下时机运行测试：

1. **提交前**: 使用 lint-staged 运行相关测试
2. **Push 后**: 运行完整测试套件
3. **PR 检查**: 必须通过所有测试
4. **发布前**: 确保测试覆盖率达标

## 最佳实践

1. **保持测试独立性**: 每个测试应该独立运行，不依赖其他测试
2. **使用描述性名称**: 测试名称应该清楚地描述测试的目的
3. **测试边界情况**: 除了正常情况，还要测试边界和错误情况
4. **保持测试简洁**: 一个测试只验证一个功能点
5. **使用 Mock**: 对于外部依赖使用 Mock 隔离测试
6. **定期更新**: 随着代码变化，及时更新和维护测试

## 故障排除

### 常见问题

1. **TypeScript 错误**: 确保 ts-jest 配置正确
2. **模块解析问题**: 检查 Jest 的 `modulePathIgnorePatterns` 配置
3. **异步测试超时**: 使用 `act` 包装状态更新
4. **Mock 不生效**: 确保 mock 在正确的时机进行

### 获取帮助

- 查看 Jest 官方文档: https://jestjs.io/docs/getting-started
- 查看 Testing Library 文档: https://testing-library.com/docs/react-testing-library/intro
- 项目Issues: 提交问题到项目仓库