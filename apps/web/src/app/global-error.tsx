"use client";

const buttonStyle = {
	border: "1px solid #111",
	padding: "8px 16px",
	fontSize: 14,
	font: "inherit",
	textDecoration: "none",
	cursor: "pointer",
};

export default function GlobalError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="de">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 24,
					textAlign: "center",
					color: "#111",
					background: "#fff",
					fontFamily:
						"system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
				}}
			>
				<h1 style={{ margin: 0, fontSize: 28 }}>Etwas ist schiefgelaufen.</h1>
				<p lang="en" style={{ margin: 0, fontSize: 18, color: "#444" }}>
					Something went wrong.
				</p>
				<div style={{ display: "flex", gap: 12, marginTop: 20 }}>
					<button
						onClick={() => reset()}
						style={{ ...buttonStyle, background: "#111", color: "#fff" }}
						type="button"
					>
						Erneut versuchen · Try again
					</button>
					<a href="/" style={{ ...buttonStyle, color: "#111" }}>
						Zur Startseite · Back to the homepage
					</a>
				</div>
			</body>
		</html>
	);
}
