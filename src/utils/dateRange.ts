import dayjs from "dayjs";

export function dateRange(
	start: Date,
	end: Date
): Date[] {
	const startDate = dayjs(start);
	const endDate = dayjs(end);
	const diffInUnits = endDate.diff(startDate, "day") + 1;
	return Array.from(Array(diffInUnits).keys()).map((i) => {
		return startDate.add(i, "day").toDate()
	});
}
