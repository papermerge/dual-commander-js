

class DualHistory {
    /* pushes new states to window.history object
     left and right here refer to different things depending on
     the context.
    In context of dual commander panels left/right refers to left respectively
    right panel (which might be viewer or commander).
    In context of history/location objects, left is `location.path` WITHOUT parameter
    list and right is actually the parameter list.
    */
    push_left() {
    }

    push_right() {

    }
}

export { DualHistory };