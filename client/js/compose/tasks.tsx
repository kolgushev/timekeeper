import {
	FC,
	ReactElement,
	FormEventHandler,
	useState,
	PropsWithChildren,
	Component,
} from 'react'
import { createRoot } from 'react-dom/client'
import { FaPause, FaPlay } from 'react-icons/fa'

// Render your React component instead
const taskList = createRoot(document.getElementById('tasklist') as HTMLElement)

const getDotColor = (color: number) => {
	switch (color) {
		default:
		case 0:
			return 'border-red-400 bg-red-700'
		case 1:
			return 'border-amber-400 bg-amber-700'
		case 2:
			return 'border-emerald-400 bg-emerald-700'
		case 3:
			return 'border-sky-400 bg-sky-700'
	}
}

const Dot: FC<{
	color: number
	selectedColor: number
	onSelected: (color: number) => void
}> = (props) => {
	const dotColor = getDotColor(props.color)

	return (
		<button
			onClick={(ev) => {
				props.onSelected?.(props.color)
				ev.preventDefault()
			}}
			className="p-1 w-7 h-full inline-flex justify-center justify-items-center items-center group"
			tabIndex={1}
		>
			<div
				className={`${
					props.color === props.selectedColor ? 'w-5 h-5' : 'w-4 h-4'
				} rounded-full border-2 transition-[width,height,border-color] group-focus-visible:border-white ${dotColor}`}
			></div>
		</button>
	)
}

const TaskInput: FC<{
	onFormSubmit: (taskName: string, color: number) => void
}> = (props) => {
	const [taskName, setTaskName] = useState('')
	const [color, setColor] = useState(0)

	const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		const trimmed = taskName.trim()
		if (trimmed !== '') {
			props.onFormSubmit(trimmed, color)

			// reset form
			setTaskName('')
		}

		// place focus back on textbox
		document.getElementById('prompt')?.focus()

		event.preventDefault()
	}

	return (
		<>
			<hr></hr>
			<form onSubmit={onFormSubmit} className="text-center w-auto">
				{/* Radio-style color selection */}
				<Dot
					color={0}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={1}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={2}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={3}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				{/* text input */}
				<div className="w-max inline-block m-2">
					<input
						id="prompt"
						type="text"
						autoFocus
						placeholder="New Task"
						value={taskName}
						onChange={(event) => setTaskName(event.target.value)}
						tabIndex={2}
					/>
				</div>
				{/* Start button */}
				<input type="submit" value="Add" className="m-2" tabIndex={3} />
			</form>
		</>
	)
}

const Task: FC<
	PropsWithChildren<{
		color: number
		active: boolean
		onActivate: () => void
	}>
> = (props) => {
	return (
		<div
			className={`text-center text-2xl w-full p-4 flex flex-row justify-stretch items-center border-2 rounded-xl transition ${
				props.active
					? 'bg-neutral-500 border-neutral-400 drop-shadow-xl -translate-y-1'
					: 'bg-neutral-700 border-neutral-700 drop-shadow-md'
			}`}
		>
			{/* colored dot */}
			<div className="mr-2 w-5 h-full inline-flex justify-center justify-items-center items-center group">
				<div
					className={`w-3.5 h-3.5 rounded-full border-2 transition-[width,height,border-color] group-focus-visible:border-white ${getDotColor(
						props.color,
					)}`}
				></div>
			</div>
			{/* text */}
			<div className="text-left mr-3 basis-0 flex-1 text-ellipsis overflow-hidden inline-block">
				{props.children}
			</div>
			{/* play button */}
			<button
				className="button w-14 h-14 self-end !rounded-full shadow-lg flex justify-center justify-items-center items-center"
				onClick={props.onActivate}
			>
				{props.active ? <FaPause></FaPause> : <FaPlay></FaPlay>}
			</button>
		</div>
	)
}

interface TaskData {
	name: string
	color: number
	elapsed: number
}

const TaskList: FC = () => {
	const [tasks, setTasks] = useState<TaskData[]>([])
	const [activeId, setActiveId] = useState<number>(-1)

	const pushTasks = (...added: TaskData[]) => {
		setActiveId(tasks.length + added.length - 1)
		setTasks([...tasks, ...added])
	}

	const tasksParsed = tasks.map(({ name, color }, id) => (
		<Task
			color={color}
			active={activeId === id}
			onActivate={() => setActiveId(activeId === id ? -1 : id)}
			key={id}
		>
			{name}
		</Task>
	))

	const onFormSubmit = (name: string, color: number) =>
		pushTasks({
			name,
			color,
			elapsed: 0,
		})

	return (
		<>
			{tasksParsed}
			<TaskInput onFormSubmit={onFormSubmit}></TaskInput>
		</>
	)
}

taskList.render(<TaskList></TaskList>)
