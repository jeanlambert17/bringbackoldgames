export const attempt = async <T = unknown>(req: Promise<T>) => {
  try {
    return await req
    // eslint-disable-next-line
  } catch (err) {
    return null
  }
}

// export const isTimeout = (err: unknown) => {
//   return (
//     !!err &&
//     typeof err === 'object' &&
//     'code' in err &&
//     (err['code'] === ErrorCode.TimeOut || err['code'] === ErrorCode.Aborted)
//   )
// }

// export const isCanceled = (err: unknown) => {
//   return err instanceof CanceledError && err.code === ErrorCode.Canceled
// }

// export const download = (file: string, downloadName?: string) => {
//   fetch(file, { method: 'GET' })
//     .then(res => res.blob())
//     .then(blob => {
//       const a = document.createElement('a')
//       a.style.display = 'none'
//       a.href = URL.createObjectURL(blob)
//       a.setAttribute('download', downloadName ? downloadName : 'pdf-file.pdf')
//       a.click()
//     })
// }
