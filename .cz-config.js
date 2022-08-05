module.exports = {
  types: [
    {
      value: 'WIP',
      name: '💪 待完成: 研发中的提交备份'
    },
    {
      value: 'feat',
      name: '✨ 新功能: 新增加一个功能'
    },
    {
      value: 'fix',
      name: '🐞 修复: 一个 bug 修复'
    },
    {
      value: 'refactor',
      name: '🔨 重构: 不涉及修复bug和新功能开发的代码更改'
    },
    {
      value: 'docs',
      name: '📚 文档: 只有文档发生改变'
    },
    {
      value: 'test',
      name: '🏁 测试: 添加缺少的测试或更正现有的测试'
    },
    {
      value: 'chore',
      name: '🎫 构建: 修改持续集成的配置文件和脚本'
    },
    {
      value: 'style',
      name: '💅 style: 代码风格修改，不影响代码含义的更改（空格、格式、缺少分号等）'
    },
    {
      value: 'revert',
      name: '⏪ 撤销: 撤销一个历史提交'
    }
  ],
  messages: {
    type: '选择你提交的信息类型：',
    scope: '\n选择一个 scope（可选）：',
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：\n',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
    confirmCommit: '确认提交？'
  },
  // 选择本次提交的改变所影响的范围
  scopes: [
    ['projects', '项目搭建'],
    ['components', '组件相关'],
    ['views', '页面相关'],
    ['hooks', 'hook 相关'],
    ['utils', 'utils 相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['other', '其他修改'],
    ['custom', '以上都不是？我要自定义']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  // 当您想要覆盖特定提交类型的范围时使用此选项。
  scopeOverrides: {},
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  breaklineChar: '|'
}
