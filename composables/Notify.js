export const useNotify = () => {
  const toast = useToast()

  const notify = (title, description, icon) => {
    toast.add({
      title: title,
      description: description,
      icon: icon ?? 'i-heroicons-check-circle',
      timeout: 0
    })
  }
  return { notify }
}
