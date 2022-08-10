<template>
  <t-form
    v-bind="$attrs"
    id="business-common-form"
    ref="formRef"
    :data="data"
    :rules="rules"
    :label-width="labelWidth"
    reset-type="initial"
    @submit="confirm"
  >
    <t-form-item
      v-for="(field, idx) in fieldList"
      :key="field.value"
      :label="field.label"
      :name="field.value"
      :label-width="field.labelWidth"
    >
      <template #label>
        <template v-if="field.scopedSlotsLabel">
          <slot :name="field.scopedSlotsLabel" />
        </template>
        <template v-else-if="field.label">{{ field.label }}</template>
      </template>
      <template v-if="$slots[field.scopedSlots]">
        <slot :name="field.scopedSlots" />
      </template>
      <template v-else>
        <span v-if="field.prefix" :class="field.prefixClass">{{ field.prefix }}</span>
        <component
          v-model="data[field.value]"
          v-bind="getProps(field)"
          v-on="field.on"
          :clearable="field.type !== 'password'"
          :field="field"
          :list-info="listInfo"
          :is="field.component || 't-input'"
          @clear="clear"
        />
        <span v-if="field.suffix" :class="field.suffixClass">{{ field.suffix }}</span>
      </template>
    </t-form-item>
    <slot></slot>
    <template v-if="$slots.actions">
      <t-form-item>
        <slot name="actions" v-bind="{ ref: $refs }" />
      </t-form-item>
    </template>
    <template v-else>
      <t-form-item :label-width="actionAlign.indexOf('center') > -1 ? '0' : undefined">
        <div class="flex form-action wp-100" :class="{ 'dialog-actions': dialog }">
          <div
            class="wp-100"
            :class="{
              'row-reverse': actionAlign.indexOf('right') > -1,
              'justify-center': actionAlign.indexOf('center') > -1
            }"
          >
            <t-button type="submit" class="ml-10">
              {{ confirmText }}
            </t-button>
            <t-button v-show="!hiddenCancel" theme="default" @click="cancel">
              {{ cancelText }}
            </t-button>
          </div>
        </div>
      </t-form-item>
    </template>
  </t-form>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  labelWidth: {
    type: String,
    default: 'auto'
  },
  // 表单数据
  data: {
    type: Object
  },
  // 相关字段
  fieldList: {
    type: Array
  },
  // 验证规则
  rules: {
    type: Object
  },
  // 相关的列表
  listInfo: {
    type: Object
  },
  // 确认的文集
  confirmText: {
    type: String,
    default: '查询'
  },
  // 重置的文字
  cancelText: {
    type: String,
    default: '重置'
  },
  actionAlign: {
    type: String,
    default: 'left'
  },
  dialog: {
    type: Boolean
  },
  hiddenCancel: {
    type: Boolean
  }
})
const emit = defineEmits(['confirm', 'cancel', 'clear'])

const formRef = ref()
function getProps({ component, label, extraProps }) {
  const compProps = { ...(extraProps || {}) }
  if (!compProps.placeholder) {
    const isInput = !component || component === 't-input'
    compProps.placeholder = isInput ? `请输入${label}` : `请选择${label}`
  }
  return compProps
}

async function validate() {
  return formRef.value.validate()
}
async function confirm() {
  const validateResult = await validate()
  if (validateResult === true) {
    emit('confirm')
  }
}
function cancel() {
  formRef.value.reset()
  emit('cancel')
}
function clear(...rest) {
  emit('cancel', ...rest)
}
</script>

<style lang="scss">
#business-common-form {
  .input-text-left input {
    text-align: left;
  }
}
.form-action {
  .el-button {
    margin: 0 5px;
  }
}
.dialog-actions {
  width: 100%;
  justify-content: flex-end;
}
</style>