import { useEffect, useRef } from "react";

// native <dialog> needs showModal() for the modal backdrop; React can only set the plain `open` attribute.
export function useDialog(open) {
    const ref = useRef(null);
    useEffect(() => {
        if (open) ref.current.showModal();
        else ref.current.close();
    }, [open]);
    return ref;
}
