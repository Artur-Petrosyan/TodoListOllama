export const tools = {
		add: ({ text }, state) => {
				return [
						...state,
						{
								id: state.length + 1,
								number: state.length + 1,
								text
						}
				];
		},

		remove: ({ number }, state) => {
				if (!number) return state;
				return state.filter(t => t.number !== number);
		},

		update: ({ number, text }, state) => {
				return state.map(t =>
							t.number === number
										? { ...t, text }
										: t
				);
		},

		list: (state) => {
				if (!state.length) return "Todo list is empty";
				return state.map(t => `${t.number}. ${t.text}`).join("\n");
		}
};