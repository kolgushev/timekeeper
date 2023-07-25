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
import {
	FaPause,
	FaPlay,
	FaTimes as FaXmark,
	FaHistory as FaResetTimer,
	FaPlus,
	FaMinus,
} from 'react-icons/fa'

/**
 * These types already exist and are supported in ECMA2023, but are not recognized in Typescript by default.
 */
declare global {
	interface Array<T> {
		/**
		 * Removes and returns the spliced elements from the array.
		 *
		 * @param {number} start - The index to start splicing from.
		 * @param {number} deleteCount - The number of elements to remove.
		 * @param {T[]} items - The elements to insert in place of the spliced elements.
		 * @returns {T[]} The spliced elements.
		 */
		toSpliced(start: number, deleteCount?: number, ...items: T[]): T[]

		/**
		 * Returns a new array with the element at the specified index replaced with the given value.
		 *
		 * @param {number} index - The index of the element to replace.
		 * @param {T} value - The new value of the element.
		 * @returns {T[]} A new array with the replaced element.
		 */
		with(index: number, value: T): T[]
	}
}

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

const MINUTE = 60
const HOUR = MINUTE * 60

const formatTime = (elapsed: number, includeHours?: boolean) =>
	`${
		Math.abs(elapsed) < 3600 && !includeHours ? '' : `${getHours(elapsed)}:`
	}${getMinutes(elapsed)}:${getSeconds(elapsed)}`

const TimeAddButton: FC<{
	time: number
	onActivated: (time: number) => void
	active: boolean
}> = (props) => {
	return (
		<button
			className={`h-7 mx-1 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] ${
				props.active
					? 'focus-visible:outline-emerald-300'
					: 'focus-visible:outline-emerald-400'
			}`}
			onClick={() => props.onActivated(props.time)}
		>
			{props.time >= 0 ? '+' : ''}
			{Math.floor(props.time / MINUTE)}
		</button>
	)
}

const TimeAddButtonMenu: FC<{
	active: boolean
	onTimeAdd: (time: number) => void
}> = (props) => {
	const timeValues = [
		-MINUTE,
		-MINUTE * 5,
		-MINUTE * 30,
		-HOUR,
		MINUTE,
		MINUTE * 5,
		MINUTE * 30,
		HOUR,
	]
	return (
		<div className="mx-2 grid grid-rows-2 grid-cols-4 gap-1">
			{timeValues.map((timeValue, index) => (
				<TimeAddButton
					key={index}
					active={props.active}
					time={timeValue}
					onActivated={props.onTimeAdd}
				></TimeAddButton>
			))}
		</div>
	)
}

const Task: FC<
	PropsWithChildren<{
		color: number
		active: boolean
		elapsed: number
		onReset: () => void
		onAdd: (time: number) => void
		onActivate: () => void
		onRemove: () => void
	}>
> = (props) => {
	const [isMenuShown, setIsMenuShown] = useState(false)

	const onShowMenu = () => {
		setIsMenuShown(!isMenuShown)
	}

	const onTimeAdd = (time: number) => {
		props.onAdd(time)
	}

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

			{/* Time Add button */}
			{isMenuShown && (
				<TimeAddButtonMenu
					active={isMenuShown}
					onTimeAdd={onTimeAdd}
				></TimeAddButtonMenu>
			)}
			{/* reset button */}
			<button
				className={`w-7 h-7 p-1 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] ${
					props.active
						? 'focus-visible:outline-emerald-300'
						: 'focus-visible:outline-emerald-400'
				}`}
				onClick={() => props.onReset()}
			>
				<FaResetTimer className="transition-[outline-color]" />
			</button>
			{/* Time Add button */}
			<button
				className={`w-7 h-7 p-1 mx-2 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] ${
					props.active
						? 'focus-visible:outline-emerald-300'
						: 'focus-visible:outline-emerald-400'
				}`}
				onClick={onShowMenu}
			>
				{isMenuShown ? (
					<FaMinus className="transition-[outline-color]" />
				) : (
					<FaPlus className="transition-[outline-color]" />
				)}
			</button>
			{/* timer */}
			<div className="text-center text-4xl font-mono font-bold mx-4 flex-none inline-block">
				{formatTime(props.elapsed, isMenuShown)}
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
	const [lastActiveId, setLastActiveId] = initState<number>('lastActiveId', 0)

	const activate = (index: number) => {
		setActiveId(index)
		setLastActiveId(index === -1 ? 0 : index)
	}

	const pushTasks = (...added: TaskData[]) => {
		activate(tasks.length + added.length - 1)
		setTasks([...tasks, ...added])
		setTimers([...timers, 0])
	}

	/**
	 * Removes a task from the list of tasks, given its index
	 * @param {number} index - index of the task to be removed
	 */
	const removeTask = (index: number) => {
		// If the active task is the one being removed, deactivate it
		if (activeId === index) setActiveId(-1)
		// If the active task is after the one being removed, shift it back by one
		else if (activeId > index) setActiveId(activeId - 1)

		// Do the same for the last active task
		if (lastActiveId === index) setLastActiveId(0)
		else if (lastActiveId > index) setLastActiveId(lastActiveId - 1)

		// Remove the task and its corresponding timer
		setTasks(tasks.toSpliced(index, 1))
		setTimers(timers.toSpliced(index, 1))
	}

	// run the active timer
	useEffect(() => {
		let now = Date.now()

		const timer = setInterval(() => {
			if (activeId >= 0)
				setTimers(
					timers.with(
						activeId,
						timers[activeId] + (Date.now() - now) * 0.001,
					),
				)

			now = Date.now()
		}, 1000)

		return () => clearInterval(timer)
	})

	// pause the timer when spacebar is pressed
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === ' ') {
				// check that the user isn't using any form inputs
				if (
					event.target instanceof HTMLInputElement ||
					event.target instanceof HTMLButtonElement
				)
					return

				if (activeId === -1) setActiveId(lastActiveId)
				else setActiveId(-1)

				event.preventDefault()
			}
		}

		document.addEventListener('keydown', onKeyDown)

		return () => {
			document.removeEventListener('keydown', onKeyDown)
		}
	})

	const tasksParsed = tasks.map(({ name, color }, id) => (
		<TaskContainer active={activeId === id} key={id}>
			<Task
				color={color}
				active={activeId === id}
				elapsed={timers[id]}
				onReset={() => setTimers(timers.with(id, 0))}
				onAdd={(time) =>
					setTimers(timers.with(id, Math.max(timers[id] + time, 0)))
				}
				onActivate={() =>
					activeId === id ? setActiveId(-1) : activate(id)
				}
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
			{/* top cumulative time section */}
			<div className="overflow-x-auto overflow-y-hidden row-span-1 grid grid-flow-col place-items-center justify-center">
				{/* reset button */}
				<button
					className="w-32 h-32 outline-2 outline-transparent rounded-md flex justify-center justify-items-center items-center transition-[outline-color] focus-visible:outline-emerald-400"
					onClick={() => setTimers(timers.map(() => 0))}
				>
					<FaResetTimer className="transition-[outline-color] w-24 h-24" />
				</button>
				{/* timer */}
				<div className="text-center text-9xl font-mono font-bold mx-4 flex-none inline-block">
					{formatTime(timers.reduce((a, b) => a + b, 0), true)}
				</div>
			</div>
			<div className="overflow-x-hidden overflow-y-auto m-4 p-2 row-span-5 rounded-md dark:bg-neutral-600 drop-shadow-lg">
				<div className="w-full h-auto m-4 ml-8 text-5xl font-bold font-ridge">
					Tasks
				</div>
				<div
					id="tasklist"
					className="m-4 grid grid-cols-1 2xl:grid-cols-2 grid-flow-row gap-4"
				>
					{tasksParsed}
					<TaskContainer active={false}>
						<TaskInput onFormSubmit={onFormSubmit}></TaskInput>
					</TaskContainer>
				</div>
			</div>
		</>
	)
}

const Header: FC<PropsWithChildren> = (props) => {
	return <>{props.children}</>
}

const taskList = createRoot(
	document.getElementsByTagName('main')[0] as HTMLElement,
)

taskList.render(
	<Header>
		<TaskList />
	</Header>,
)
