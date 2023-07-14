import { DialogPlugin } from 'tdesign-vue-next'

export const pythonExpressionTip = `表达式使用 Python 语法进行取值，统一使用 obj 作为数据源。`
export const pythonExpression = `{
    "user_count": 99,
    "user_list": [
        {
            "username": "alex",
            "age": 18
        },
        {
            "username": "kim",
            "age": 22
        },
        {
            "username": "test",
            "age": 24
        }
    ]
}

# 取"user_count"的值表达式如下
obj.get("user_count")

# 取"user_list"的第一个user表达式如下
obj.get("user_list")[0]

# 取"user_list"的第二个user的username表达式如下
obj.get("user_list")[1].get("username")

# 取"user_list"的第三个user的age表达式如下
obj.get("user_list")[2].get("age")`

export const helpDialog = (body, header = '提示', width = 800) => {
  const alertDia = DialogPlugin.alert({
    body,
    header,
    width,
    closeBtn: false,
    confirmBtn: {
      content: '关闭',
      variant: 'base',
      theme: 'default',
    },
    placement: 'center',
    destroyOnClose: true,
    onConfirm: () => {
      alertDia.hide()
    },
    onClose: () => {
      alertDia.hide()
    },
  })
}
