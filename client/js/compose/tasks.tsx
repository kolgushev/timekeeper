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
	selection: boolean
	selectedColor?: number
	onSelected?: (color: number) => void
}> = (props) => {
	const dotColor = getDotColor(props.color)

	return (
		<div
			onClick={() => props.onSelected?.(props.color)}
			className={`${
				props.selection ? 'p-1 w-7' : 'mr-2 w-5'
			} h-full inline-flex justify-center justify-items-center items-center`}
		>
			<div
				className={`${
					props.selection
						? props.color === props.selectedColor
							? 'w-5 h-5'
							: 'w-4 h-4'
						: 'w-3.5 h-3.5'
				} rounded-full border-2 transition-[width,height] ${dotColor}`}
			></div>
		</div>
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
				<div className="w-max inline-block m-2">
					<input
						id="prompt"
						type="text"
						autoFocus
						placeholder="New Task"
						value={taskName}
						onChange={(event) => setTaskName(event.target.value)}
					/>
				</div>
				{/* Radio-style color selection */}
				<Dot
					color={0}
					selection={true}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={1}
					selection={true}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={2}
					selection={true}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				<Dot
					color={3}
					selection={true}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				></Dot>
				{/* Start button */}
				<input type="submit" value="Add" className="m-2" />
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
			className={`text-center text-2xl w-full p-4 flex flex-row justify-stretch items-center border-2 rounded-xl transition-colors ${
				props.active
					? 'bg-neutral-700 border-neutral-500 drop-shadow-xl'
					: 'bg-neutral-500 border-neutral-500 drop-shadow-md'
			}`}
		>
			{/* colored dot */}
			<Dot color={props.color} selection={false}></Dot>
			<div className="text-left mr-3 basis-0 flex-1 text-ellipsis overflow-hidden inline-block">
				{props.children}
			</div>
			<div
				className="button w-14 h-14 self-end !rounded-full shadow-lg flex justify-center justify-items-center items-center"
				onClick={props.onActivate}
			>
				{props.active ? <FaPause></FaPause> : <FaPlay></FaPlay>}
			</div>
		</div>
	)
}

interface TaskData {
	name: string
	color: number
	elapsed: number
}

class TaskList extends Component {
	state: {
		tasks: TaskData[]
		activeId: number
	} = {
		tasks: [],
		activeId: -1,
	}

	pushTasks(...tasks: TaskData[]) {
		this.setState({
			tasks: [...this.state.tasks, ...tasks],
			activeId: this.state.tasks.length + tasks.length - 1,
		})
	}

	setActiveId(id: number) {
		this.setState({
			activeId: this.state.activeId === id ? -1 : id,
			tasks: this.state.tasks,
		})
	}

	render() {
		const tasks = this.state.tasks.map(({ name, color }, id) => (
			<Task
				color={color}
				active={this.state.activeId === id}
				onActivate={() => this.setActiveId(id)}
				key={id}
			>
				{name}
			</Task>
		))

		const onFormSubmit = (name: string, color: number) =>
			this.pushTasks({
				name,
				color,
				elapsed: 0,
			})

		return (
			<>
				{tasks}
				<TaskInput onFormSubmit={onFormSubmit}></TaskInput>
			</>
		)
	}
}

taskList.render(<TaskList></TaskList>)
