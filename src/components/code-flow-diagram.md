# 代码流程图分析

## 项目整体架构

```mermaid
graph TB
    A[App.tsx] --> B[Workflow Component]
    A --> C[Flowchart Component]
    A --> D[Base Components]
    
    B --> E[WorkflowHandle]
    B --> F[WorkflowHelper]
    B --> G[Workflow Menu]
    
    C --> H[FlowchartDiagram]
    C --> I[Diagram Base]
    C --> J[Flowchart Handle]
    
    E --> K[MobX State Management]
    F --> L[Data Processing]
    H --> M[GoJS Diagram]
    
    subgraph "State Management"
        K --> N[Observable Properties]
        K --> O[Reactions]
        K --> P[Actions]
    end
    
    subgraph "Data Flow"
        L --> Q[Node Data]
        L --> R[Link Data]
        L --> S[Model Data]
    end
    
    subgraph "UI Components"
        G --> T[Context Menu]
        G --> U[Node Menu]
        G --> V[Loop Info]
    end
```

## 核心模块数据流

```mermaid
flowchart TD
    A[User Interaction] --> B[WorkflowHandle]
    B --> C[Flowchart Handle]
    C --> D[GoJS Diagram]
    D --> E[Diagram Events]
    E --> F[State Updates]
    F --> G[UI Re-render]
    
    subgraph "Event Handling"
        H[Click Node] --> I[handlerClickNode]
        J[Right Click] --> K[handlerRightClickNode]
        L[Drag Node] --> M[handlerDrag]
        N[Add Node] --> O[handlerAddNode]
    end
    
    subgraph "State Management"
        P[Observable Properties] --> Q[Reactive Updates]
        R[Node Data] --> S[Model Changes]
        T[Menu State] --> U[UI State]
    end
```

## 节点类型和关系

```mermaid
graph LR
    A[ActionNode] --> B[Condition]
    A --> C[Branch]
    A --> D[Loop]
    A --> E[ExtractData]
    A --> F[Click]
    A --> G[EnterText]
    A --> H[Navigate]
    
    subgraph "Node Properties"
        I[key: string]
        J[type: ActionNodeType]
        K[label: string]
        L[parentKey: string]
        M[childKeys: string[]]
        N[data: any]
    end
    
    A --> I
    A --> J
    A --> K
    A --> L
    A --> M
    A --> N
```

## 文件结构关系

```mermaid
graph TD
    A[src/components/] --> B[workflow/]
    A --> C[flowchart/]
    A --> D[base/]
    A --> E[test/]
    
    B --> F[workflowHandle.ts]
    B --> G[workflowHelper.ts]
    B --> H[workflow.tsx]
    B --> I[entity.ts]
    B --> J[menu.tsx]
    
    C --> K[flowchartDiagram.tsx]
    C --> L[diagram.tsx]
    C --> M[handle/index.ts]
    C --> N[model/index.ts]
    C --> O[draw/index.ts]
    
    D --> P[Diagram.tsx]
    D --> Q[Inspector.tsx]
    
    E --> R[sort.ts]
    E --> S[sort.test.ts]
```

## 事件处理流程

```mermaid
sequenceDiagram
    participant U as User
    participant W as WorkflowHandle
    participant F as FlowchartHandle
    participant D as GoJS Diagram
    participant S as State
    
    U->>W: Click Node
    W->>F: handlerClickNode()
    F->>D: Update Selection
    D->>S: Update Observable State
    S->>W: Trigger Re-render
    W->>U: Show Node Menu
    
    U->>W: Right Click Node
    W->>F: handlerRightClickNode()
    F->>D: Get Node Position
    D->>S: Update Menu State
    S->>W: Show Context Menu
```

## 数据转换流程

```mermaid
flowchart LR
    A[Raw Data] --> B[WorkflowHelper.getFlowchartData]
    B --> C[Process Node Data]
    C --> D[Process Link Data]
    D --> E[Create Model]
    E --> F[Initialize Diagram]
    
    subgraph "Data Processing"
        G[Node Type Mapping]
        H[Parent-Child Relationships]
        I[Link Connections]
        J[Data Validation]
    end
    
    C --> G
    C --> H
    D --> I
    E --> J
```

## 状态管理模式

```mermaid
graph TB
    A[MobX Store] --> B[Observable Properties]
    B --> C[Current Node Menu]
    B --> D[Node Selection]
    B --> E[Menu Position]
    B --> F[Flowchart State]
    
    subgraph "Reactive Updates"
        G[Reaction 1: Menu Visibility]
        H[Reaction 2: Node Selection]
        I[Reaction 3: Position Updates]
    end
    
    C --> G
    D --> H
    E --> I
    
    G --> J[UI Update]
    H --> J
    I --> J
```

## 组件通信模式

```mermaid
graph LR
    A[Parent Component] --> B[Props Down]
    B --> C[WorkflowHandle]
    C --> D[Event Up]
    D --> A
    
    subgraph "Component Hierarchy"
        E[Workflow]
        F[FlowchartDiagram]
        G[Diagram]
        H[Menu Components]
    end
    
    E --> F
    F --> G
    E --> H
    
    subgraph "Event Flow"
        I[User Action]
        J[Component Event]
        K[Handler Method]
        L[State Update]
    end
    
    I --> J
    J --> K
    K --> L
```
