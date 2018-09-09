Lazy rendering

configurable props
- initial render set
    - loop over specified amount of children and render them
- second step rendering
    - render the rest of the data
    - cases:
        - there is data left
            - render and specify links to navigation right
        - there is NO data left
            - do nothing




Wrapper to control rendering steps

    Counts current focused index on every update

    Props to configure
        - initial render size
        - min amount on right
        - min amount on left
        - NavigationComponentRender
            - pass children prop to it


    Check for right/left limit inside componentDidUpdate
        - Fetch more elements when needed
            - getNextBatch
            - getPrevBatch
        - Each fetch triggers update of the component




HOC for lazy loading

Extend ColumnsComponent

- fetchElementsLeft
- fetchElementsRight
- checkLeftLimit
- checkRightLimit

Example:

Input props:
- left limit - 5
- right limit - 10
- initial set - 10
- selected index - 3

Initial render
0 0 0 0 0 0 0 0 0
      ^

ComponentDidUpdate
onMoveRight ->
    props.checkRightLimit()
    && this.props.fetchElementsRight()

onMoveLeft ->
    props.checkLeftLimit()
    && this.props.fetchElementsLeft()

Update of selected index should work without changes.

Create new refs array.

Key calculation should be adjusted to use id, not indexes.
