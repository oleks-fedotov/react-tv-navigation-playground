# react-tv-redux-navigation

## The main goal of the project

Predictable and inspectable focus management for [LRUD user input](https://medium.com/netflix-techblog/pass-the-remote-user-input-on-tv-devices-923f6920c9a8).

Intead of traversing through the tree of React components, the completely different approach was applied in this project. 

The core idea is that each focusable component knows about its neighbours, hence has a reference to them. To support the navigation process the system only needs to have a reference to the current focused element, then when the user input is handled get the neighbour reference for the corresponding direction and make this neighbour the next focused element.

## Core building blocks


## Focused state management