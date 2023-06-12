import {
	FC,
	ReactElement,
	FormEventHandler,
	PropsWithChildren,
	Component,
	useState,
	useEffect,
} from 'react'
import { createRoot } from 'react-dom/client'
// TODO: Figure out how to use FA6 for FAXMark to work
import { FaPause, FaPlay, FaTimes as FaXmark, FaHistory as FaResetTimer } from 'react-icons/fa'

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
			className="p-1 w-8 h-8 inline-flex justify-center justify-items-center items-center place-items-center group"
			tabIndex={1}
		>
			<div
				className={`${
					props.color === props.selectedColor
						? 'w-6 h-6 translate-y-[.1875rem]'
						: 'w-4 h-4'
				} rounded-full border-2 transition-[width,height,border-color,transform] duration-75 ease-linear group-focus-visible:border-white ${dotColor}`}
			></div>
		</button>
	)
}

const TaskInput: FC<{
	onFormSubmit: (taskName: string, color: number) => void
}> = (props) => {
	const [taskName, setTaskName] = useState('')
	const [color, setColor] = useState(0)

	const onFormSubmit: FormEventHandler<HTMLElement> = (event) => {
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
			<form onSubmit={onFormSubmit} className="text-center w-auto">
				{/* Radio-style color selection */}
				<Dot
					color={0}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				/>
				<Dot
					color={1}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				/>
				<Dot
					color={2}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				/>
				<Dot
					color={3}
					selectedColor={color}
					onSelected={(color) => setColor(color)}
				/>
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

const pad = (num: number) => Math.floor(num).toString().padStart(2, '0')
const getSeconds = (elapsed: number) => pad(elapsed % 60)
const getMinutes = (elapsed: number) => pad((elapsed / 60) % 60)
const getHours = (elapsed: number) => pad(elapsed / 3600)

const formatTime = (elapsed: number) =>
	`${elapsed < 3600 ? '' : `${getHours(elapsed)}:`}${getMinutes(
		elapsed,
	)}:${getSeconds(elapsed)}`

const Task: FC<
	PropsWithChildren<{
		color: number
		active: boolean
		elapsed: number
		onReset: () => void
		onActivate: () => void
		onRemove: () => void
	}>
> = (props) => {
	return (
		<>
			{/* remove button */}
			<button
				className={`w-7 h-7 p-2 mr-2 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] ${
					props.active
						? 'focus-visible:outline-emerald-300'
						: 'focus-visible:outline-emerald-400'
				}`}
				onClick={props.onRemove}
			>
				<FaXmark className="transition-[outline-color]" />
			</button>
			{/* colored dot */}
			<div className="mr-2 w-5 h-full inline-flex justify-center justify-items-center items-center group">
				<div
					className={`w-4 h-4 rounded-full border-2 transition-[width,height,border-color] group-focus-visible:border-white ${getDotColor(
						props.color,
					)}`}
				></div>
			</div>
			{/* text */}
			<div className="text-left mr-3 whitespace-nowrap basis-0 flex-1 text-ellipsis overflow-hidden inline-block">
				{props.children}
			</div>
			{/* reset button */}
			<button
				className={`w-7 h-7 p-1 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] ${
					props.active
						? 'focus-visible:outline-emerald-300'
						: 'focus-visible:outline-emerald-400'
				}`}
				onClick={props.onReset}
			>
				<FaResetTimer className="transition-[outline-color]" />
			</button>
			{/* timer */}
			<div className="text-center text-4xl font-mono font-bold mx-4 flex-none inline-block">
				{formatTime(props.elapsed)}
			</div>
			{/* play button */}
			<button
				className={`button w-14 h-14 justify-self-end !rounded-full shadow-lg flex justify-center justify-items-center items-center ${
					props.active
						? 'bg-emerald-500 border-emerald-400 focus-visible:border-emerald-100'
						: 'bg-emerald-600 border-emerald-600 focus-visible:border-emerald-300'
				}`}
				onClick={props.onActivate}
			>
				{props.active ? <FaPause /> : <FaPlay />}
			</button>
		</>
	)
}

const TaskContainer: FC<PropsWithChildren<{ active: boolean }>> = (props) => {
	return (
		<div
			className={`row-span-1 col-span-1 text-center text-2xl w-full p-4 flex flex-row justify-stretch items-center border-2 rounded-xl transition ${
				props.active
					? 'bg-neutral-500 border-neutral-400 drop-shadow-xl -translate-y-1'
					: 'bg-neutral-700 border-neutral-700 drop-shadow-md'
			}`}
		>
			{props.children}
		</div>
	)
}

interface TaskData {
	name: string
	color: number
}

const initState = <T extends unknown>(
	name: string,
	defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const stored = localStorage.getItem(name)

	const [state, setState] = useState<T>(
		stored === null ? defaultValue : JSON.parse(stored),
	)

	// update local storage when values update
	useEffect(() => {
		localStorage.setItem(name, JSON.stringify(state))
	}, [state])

	return [state, setState]
}

const TaskList: FC = () => {
	const [tasks, setTasks] = initState<TaskData[]>('tasks', [])
	const [timers, setTimers] = initState<number[]>('timers', [])
	const [activeId, setActiveId] = initState<number>('activeId', -1)

	// run the active timer
	useEffect(() => {
		const timer = setInterval(() => {
			if (activeId >= 0)
				setTimers(timers.with(activeId, timers[activeId] + 1))
		}, 1000)

		return () => clearInterval(timer)
	})

	const pushTasks = (...added: TaskData[]) => {
		setActiveId(tasks.length + added.length - 1)
		setTasks([...tasks, ...added])
		setTimers([...timers, 0])
	}

	const removeTask = (index: number) => {
		if (activeId === index) setActiveId(-1)
		setTasks(tasks.toSpliced(index, 1))
		setTimers(timers.toSpliced(index, 1))
	}

	const tasksParsed = tasks.map(({ name, color }, id) => (
		<TaskContainer active={activeId === id} key={id}>
			<Task
				color={color}
				active={activeId === id}
				elapsed={timers[id]}
				onReset={() => setTimers(timers.with(id, 0))}
				onActivate={() => setActiveId(activeId === id ? -1 : id)}
				onRemove={() => removeTask(id)}
				key={id}
			>
				{name}
			</Task>
		</TaskContainer>
	))

	const onFormSubmit = (name: string, color: number) =>
		pushTasks({
			name,
			color,
		})

	return (
		<>
			{tasksParsed}
			<TaskContainer active={false}>
				<TaskInput onFormSubmit={onFormSubmit}></TaskInput>
			</TaskContainer>
		</>
	)
}

const Header: FC<PropsWithChildren> = (props) => {
	return (
		<>
			{/* top cumulative time section */}
			<div className="overflow-x-auto overflow-y-hidden row-span-1"></div>
			<div className="overflow-x-hidden overflow-y-auto m-4 p-2 row-span-5 rounded-md dark:bg-neutral-600 drop-shadow-lg">
				<div className="w-full h-auto m-4 ml-8 text-5xl font-bold font-ridge">
					Tasks
				</div>
				<div
					id="tasklist"
					className="m-4 grid grid-cols-1 xl:grid-cols-2 grid-flow-row gap-4"
				>
					{props.children}
				</div>
			</div>
		</>
	)
}

// Render your React component instead
const taskList = createRoot(
	document.getElementsByTagName('main')[0] as HTMLElement,
)

taskList.render(
	<Header>
		<TaskList />
	</Header>,
)
