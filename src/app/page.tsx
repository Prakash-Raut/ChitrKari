"use client";

import { DrawingCanvas } from "@/components/drawing-canvas";
import { Toolbar } from "@/components/toolbar";

export default function Home() {
	return (
		<section className="min-h-screen bg-gray-50">
			<Toolbar />
			<DrawingCanvas />
		</section>
	);
}
