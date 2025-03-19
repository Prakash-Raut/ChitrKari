"use client";

import { useDrawingStore } from "@/lib/store/drawing-store";
import type Konva from "konva";
import { useEffect, useState } from "react";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";
import type { DrawingElement, Point } from "../types";

export const DrawingCanvas: React.FC = () => {
	const {
		elements,
		selectedTool,
		selectedColor,
		isDrawing,
		setIsDrawing,
		addElement,
		updateElement,
	} = useDrawingStore();

	const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
	const [stageSize, setStageSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight - 80,
	});

	useEffect(() => {
		const handleResize = () => {
			setStageSize({
				width: window.innerWidth,
				height: window.innerHeight - 80,
			});
		};

		if (typeof window !== "undefined") {
			handleResize();
			window.addEventListener("resize", handleResize);
		}
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleMouseDown = (
		e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
	) => {
		const stage = e.target.getStage();
		if (!stage) return;

		const pos = stage.getPointerPosition();
		if (!pos) return;

		setIsDrawing(true);
		setCurrentPoints([pos]);

		if (selectedTool === "text") {
			const element: DrawingElement = {
				id: Date.now().toString(),
				tool: "text",
				x: pos.x,
				y: pos.y,
				text: "Double click to edit",
				color: selectedColor,
			};
			addElement(element);
		}
	};

	const handleMouseMove = (
		e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
	) => {
		if (!isDrawing) return;
		const stage = e.target.getStage();
		if (!stage) return;

		const pos = stage.getPointerPosition();
		if (!pos) return;

		const newPoints = [...currentPoints, pos];
		setCurrentPoints(newPoints);

		const element: DrawingElement = {
			id: Date.now().toString(),
			tool: selectedTool,
			points: newPoints,
			color: selectedColor,
		};

		if (selectedTool === "pen") {
			updateElement(element);
		}
	};

	const handleMouseUp = () => {
		if (!isDrawing) return;

		const element: DrawingElement = {
			id: Date.now().toString(),
			tool: selectedTool,
			points: currentPoints,
			color: selectedColor,
		};

		if (selectedTool !== "text") {
			addElement(element);
		}

		setIsDrawing(false);
		setCurrentPoints([]);
	};

	const renderShape = (element: DrawingElement) => {
		switch (element.tool) {
			case "pen":
				return (
					<Line
						key={element.id}
						points={element.points?.flatMap((p) => [p.x, p.y]) || []}
						stroke={element.color}
						strokeWidth={2}
						tension={0.5}
						lineCap="round"
						lineJoin="round"
					/>
				);
			case "line": {
				const points = element.points || [];
				return points.length >= 2 ? (
					<Line
						key={element.id}
						points={[
							points[0].x,
							points[0].y,
							points[points.length - 1].x,
							points[points.length - 1].y,
						]}
						stroke={element.color}
						strokeWidth={2}
					/>
				) : null;
			}
			case "rectangle": {
				const rectPoints = element.points || [];
				if (rectPoints.length >= 2) {
					const [start, end] = [
						rectPoints[0],
						rectPoints[rectPoints.length - 1],
					];
					return (
						<Rect
							key={element.id}
							x={Math.min(start.x, end.x)}
							y={Math.min(start.y, end.y)}
							width={Math.abs(end.x - start.x)}
							height={Math.abs(end.y - start.y)}
							stroke={element.color}
							strokeWidth={2}
						/>
					);
				}
				return null;
			}
			case "circle": {
				const circlePoints = element.points || [];
				if (circlePoints.length >= 2) {
					const [start, end] = [
						circlePoints[0],
						circlePoints[circlePoints.length - 1],
					];
					const radius = Math.sqrt(
						(end.x - start.x) ** 2 + (end.y - start.y) ** 2,
					);
					return (
						<Circle
							key={element.id}
							x={start.x}
							y={start.y}
							radius={radius}
							stroke={element.color}
							strokeWidth={2}
						/>
					);
				}
				return null;
			}
			case "text":
				return (
					<Text
						key={element.id}
						x={element.x}
						y={element.y}
						text={element.text || ""}
						fill={element.color}
						fontSize={16}
					/>
				);
			default:
				return null;
		}
	};

	// Render current shape while drawing
	const renderCurrentShape = () => {
		if (!isDrawing || currentPoints.length < 1) return null;
		return renderShape({
			id: "current",
			tool: selectedTool,
			points: currentPoints,
			color: selectedColor,
		});
	};

	if (stageSize.width === 0) return null;

	return (
		<Stage
			width={stageSize.width}
			height={stageSize.height}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onTouchStart={handleMouseDown}
			onTouchMove={handleMouseMove}
			onTouchEnd={handleMouseUp}
			style={{ touchAction: "none" }}
		>
			<Layer>
				{elements.map(renderShape)}
				{renderCurrentShape()}
			</Layer>
		</Stage>
	);
};
