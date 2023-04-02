export const setClipboard = async (text) => {
  const type = "text/plain";

  const blob = new Blob([text], { type });

  const data = [new ClipboardItem({
    [type]: blob
  })];

  const result = await navigator.clipboard.write(data);
  return result
}
