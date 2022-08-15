// 校验必填项
export const validateRequired = (message, trigger = 'blur', type = 'error') => ({
  required: true,
  message,
  type,
  trigger,
})

// 校验数组必填项
export const validateArrayRequired = (...rest) => ({
  type: 'array',
  ...validateRequired(...rest),
})

// 校验日期必填项
export const validateDateRequired = (...rest) => ({
  type: 'date',
  ...validateRequired(...rest),
})
