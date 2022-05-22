import dayjs from "dayjs";
import {computed, ref} from "vue";

export interface DateCellInterface {
    date: dayjs.Dayjs,
    dayOfMonth: number,
    isCurrentMonth: boolean
}

const daysInMonth = (year: string, month: string) => dayjs(`${year}-${month}-01`).daysInMonth();

const createDaysForCurrentMonth = (year: string, month: string): DateCellInterface[] => {
    return Array.from({ length: daysInMonth(year, month) }).map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
}

const createDaysForPreviousMonth = (year: string, month: string): DateCellInterface[] => {
    const currentMonth = dayjs(`${year}-${month}-01`);
    const firstDayOfTheMonthWeekday = currentMonth.weekday();

    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
    const previousMonthLastMondayDayOfMonth = dayjs(currentMonth).subtract(firstDayOfTheMonthWeekday, "day").date();

    return Array.from({ length: firstDayOfTheMonthWeekday }).map((day, index) => {
        return {
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`
            ),
            dayOfMonth: previousMonthLastMondayDayOfMonth + index,
            isCurrentMonth: false
        };
    });
}

const createDaysForNextMonth = (year: string, month: string): DateCellInterface[] => {
    const lastDayOfTheMonthWeekday = dayjs(`${year}-${month}-${daysInMonth(year, month)}`).weekday();

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 6 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday

    return Array.from({ length: visibleNumberOfDaysFromNextMonth }).map((day, index) => {
        return {
            date: dayjs(`${year}-${Number(month) + 1}-${index + 1}`),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        }
    })
}

const getDays = (year: string, month: string): DateCellInterface[] => {
    const currentMonthDays = createDaysForCurrentMonth(year, month);
    const previousMonthDays = createDaysForPreviousMonth(year, month);
    const nextMonthDays = createDaysForNextMonth(year, month);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

export function useCalendar(initialDate?: Date | dayjs.Dayjs) {
	const currentDate = ref(initialDate ? dayjs(initialDate) : dayjs());
    const days = computed(() => {
        return getDays(currentDate.value.format("YYYY"), currentDate.value.format("M"));
    });

    return {
        currentDate,
        days,
        showNextMonth: () => {
            currentDate.value = dayjs(`${currentDate.value.format("YYYY")}-${currentDate.value.format("M")}-01`)
                .add(1, "month");
        },
        showPreviousMonth: () => {
            currentDate.value = dayjs(`${currentDate.value.format("YYYY")}-${currentDate.value.format("M")}-01`)
                .subtract(1, "month");
        }
    }
}
