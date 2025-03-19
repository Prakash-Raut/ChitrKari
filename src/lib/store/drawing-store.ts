import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DrawingElement, Tool } from "../../types";

interface DrawingState {
	elements: DrawingElement[];
	history: DrawingElement[][];
	historyIndex: number;
	selectedTool: Tool;
	selectedColor: string;
	isDrawing: boolean;
}

interface DrawingActions {
	setElements: (elements: DrawingElement[]) => void;
	addElement: (element: DrawingElement) => void;
	updateElement: (element: DrawingElement) => void;
	setSelectedTool: (tool: Tool) => void;
	setSelectedColor: (color: string) => void;
	setIsDrawing: (isDrawing: boolean) => void;
	undo: () => void;
	redo: () => void;
	clearCanvas: () => void;
}

export type DrawingStore = DrawingState & DrawingActions;

export const useDrawingStore = create<DrawingStore>()(
	persist(
		(set) => ({
			elements: [],
			history: [[]],
			historyIndex: 0,
			selectedTool: "pen",
			selectedColor: "#000000",
			isDrawing: false,

			setElements: (elements) => {
				set((state) => {
					const newHistory = [
						...state.history.slice(0, state.historyIndex + 1),
						elements,
					];
					return {
						elements,
						history: newHistory,
						historyIndex: newHistory.length - 1,
					};
				});
			},

			addElement: (element) => {
				set((state) => {
					const newElements = [...state.elements, element];
					const newHistory = [
						...state.history.slice(0, state.historyIndex + 1),
						newElements,
					];
					return {
						elements: newElements,
						history: newHistory,
						historyIndex: newHistory.length - 1,
					};
				});
			},

			updateElement: (element) => {
				set((state) => {
					const newElements = [...state.elements];
					const index = newElements.findIndex((el) => el.id === element.id);
					if (index !== -1) {
						newElements[index] = element;
					} else {
						newElements.push(element);
					}
					return { elements: newElements };
				});
			},

			setSelectedTool: (tool) => set({ selectedTool: tool }),
			setSelectedColor: (color) => set({ selectedColor: color }),
			setIsDrawing: (isDrawing) => set({ isDrawing }),

			undo: () => {
				set((state) => {
					if (state.historyIndex > 0) {
						return {
							historyIndex: state.historyIndex - 1,
							elements: state.history[state.historyIndex - 1],
						};
					}
					return state;
				});
			},

			redo: () => {
				set((state) => {
					if (state.historyIndex < state.history.length - 1) {
						return {
							historyIndex: state.historyIndex + 1,
							elements: state.history[state.historyIndex + 1],
						};
					}
					return state;
				});
			},

			clearCanvas: () => {
				set({
					elements: [],
					history: [[]],
					historyIndex: 0,
				});
			},
		}),
		{
			name: "drawing-storage",
		},
	),
);
