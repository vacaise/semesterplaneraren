
import * as React from "react"

import type {
  Toast,
  ToasterToast,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToasterToastActionType = "add" | "update" | "dismiss" | "remove"

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type UseToastOptions = {
  toasts?: ToasterToast[]
  setToasts?: React.Dispatch<React.SetStateAction<ToasterToast[]>>
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const actionTypes: Record<
  ToasterToastActionType,
  (
    state: ToasterToast[],
    toast: ToasterToast
  ) => ToasterToast[]
> = {
  add: (state, toast) => {
    return [toast, ...state].slice(0, TOAST_LIMIT)
  },
  update: (state, toast) => {
    return state.map((t) => (t.id === toast.id ? { ...t, ...toast } : t))
  },
  dismiss: (state, toast) => {
    return state.map((t) =>
      t.id === toast.id ? { ...t, open: false } : t
    )
  },
  remove: (state, toast) => {
    return state.filter((t) => t.id !== toast.id)
  },
}

export function useToast(opts: UseToastOptions = {}) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>(
    opts.toasts || []
  )

  React.useEffect(() => {
    opts.setToasts?.(toasts)
  }, [opts, opts.setToasts, toasts])

  const dispatchToasts = React.useCallback(
    (action: ToasterToastActionType, toast: ToasterToast) => {
      setToasts((state) => actionTypes[action](state, toast))
    },
    [setToasts]
  )

  const toast = React.useMemo(
    () => ({
      ...opts,
      toast: (props: Toast) => {
        const id = genId()
        const update = (props: ToasterToast) =>
          dispatchToasts("update", { ...props, id })

        const dismiss = () => dispatchToasts("dismiss", { id })

        const t = {
          ...props,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss()
          },
        }

        dispatchToasts("add", t)

        return {
          id,
          dismiss,
          update,
        }
      },
      dismiss: (toastId: string) => {
        dispatchToasts("dismiss", { id: toastId })
      },
      update: (props: ToasterToast) => {
        dispatchToasts("update", props)
      },
    }),
    [dispatchToasts, opts]
  )

  const handleRemove = React.useCallback(
    (toast: ToasterToast) => {
      if (toastTimeouts.has(toast.id)) {
        clearTimeout(toastTimeouts.get(toast.id))
        toastTimeouts.delete(toast.id)
      }

      if (toast.open === false) {
        const timeout = setTimeout(() => {
          dispatchToasts("remove", toast)
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(toast.id, timeout)
      }
    },
    [dispatchToasts]
  )

  React.useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return {
    ...toast,
    toasts,
    handleRemove,
  }
}
