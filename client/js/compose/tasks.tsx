import { FC, ReactElement, FormEventHandler, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactState } from '../lib/reactTypes'

// Render your React component instead
const taskList = createRoot(document.getElementById('tasklist') as HTMLElement)

const TaskInput: FC<{
	onFormSubmit: (taskName: string) => void
}> = (props) => {
	const [taskName, setTaskName] = useState('')

	const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		const trimmed = taskName.trim()
		if (trimmed !== '') {
			props.onFormSubmit(trimmed)

			// reset form
			setTaskName('')
		}

		// place focus back on textbox
		document.getElementById('prompt')?.focus()

		event.preventDefault()
	}

	return (
		<form onSubmit={onFormSubmit} className="text-center w-auto">
			<div className="w-max inline-block">
				<input
					id="prompt"
					type="text"
					autoFocus
					placeholder="New Task"
					value={taskName}
					onChange={(event) => setTaskName(event.target.value)}
				/>
			</div>
			{/* Start button */}
			<input type="submit" value="Add" />
		</form>
	)
}

const TaskList: FC = () => {
	const [tasks, setTasks] = useState<ReactElement[]>([])

	const onFormSubmit = (taskName: string) => {
		// extend tasks array
		setTasks([
			...tasks,
			<div className="text-center text-lg w-full p-4 flex flex-row justify-stretch items-center bg-neutral-500 rounded-xl drop-shadow-md">
				{/* colored dot */}
				<div className="w-3 mr-3 h-full inline-flex justify-center justify-items-center items-center">
					<div className="w-3 h-3 rounded-full border-2 border-red-400 bg-red-700"></div>
				</div>
				<div className="text-left mr-3 flex-grow inline-block">{taskName}</div>
				<div className="button w-10 h-10 self-end !rounded-full drop-shadow-lg"></div>
			</div>,
		])
	}

	return (
		<>
			{tasks}
			<TaskInput onFormSubmit={onFormSubmit}></TaskInput>
		</>
	)
}

taskList.render(<TaskList></TaskList>)