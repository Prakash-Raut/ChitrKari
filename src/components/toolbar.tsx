"use client";

import { useDrawingStore } from "@/lib/store/drawing-store";
import {
	Circle,
	Pencil,
	Redo2,
	Slash,
	Square,
	Trash2,
	Undo2,
} from "lucide-react";
import React from "react";
import type { Tool } from "../types";
import { Button } from "./ui/button";

const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
	{ id: "pen", icon: <Pencil size={20} />, label: "Pen" },
	{ id: "line", icon: <Slash size={20} />, label: "Line" },
	{ id: "rectangle", icon: <Square size={20} />, label: "Rectangle" },
	{ id: "circle", icon: <Circle size={20} />, label: "Circle" },
];

const colors = [
	"#000000", // Black
	"#FF0000", // Red
	"#00FF00", // Green
	"#0000FF", // Blue
	"#FFFF00", // Yellow
	"#FFA500", // Orange
	"#FFC0CB", // Pink
	"#800080", // Purple
	"#00FFFF", // Cyan
	"#808080", // Gray
	"#FFFFFF", // White
	"#8B4513", // Brown
];

export const Toolbar: React.FC = () => {
	const {
		selectedTool,
		selectedColor,
		setSelectedTool,
		setSelectedColor,
		undo,
		redo,
		clearCanvas,
	} = useDrawingStore();

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2 z-10">
			<div className="flex items-center gap-2 border-r pr-2">
				{tools.map((tool) => (
					<Button
						key={tool.id}
						variant="outline"
						className={`p-2 rounded transition-colors ${
							selectedTool === tool.id ? "bg-gray-200" : "hover:bg-gray-100"
						}`}
						onClick={() => setSelectedTool(tool.id)}
						title={tool.label}
					>
						{React.cloneElement(
							tool.icon as React.ReactElement<{ className?: string }>,
							{
								className:
									selectedTool === tool.id ? "text-blue-600" : "text-gray-700",
							},
						)}
					</Button>
				))}
			</div>

			<div className="flex items-center gap-2 border-r pr-2">
				{colors.map((color) => (
					<Button
						key={color}
						className={`w-10 h-10 rounded-full transition-transform ${
							selectedColor === color
								? "border-2 border-gray-400 scale-110"
								: "border border-gray-200 hover:scale-105"
						}`}
						style={{ backgroundColor: color }}
						onClick={() => setSelectedColor(color)}
						title={`Color: ${color}`}
					/>
				))}
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					className="p-2 rounded hover:bg-gray-100 transition-colors"
					onClick={undo}
					title="Undo"
				>
					<Undo2 size={20} className="text-gray-700" />
				</Button>
				<Button
					variant="outline"
					className="p-2 rounded hover:bg-gray-100 transition-colors"
					onClick={redo}
					title="Redo"
				>
					<Redo2 size={20} className="text-gray-700" />
				</Button>
				<Button
					variant="outline"
					className="p-2 rounded hover:bg-gray-100 transition-colors"
					onClick={clearCanvas}
					title="Clear Canvas"
				>
					<Trash2 size={20} className="text-gray-700" />
				</Button>
			</div>
		</div>
	);
};
