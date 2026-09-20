import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  console.log('执行了')
  const body = await readBody(event)
  const { content } = body

  if (!content) {
    return {
      success: false,
      message: '请提供富文本内容'
    }
  }

  const timestamp = Date.now()
  const fileName = `${timestamp}.html`
  const filePath = join(process.cwd(), 'public', fileName)

  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated HTML</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`

  try {
    await writeFile(filePath, htmlContent, 'utf-8')
    return {
      success: true,
      message: 'HTML 文件生成成功',
      fileName,
      url: `/${fileName}`
    }
  } catch (error) {
    return {
      success: false,
      message: '文件写入失败',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
})
