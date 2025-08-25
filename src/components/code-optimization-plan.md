# 代码优化计划

## 当前代码分析

### 1. 排序算法模块 (sort.ts)

**问题分析：**
- 代码风格不一致（var/let/const混用）
- 缺少类型注解
- 算法实现可以优化
- 缺少错误处理
- 测试用例不完整

**优化建议：**

```typescript
// 优化后的排序类
export class Sort {
  /**
   * 快速排序 - 优化版本
   * 时间复杂度: O(n log n) 平均, O(n²) 最坏
   * 空间复杂度: O(log n)
   */
  static quickSort<T>(arr: T[]): T[] {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    
    return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
  }

  /**
   * 冒泡排序 - 优化版本
   * 时间复杂度: O(n²)
   * 空间复杂度: O(1)
   */
  static bubbleSort<T>(arr: T[]): T[] {
    const result = [...arr];
    const len = result.length;
    let swapped = false;
    
    for (let i = 0; i < len - 1; i++) {
      swapped = false;
      for (let j = 0; j < len - 1 - i; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
          swapped = true;
        }
      }
      if (!swapped) break; // 提前退出优化
    }
    
    return result;
  }

  /**
   * 插入排序 - 优化版本
   * 时间复杂度: O(n²)
   * 空间复杂度: O(1)
   */
  static insertionSort<T>(arr: T[]): T[] {
    const result = [...arr];
    
    for (let i = 1; i < result.length; i++) {
      const current = result[i];
      let j = i - 1;
      
      while (j >= 0 && result[j] > current) {
        result[j + 1] = result[j];
        j--;
      }
      result[j + 1] = current;
    }
    
    return result;
  }

  /**
   * 最大乘积 - 优化版本
   * 时间复杂度: O(n)
   * 空间复杂度: O(1)
   */
  static maxProduct(arr: number[]): number {
    if (!arr.length) return 0;
    
    let max = arr[0];
    let imax = 1;
    let imin = 1;
    
    for (const num of arr) {
      if (num < 0) {
        [imax, imin] = [imin, imax];
      }
      
      imax = Math.max(imax * num, num);
      imin = Math.min(imin * num, num);
      max = Math.max(max, imax);
    }
    
    return max;
  }

  /**
   * 括号匹配验证 - 优化版本
   * 时间复杂度: O(n)
   * 空间复杂度: O(n)
   */
  static isValidParentheses(str: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = {
      ')': '(',
      ']': '[',
      '}': '{'
    };
    
    for (const char of str) {
      if (pairs[char]) {
        if (stack.pop() !== pairs[char]) {
          return false;
        }
      } else {
        stack.push(char);
      }
    }
    
    return stack.length === 0;
  }
}
```

### 2. 工作流处理模块 (workflowHandle.ts)

**问题分析：**
- 类过于庞大（546行）
- 方法职责不清晰
- 缺少错误处理
- 硬编码较多
- 测试方法混乱

**优化建议：**

```typescript
// 拆分后的模块结构
export class WorkflowHandle implements IFlowchartHander {
  // 核心属性
  private readonly flowchart: HanderFlowchart;
  private readonly eventBus: EventBus;
  private readonly stateManager: StateManager;
  
  // 构造函数优化
  constructor(taskId: string) {
    this.taskId = taskId;
    this.flowchart = new HanderFlowchart(this);
    this.eventBus = new EventBus();
    this.stateManager = new StateManager();
    this.initializeEventListeners();
  }

  // 事件处理优化
  private initializeEventListeners(): void {
    this.eventBus.on('node:click', this.handleNodeClick.bind(this));
    this.eventBus.on('node:rightClick', this.handleNodeRightClick.bind(this));
    this.eventBus.on('line:click', this.handleLineClick.bind(this));
  }

  // 节点操作优化
  private handleNodeClick(node: INodeModel): void {
    try {
      this.log(`Node clicked: ${node.key}`);
      this.stateManager.setCurrentNode(node.key);
      this.showNodeSetting(node);
    } catch (error) {
      this.handleError('Node click failed', error);
    }
  }

  // 错误处理统一化
  private handleError(message: string, error: Error): void {
    console.error(message, error);
    this.log(`Error: ${message}`);
    // 可以添加错误上报逻辑
  }
}

// 状态管理类
class StateManager {
  @observable private state = {
    currentNodeKey: '',
    menuPosition: { x: 0, y: 0 },
    menuType: MenuType.NONE,
    showNodeSetting: false
  };

  setCurrentNode(key: string): void {
    this.state.currentNodeKey = key;
  }

  setMenuPosition(x: number, y: number): void {
    this.state.menuPosition = { x, y };
  }
}

// 事件总线
class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}
```

### 3. 实体定义优化 (entity.ts)

**优化建议：**

```typescript
// 基础节点接口
export interface INode {
  key: string;
  type: NodeType;
  label?: string;
  parentKey?: string;
  childKeys?: string[];
  data?: Record<string, any>;
}

// 节点类型枚举优化
export enum NodeType {
  CONDITION = 'ConditionAction',
  BRANCH = 'BranchAction',
  EXTRACT_DATA = 'ExtractDataAction',
  CLICK = 'ClickAction',
  ENTER_CAPTCHA = 'EnterCapachaAction',
  ENTER_TEXT = 'EnterTextAction',
  LOOP = 'LoopAction',
  MOUSE_OVER = 'MouseOverAction',
  NAVIGATE = 'NavigateAction',
  SWITCH_COMBO = 'SwitchCombo2Action'
}

// 节点工厂类
export class NodeFactory {
  static createNode(type: NodeType, key: string, label?: string): INode {
    return {
      key,
      type,
      label: label || key,
      childKeys: [],
      data: {}
    };
  }

  static isValidNodeType(type: string): type is NodeType {
    return Object.values(NodeType).includes(type as NodeType);
  }
}
```

### 4. 测试模块优化

**优化建议：**

```typescript
// 测试工具类
export class TestUtils {
  static generateRandomArray(size: number, min = 0, max = 100): number[] {
    return Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  static measurePerformance<T>(
    fn: () => T, 
    iterations: number = 1000
  ): { result: T; time: number } {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  }
}

// 排序算法测试
describe('Sort Algorithms', () => {
  const testCases = [
    { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
    { input: [1], expected: [1] },
    { input: [], expected: [] },
    { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] }
  ];

  testCases.forEach(({ input, expected }) => {
    test(`quickSort should sort ${JSON.stringify(input)}`, () => {
      expect(Sort.quickSort([...input])).toEqual(expected);
    });

    test(`bubbleSort should sort ${JSON.stringify(input)}`, () => {
      expect(Sort.bubbleSort([...input])).toEqual(expected);
    });
  });
});
```

## 整体架构优化建议

### 1. 模块化重构
- 将大型类拆分为更小的、职责单一的类
- 使用依赖注入模式
- 实现接口隔离原则

### 2. 状态管理优化
- 使用 MobX 的 runInAction 优化异步操作
- 实现状态持久化
- 添加状态变更日志

### 3. 性能优化
- 实现虚拟滚动
- 使用 React.memo 优化组件渲染
- 实现懒加载

### 4. 错误处理
- 统一错误处理机制
- 添加错误边界
- 实现错误上报

### 5. 类型安全
- 完善 TypeScript 类型定义
- 使用严格模式
- 添加运行时类型检查

### 6. 测试覆盖
- 增加单元测试覆盖率
- 添加集成测试
- 实现端到端测试

## 实施计划

1. **第一阶段**: 重构排序算法模块
2. **第二阶段**: 优化工作流处理模块
3. **第三阶段**: 完善测试用例
4. **第四阶段**: 性能优化和错误处理
5. **第五阶段**: 文档完善和代码审查
