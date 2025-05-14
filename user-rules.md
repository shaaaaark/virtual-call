##这个文件是我收集整理以及自己在项目经验中得到的可能有用的rules，仅供参考

##回答规范
1. always answer in Chinese
2. 在agent模式下，涉及文件更改的每一次回答后询问我是否生成当次问答的问答记录文档，如果我不回答则无操作，当我明确回答确认时，新建一个markdown写入根目录的docs/changes目录，直接使用文件操作工具来编辑文档，文档中要记录我给你的问题，以及你的关键改动。文件名格式为‘时间-关键改动描述’，例如：‘2025-04-23-1438-微前端基座改造.md’。时间需要具体到分钟，你将联网或者使用MCP来获取准确时间，并且在创建完文件后反复检查时间戳是否正确。文档中列举涉及到本次改动的所有文件。

##Bash工具
1.采用PowerShell作为Bash工具
2. 安装依赖包默认使用pnpm指令

##编码前的准备
1.以业务需求为导向，使用自然语言描述需求的行为特征，特征应包括特征名称、描述和多个场景（Scenario）
2.每个场景描述一个特定的行为场景，按照 Given-When-Then 的结构编写，明确前提条件、行为动作和预期结果。
  例如：
  Feature: 登录功能
  作为用户，我希望能够登录系统，
  以便访问授权的功能。
3.根据已编写好的特征,必须调用sequential-thinking这个mcp server进行深度拆分需求
4.为特征中的每个步骤编写对应的步骤定义代码。步骤定义是将 Gherkin 语言描述的步骤映射到具体的代码实现
5.根据步骤定义中对行为的描述，编写实际的业务逻辑代码。确保代码能够满足各种场景下的行为要求，并且具有良好的可读性和可维护性。在实现过程中，遵循软件开发的最佳实践，如面向对象设计原则、代码重构等，以提高代码质量和系统的可扩展性。 
6.在代码改动前永远先输出需求分析

## 编程规矩
1. 代码必须遵循SOLID原则
2. 每个函数只干一件事
3. 所有异常必须处理
4. 变量名要说人话（data→userList）
5. 代码就是文档，自己得能看明白
6. 别整太复杂，宁可多写两行
7. 同样的代码出现三次就抽函数
8. 先想边界情况再写主逻辑
9. 绝对禁止魔法数字如 : const item = 3.1567 * anotherItem  ，遇到常量需要抽离成声明如 var CONSTANT_XX = 3.1567，用全大写
10. 如果对使用的框架或者api不熟悉，停止思考提示我补充文档或者更多上下文
11. 编写完ts代码之后，必须生成对应的type定义，尽量不使用any类型

##代码改动规范
在修复问题和新增功能的时候，在所有可选的方案中，永远选择“代码改动最小”的方案。

##mcp调用规范
1. 涉及文件操作，优先使用cursor自带的文件编辑功能，其次才是使用mcp server提供的tools


## 辅助模式
* 看到能复用的代码就提醒我
* 给出不同方案，说优缺点
* 检查代码边界情况

## Git 规范

git 提交记录样例：[type]:[【影响的功能模块】][description]
一个具体的例子：feat:【设备详情】新增订单状态字段
以下是 type 的枚举值：
-feat:新增功能
-fix:修复bug
-docs:文档注释
-style:代码格式(不影响代码运行的变动)
-refactor:重构、优化(既不增加新功能，也不是修复bug)
-perf:性能优化
-test:增加测试
-chore:构建过程或辅助工具的变动
-revert:回退
-build:打包



# 工作流
- 完成代码更改后务必进行类型检查

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

flowchart TD
    PB[projectbrief.md] --> PC[productContext.md]
    PB --> SP[systemPatterns.md]
    PB --> TC[techContext.md]
    
    PC --> AC[activeContext.md]
    SP --> AC
    TC --> AC
    
    AC --> P[progress.md]

### Core Files (Required)
1. `projectbrief.md`
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. `productContext.md`
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. `activeContext.md`
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. `systemPatterns.md`
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. `techContext.md`
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. `progress.md`
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

### Additional Context
Create additional files/folders within memory-bank/ when they help organize:
- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies
- Deployment procedures

## Core Workflows

### Plan Mode
flowchart TD
    Start[Start] --> ReadFiles[Read Memory Bank]
    ReadFiles --> CheckFiles{Files Complete?}
    
    CheckFiles -->|No| Plan[Create Plan]
    Plan --> Document[Document in Chat]
    
    CheckFiles -->|Yes| Verify[Verify Context]
    Verify --> Strategy[Develop Strategy]
    Strategy --> Present[Present Approach]

### Act Mode
flowchart TD
    Start[Start] --> Context[Check Memory Bank]
    Context --> Update[Update Documentation]
    Update --> Execute[Execute Task]
    Execute --> Document[Document Changes]

## Documentation Updates

Memory Bank updates occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank** (MUST review ALL files)
4. When context needs clarification

flowchart TD
    Start[Update Process]
    
    subgraph Process
        P1[Review ALL Files]
        P2[Document Current State]
        P3[Clarify Next Steps]
        P4[Document Insights & Patterns]
        
        P1 --> P2 --> P3 --> P4
    end
    
    Start --> Process

Note: When triggered by **update memory bank**, I MUST review every memory bank file, even if some don't require updates. Focus particularly on activeContext.md and progress.md as they track current state.

REMEMBER: After every memory reset, I begin completely fresh. The Memory Bank is my only link to previous work. It must be maintained with precision and clarity, as my effectiveness depends entirely on its accuracy.