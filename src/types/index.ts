export type ChildrenProps = {
	children: React.ReactNode;
};

export type Point = {
	x: number;
	y: number;
};

export type DrawingElement = {
	id: string;
	tool: "pen" | "line" | "rectangle" | "circle" | "text";
	points?: Point[];
	text?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	radius?: number;
	color: string;
};

export type Tool = "pen" | "line" | "rectangle" | "circle" | "text";
