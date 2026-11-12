"use client";

import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";
import { Bar, Stage, Text, Window } from "@/components/stageshow/kit";
import "./case-rb-vault.css";

// case study: the Obsidian vault behind the research studio. A
// still: the vault's own folders in the sidebar, one note open with its
// properties and text as placeholder lines, and two facts from the case
// study over the note.
//
// Real strings: the vault's name and its folders and files as they are in
// the vault. The two facts are passed in from the case study.

const TREE = [
	{ name: "docs", kind: "folder" },
	{ name: "raw", kind: "open" },
	{ name: "articles", kind: "child" },
	{ name: "conversations", kind: "child" },
	{ name: "journals", kind: "child" },
	{ name: "notes", kind: "child" },
	{ name: "transcripts", kind: "child" },
	{ name: "tools", kind: "folder" },
	{ name: "wiki", kind: "folder" },
	{ name: "AGENTS", kind: "file" },
	{ name: "CLAUDE", kind: "file" },
] as const;

export default function VaultScene({
	facts = ["8 Pitches in voice corpus", "10 Pipeline phases orchestrated"],
}: {
	facts?: string[];
}) {
	return (
		<Stage className="wcv" fill height={300} theme="dark" width={400}>
			{() => (
				<>
					<Window
						className="wcv-win"
						sidebar={
							<div className="wcv-tree">
								{TREE.map((item) => (
									<div
										className="wcv-item"
										data-kind={item.kind}
										key={item.name}
									>
										{item.kind === "open" && (
											<ChevronDown size={10} strokeWidth={2} />
										)}
										{item.kind === "folder" && (
											<ChevronRight size={10} strokeWidth={2} />
										)}
										{(item.kind === "folder" || item.kind === "open") && (
											<Folder size={11} strokeWidth={1.7} />
										)}
										{item.kind === "file" && (
											<FileText size={11} strokeWidth={1.7} />
										)}
										<Text>{item.name}</Text>
									</div>
								))}
							</div>
						}
						sidebarWidth={132}
						title="hieronymus-vault"
					>
						<div className="wcv-note">
							<Bar h={11} r={4} tone={4} w={150} />
							<div className="wcv-props">
								{[
									[38, 70],
									[52, 46],
									[44, 88],
									[36, 58],
								].map(([k, v]) => (
									<div className="wcv-prop" key={`${k}-${v}`}>
										<Bar h={5} tone={2} w={k} />
										<Bar h={5} tone={3} w={v} />
									</div>
								))}
							</div>
							{[168, 150, 176, 120, 160, 142].map((w) => (
								<Bar h={5} key={w} tone={2} w={w} />
							))}
						</div>
					</Window>

					<div className="wcv-facts">
						{facts.map((fact) => (
							<Text className="wcv-fact" key={fact}>
								{fact}
							</Text>
						))}
					</div>
				</>
			)}
		</Stage>
	);
}
