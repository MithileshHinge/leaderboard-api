export default function validatePnL(pnlValue: any) {
	return (typeof pnlValue === 'number' && pnlValue >= -100)
}