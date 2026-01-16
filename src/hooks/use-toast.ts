import * as React from "react"

export interface ToastProps {
    title: string
    description?: string
    variant?: "default" | "destructive"
}

export function useToast() {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])

    const toast = React.useCallback((props: ToastProps) => {
        // For now, just use alert as a simple fallback
        // In a production app, you'd want a proper toast component
        if (props.variant === "destructive") {
            alert(`Error: ${props.description || props.title}`)
        } else {
            alert(props.description || props.title)
        }
    }, [])

    return { toast, toasts }
}
