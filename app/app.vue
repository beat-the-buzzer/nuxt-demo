<template>
  <div>
    <div ref="editorRef" class="editor-container"></div>
    <button @click="handleGenerateHtml">生成HTML</button>
    <div v-if="result" :class="result.success ? 'success' : 'error'">
      {{ result.message }}
      <span v-if="result.url">文件路径: {{ result.url }}</span>
    </div>
  </div>
</template>

<script setup>
const result = ref(null)
const editorRef = ref(null)
let editor = null

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (window.tinymce) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initEditor = () => {
  window.tinymce.init({
    target: editorRef.value,
    height: 400,
    menubar: 'file edit view insert format tools table help',
    plugins: 'lists link image table code wordcount',
    toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code',
    setup: (ed) => {
      editor = ed
    }
  })
}

onMounted(async () => {
  await loadScript('https://cdn.bootcdn.net/ajax/libs/tinymce/7.9.3/tinymce.min.js')
  initEditor()
})

onBeforeUnmount(() => {
  if (editor) {
    editor.remove()
  }
})

const handleGenerateHtml = async () => {
  const richTextContent = editor ? editor.getContent() : ''

  try {
    const response = await fetch('/api/generate-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: richTextContent })
    })
    result.value = await response.json()
  } catch (error) {
    result.value = {
      success: false,
      message: '请求失败: ' + (error instanceof Error ? error.message : '未知错误')
    }
  }
}
</script>

<style scoped>
.editor-container {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #379a6b;
}

.success {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}
</style>
