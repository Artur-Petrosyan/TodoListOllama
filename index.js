import ollama from "ollama";
import { systemMessage } from "./systemMessage.js";
import { tools } from "./tools.js";
import fs from "fs";

const TODOS_FILE = "./todos.json";

const loadTodos = () => {
		try {
				return JSON.parse(fs.readFileSync(TODOS_FILE, "utf8"));
		} catch {
				return [];
		}
};

const saveTodos = (todos) => {
		fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
};
let todos = loadTodos();

const toolExecutor = (parsedRes) => {

		const executeObj = {
				add: () => {
						todos = tools.add(parsedRes.action, todos);
						console.log(todos);
						return saveTodos(todos);
				},
				remove: () => {
						todos = tools.remove(parsedRes.action, todos);
						return saveTodos(todos);
				},
				update: () => {
						todos = tools.update(todos);
						return saveTodos(todos);
				},
				list: () => {
						const allTodos = tools.list(todos)
						console.log(allTodos);
						return allTodos
				}
		};

		if (parsedRes.tool) {
				return executeObj[parsedRes.tool]();
		}
};

const getOllamaResponse = async (userMessage) => {
		const ollamaMessages = [
				{
						role: "system",
						content: systemMessage
				},
				{
						role: "user",
						content: userMessage
				}
		];

		const response = await ollama.chat({
				model: "mistral",
				messages: ollamaMessages,
				stream: false
		});

		const parsedRes = JSON.parse(response.message.content);
		toolExecutor(parsedRes);
};

getOllamaResponse("give me all todos");
