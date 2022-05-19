import {computed, defineComponent, ref} from "vue";
import type {PropType} from "vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/en";
import "./DatePicker.scss";
import clsx from "clsx";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

dayjs.locale("en");

interface DateCellInterface {
    date: dayjs.Dayjs,
    dayOfMonth: number,
    isCurrentMonth: boolean
}

const daysInMonth = (year: string, month: string) => dayjs(`${year}-${month}-01`).daysInMonth();
const weekDays = dayjs.weekdaysShort();

function createDaysForCurrentMonth(year: string, month: string): DateCellInterface[] {
    return [...Array(daysInMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
}

function createDaysForPreviousMonth(year: string, month: string, currentMonthDays: DateCellInterface[]): DateCellInterface[] {
    const firstDayOfTheMonthWeekday = dayjs(currentMonthDays[0].date).weekday();

    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

    const previousMonthLastMondayDayOfMonth = dayjs(
        currentMonthDays[0].date
    ).subtract(firstDayOfTheMonthWeekday, "day").date();

    return [...Array(firstDayOfTheMonthWeekday)].map((day, index) => {
        return {
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`
            ),
            dayOfMonth: previousMonthLastMondayDayOfMonth + index,
            isCurrentMonth: false
        };
    });
}

function createDaysForNextMonth(year: string, month: string, currentMonthDays: DateCellInterface[]): DateCellInterface[] {
    const lastDayOfTheMonthWeekday = dayjs(`${year}-${month}-${currentMonthDays.length}`).weekday();

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 6 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
            date: dayjs(`${year}-${Number(month) + 1}-${index + 1}`),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        }
    })
}

const getDays = (year: string, month: string): DateCellInterface[] => {
    const currentMonthDays = createDaysForCurrentMonth(year, month);
    const previousMonthDays = createDaysForPreviousMonth(year, month, currentMonthDays)
    const nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

function dateRange(
    start: Date,
    end: Date
): (number | Date)[] {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const diffInUnits = endDate.diff(startDate, "day") + 1;
    return Array.from(Array(diffInUnits).keys()).map((i) => {
        return startDate.add(i, "day").toDate()
    });
}

export default defineComponent({
    name: "DatePicker",
    props: {
        type: {
            type: String as PropType<"from" | "to">,
            default: "start"
        },
        selectedStartDate: Date,
        selectedEndDate: Date,
        initialDate: Date,
        unavailableDates: Array as PropType<(Date | { from: Date, to: Date })[]>
    },
    emits: {
        select: (date: Date | null) => date instanceof Date || date === null
    },
    setup(props, { emit }) {
        const today = dayjs();

        const currentDate = ref(dayjs(props.initialDate || today));

        const disabledDates = computed(() => {
            return props.unavailableDates?.flatMap(date => {
                if (date instanceof Date) {
                    return dayjs(date)
                } else {
                    return dateRange(date.from, date.to).map(date => dayjs(date));
                }
            })
        });

        const days = computed(() => {
            return getDays(currentDate.value.format("YYYY"), currentDate.value.format("M"));
        });

        const showPrevMonth = () => {
            currentDate.value = dayjs(`${currentDate.value.format("YYYY")}-${currentDate.value.format("M")}-01`).subtract(1, "month");
        }
        const showNextMonth = () => {
            currentDate.value = dayjs(`${currentDate.value.format("YYYY")}-${currentDate.value.format("M")}-01`).add(1, "month");
        }
        const handleDateClick = (day: DateCellInterface) => {
            const startDate = props.type === "from" ? day.date.toDate() : props.selectedStartDate;
            const endDate = props.type === "to" ? day.date.toDate() : props.selectedEndDate;

            if (startDate && endDate) {
                const daysInRange = dateRange(startDate, endDate).map(date => dayjs(date).format("YYYY-MM-DD"));
                const disabled = (disabledDates.value || []).map(date => date.format("YYYY-MM-DD"));
                const includesDisabled = daysInRange.some(date => disabled.includes(date));

                if (includesDisabled) {
                    return;
                }
            }

            emit('select', day.date.toDate())
        }

        return {
            days,
            today,
            currentDate,
            disabledDates,
            handleDateClick,
            showPrevMonth,
            showNextMonth
        }
    },

    render() {
        return <div class={"datepicker"}>
            <div class="datepicker__header">
                <button class={"datepicker__change-month"} onClick={this.showPrevMonth}>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.7 13.405C6.60134 13.4063 6.50344 13.3875 6.41231 13.3497C6.32117 13.3118 6.23872 13.2558 6.17 13.185L0.955 7.97C0.698525 7.71232 0.554539 7.36356 0.554539 7C0.554539 6.63644 0.698525 6.28767 0.955 6.03L6.17 0.814997C6.23929 0.744852 6.32182 0.68916 6.4128 0.65115C6.50378 0.613139 6.6014 0.593567 6.7 0.593567C6.7986 0.593567 6.89622 0.613139 6.9872 0.65115C7.07818 0.68916 7.16071 0.744852 7.23 0.814997C7.36924 0.956261 7.4473 1.14665 7.4473 1.345C7.4473 1.54335 7.36924 1.73373 7.23 1.875L2.105 7L7.23 12.125C7.36924 12.2663 7.4473 12.4566 7.4473 12.655C7.4473 12.8533 7.36924 13.0437 7.23 13.185C7.16093 13.2553 7.07841 13.3111 6.98736 13.3489C6.89631 13.3867 6.79858 13.4057 6.7 13.405Z" fill="#333333"/>
                    </svg>
                </button>
                <span class={"datepicker__current-date"}>
                    {this.currentDate.format("MMMM")} {this.currentDate.format("YYYY")}
                </span>
                <button class={"datepicker__change-month"} onClick={this.showNextMonth}>
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.3 13.405C1.20142 13.4057 1.10369 13.3867 1.01264 13.3489C0.921591 13.3111 0.839074 13.2553 0.77 13.185C0.63076 13.0437 0.552704 12.8533 0.552704 12.655C0.552704 12.4566 0.63076 12.2663 0.77 12.125L5.895 7L0.77 1.875C0.63076 1.73373 0.552704 1.54335 0.552704 1.345C0.552704 1.14665 0.63076 0.956261 0.77 0.814997C0.839294 0.744852 0.921823 0.68916 1.0128 0.65115C1.10378 0.613139 1.2014 0.593567 1.3 0.593567C1.3986 0.593567 1.49622 0.613139 1.5872 0.65115C1.67818 0.68916 1.76071 0.744852 1.83 0.814997L7.045 6.03C7.30148 6.28767 7.44546 6.63644 7.44546 7C7.44546 7.36356 7.30148 7.71232 7.045 7.97L1.83 13.185C1.76128 13.2558 1.67883 13.3118 1.58769 13.3497C1.49656 13.3875 1.39866 13.4063 1.3 13.405Z" fill="#333333"/>
                    </svg>
                </button>
            </div>

            <div class={"datepicker__calendar"}>
                {weekDays.map(weekday => (
                   <div class={"datepicker__day datepicker__day--weekday"}>
                       {weekday}
                   </div>
                ))}
                {this.days.map((day) => {
                    const disabled = (this.type === "from" && this.selectedEndDate && day.date.isSameOrAfter(this.selectedEndDate, "day"))
                        || (this.type === "to" && this.selectedStartDate && day.date.isSameOrBefore(this.selectedStartDate, "day"))
                        || !!this.disabledDates?.find((date: dayjs.Dayjs) => day.date.isSame(date));

                    const isToday = this.today.isSame(day.date, "date");
                    const isStartDate = day.date.isSame(this.selectedStartDate);
                    const isEndDate = day.date.isSame(this.selectedEndDate);
                    const inRange = this.selectedStartDate && this.selectedEndDate && day.date.isBetween(this.selectedStartDate, this.selectedEndDate);
                    const isConnected = (isStartDate || isEndDate) && this.selectedStartDate && this.selectedEndDate

                    return (
                        <div class={clsx(
                                "datepicker__day",
                                !day.isCurrentMonth && "datepicker__day--inactive",
                                isToday && "datepicker__day--today",
                                disabled && "datepicker__day--disabled",
                                isStartDate && "datepicker__day--start-range",
                                isEndDate && "datepicker__day--end-range",
                                inRange && "datepicker__day--in-range",
                                isConnected && "datepicker__day--connected"
                            )}
                            onClick={() => !disabled && this.handleDateClick(day)}
                        >
                            <span class={"datepicker__day-symbol"}>
                                {day.date.format("DD")}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    }
});
