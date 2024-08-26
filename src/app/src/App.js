import './App.css';
import {useState, useEffect} from 'react';
import {apiRequest} from './api';

export function App() {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchTodos = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiRequest('todos');
			setTodos(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const todoData = {title: newTodo};
		setNewTodo('');
		try {
			await apiRequest('todos/', 'POST', todoData);
			alert("todo added successfully")
			await fetchTodos()
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="App">
			<div>
				<h1>List of TODOs</h1>
				{loading && <p>Loading...</p>}
				{error && <p className="error">{error}</p>}
				<ul>
					{todos.map((todo, idx) => (
						<li key={idx}>{todo.title}</li>
					))}
				</ul>
			</div>
			<div>
				<h1>Create a ToDo</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="todo">ToDo: </label>
						<input
							type="text"
							id="todo"
							value={newTodo}
							onChange={(e) => setNewTodo(e.target.value)}
							required
						/>
					</div>
					<div className="form-actions">
						<button type="submit" disabled={loading}>Add ToDo!</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default App;
