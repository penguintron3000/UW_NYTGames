# Research Report
## React for Beginners

### Summary

Created a React project from scratch and relearned the syntax and tools of the React framework

### Motivation

Relearn React for frontend. Learning tools and syntax will help make code more simple/readable.

### Time Spent

~30 minutes practicing guide
~120 minutes reading/writing notes

### Results

Before creating React project:

- using typescript

- Structure of React
- App <- components <- child objects

- download node.js most recent version
- https://nodejs.org/en/download/package-manager

- using vscode

- using vite to create react app

go to terminal:
- npm create vite@latest
- framework -> react
- language -> typescript

to run app locally on machine:
- go to vscode
- open a terminal inside vscode
- run npm install
- run npm dev
- go to localhost:XXXX


to create a new component
- create a new file, add name and file type
- end the component with export default NAME; to use throughout project
- main function will be the one named after the file
- capitalize the file or other classes won't recognize the file

Syntax inside JSX XML blocks
- use {} to denote variables/functions, {} also allows you to enter JSX code into these blocks, where it would only allow "HTML" otherwise
	- if using {} for conditionals, must use CONDITION ? THEN : ELSE syntax
- only 1 element can be returned at a time. If you want to return more than one, you can use something like <div> to group elements, or use <> to save extra element space
- items that are dynamically created through means such as arrays would need to have keys using "key = XXXX" as an extension to the elements

Events
- onClick

useState
- why useState? To properly reflect visual updates on the website whenever a variables changes. Updates would not happen otherwise unless the page is refreshed
- const [var, setVar] = useState(element)
- var is a variable, while setVar is a function that allows you to change var
- you can reference var or setVar simply by treating them as variables or functions, except var cannot be changed unless through the setVar function
- element would be the initial value of the var

Props
- similar purpose to useState, updates visuals upon change
- define props in an interface
- interface nameProps{ varName : elementType; var2Name : element2Type; }
- insert props: nameProps in parameter, or you can change props to {varName, var2Name} if you do not want to use the convention in the line below
- refer to the props variables with props.varName, etc. 
- prop functions will be defined in the brackets as nameFunction: (X) => Y;
- these act as extensions too, but the extensions are added to their component element <Component varName = ...>
- immutable

React Developer Tools
- download React Developer Tools from Google Chrome plugins
- access through inspect element -> Components or -> Profiler
- useful for looking at output details

Context
- Lets us pass data through classes without needing to pass props
- How to do it?
	- Create a context
		- create a new file and import { createContext } from 'react'
		- export const filename = createContext(value);
	- Access context through the class receiving it
		- import { useContext } from 'react'
		- import { filename } from './filename.js'
		- declare const var = useContext(filename) and replace any props
	- Apply
		- Provide context value in <filename> wrapper 
- recommends to start with props, only use useContext if you have to pass props through many classes

### Sources
- https://www.youtube.com/watch?v=SqcY0GlETPk summarized
- https://cs571.org/\
- https://react.dev/learn/passing-data-deeply-with-context