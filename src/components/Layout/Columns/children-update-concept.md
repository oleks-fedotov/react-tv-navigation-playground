calculate left, right for each element


4 modifications: 


- add elements on the left
    - mark to update left-right in componentDidUpdate
    - when updating left-right in componentDidUpdate
        - check if element at 0 position has "update" flag
        - then set a flag to shift already rendered elements
        - udpate left-right of existing elements by some accumulatedWidth
- remove elements on the left
    - update left-right of existing elements (decrease by the last removed element right value)
    - clean childrenStyles array
- add elements on the right
    - mark to update left-right in componentDidUpdate
- remove elements on the right
    - clean childrenStyles array


childrenStyles make array of objects

{
    id: string/number,
    left: number,
    right: number,
    shouldCalculatePosition: boolean
}

