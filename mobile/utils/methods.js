
export const generateId = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 24 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(24)
  })
}
