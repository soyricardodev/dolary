export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-3">
			<div className="w-16 h-16 border-4 border-main border-t-transparent rounded-full animate-spin mb-4" />
			<p className="text-lg font-medium">Cargando Dolary...</p>
		</div>
	);
}
