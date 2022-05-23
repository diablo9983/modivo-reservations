import {describe, expect, it} from "vitest";
import {mount} from "@vue/test-utils";
import DatePicker from "@/components/DatePicker/DatePicker";
import type {DateRange} from "@/components/DatePicker/DatePicker";
import dayjs from "dayjs";
import {dateRange} from "@/utils/dateRange";

const dates = [
    new Date(),
    new Date("01 Jan 1970"),
    new Date("25 May 2031"),
    ...Array.from({length: 12}).map((_, index) => {
        return new Date(`01-${index + 1}-2021`);
    })
]

const validRange = [new Date("12 May 2022"), new Date("17 May 2022")];
const invalidRange = [new Date("08 May 2022"), new Date("12 May 2022")];

const disabledDates: (Date | DateRange)[] = [
    new Date("10 May 2022"),
    {from: new Date("28 May 2022"), to: new Date("30 May 2022")}
];

describe("DatePicker", () => {
    describe(":props", () => {
        describe(':initialDate - render proper month based on initial date', () => {
            for (const date of dates) {
                it(date.toString(),  () => {
                    const picker = mount(DatePicker, {
                        props: {
                            initialDate: date
                        }
                    });

                    expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs(date).format("MMMM YYYY"));
                });
            }
        });

        it(':selectedStartDate - properly shows selected start day as active', () => {
            const picker = mount(DatePicker, {
                props: {
                    selectedStartDate: validRange[0]
                }
            });

            expect(picker.find(`[data-date="${dayjs(validRange[0]).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--start-range");
        });

        it(':selectedEndDate - properly shows selected end day as active', () => {
            const picker = mount(DatePicker, {
                props: {
                    selectedEndDate: validRange[1]
                }
            });

            expect(picker.find(`[data-date="${dayjs(validRange[1]).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--end-range");
        });

        it(':unavailableDates - properly shows disabled date as disabled', () => {
            const picker = mount(DatePicker, {
                props: {
                    unavailableDates: [disabledDates[0]]
                }
            });

            expect(picker.find(`[data-date="${dayjs(disabledDates[0] as Date).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--disabled");
        });

        it(':unavailableDates - properly shows disabled range of dates as disabled', () => {
            const picker = mount(DatePicker, {
                props: {
                    unavailableDates: [disabledDates[1]]
                }
            });

            const range = disabledDates[1] as DateRange;
            const dates = dateRange(range.from, range.to);

            for (const date of dates) {
                expect(picker.find(`[data-date="${dayjs(date).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--disabled");
            }
        });
    });

    describe(":emitters", () => {
        it("should emit select event with correct value on day click", async () => {
            const picker = mount(DatePicker);

            const date = dayjs().format("MM-YYYY");
            const dayElement = picker.find(`[data-date="05-${date}"]`);
            await dayElement?.trigger("click");

            const emitted: Array<Array<Date | null>> | undefined = picker.emitted('select');
            const eventArgument = emitted?.[0]?.[0];

            expect(picker.emitted()).toHaveProperty("select");
            expect(eventArgument).toBeInstanceOf(Date);
            expect(eventArgument?.toISOString()).toEqual(dayjs(`05-${date}`).toISOString());
        });

        it("should NOT emit select event on disabled day click", async () => {
            const picker = mount(DatePicker, {
                props: {
                    unavailableDates: [dates[0]]
                }
            });

            const date = dayjs(dates[0]).format("DD-MM-YYYY");
            const dayElement = picker.find(`[data-date="${date}"]`);
            await dayElement?.trigger("click");

            const emitted = picker.emitted('select');

            expect(emitted).toBeUndefined();
        });

        it("should emit select event with startDate with already selected endDate", async () => {
            const picker = mount(DatePicker, {
                props: {
                    type: "from",
                    initialDate: validRange[1],
                    selectedEndDate: validRange[1]
                }
            });

            const date = dayjs(validRange[0]).format("DD-MM-YYYY");
            const dayElement = picker.find(`[data-date="${date}"]`);
            await dayElement?.trigger("click");

            const emitted: Array<Array<Date | null>> | undefined = picker.emitted('select');
            const eventArgument = emitted?.[0]?.[0];

            expect(dayjs(eventArgument).format("DD-MM-YYYY")).toEqual(date);
        });

        it("should emit select event with endDate with already selected startDate", async () => {
            const picker = mount(DatePicker, {
                props: {
                    type: "to",
                    initialDate: validRange[0],
                    selectedStartDate: validRange[0]
                }
            });

            const date = dayjs(validRange[1]).format("DD-MM-YYYY");
            const dayElement = picker.find(`[data-date="${date}"]`);
            await dayElement?.trigger("click");

            const emitted: Array<Array<Date | null>> | undefined = picker.emitted('select');
            const eventArgument = emitted?.[0]?.[0];

            expect(dayjs(eventArgument).format("DD-MM-YYYY")).toEqual(date);
        });

        it("should NOT emit select event if an attempt was made to select a range with a blocked date", async () => {
            const picker = mount(DatePicker, {
                props: {
                    type: "to",
                    initialDate: invalidRange[0],
                    selectedStartDate: invalidRange[0],
                    unavailableDates: [disabledDates[0]]
                }
            });

            const date = dayjs(invalidRange[1]).format("DD-MM-YYYY");
            const dayElement = picker.find(`[data-date="${date}"]`);
            await dayElement?.trigger("click");

            const emitted = picker.emitted('select');

            expect(emitted).toBeUndefined();
        })
    });

    it('properly shows today day as active', () => {
        const picker = mount(DatePicker);

        expect(picker.find(`[data-date="${dayjs(dates[0]).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--today")
    });

    it("shows previous month on previous month button click", async () => {
        const picker = mount(DatePicker);

        const element = picker.find(".datepicker__change-month--previous");
        await element.trigger("click");

        expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs().subtract(1, "month").format("MMMM YYYY"));
    });

    it("shows next month on next month button click", async () => {
        const picker = mount(DatePicker);

        const element = picker.find(".datepicker__change-month--next");
        await element.trigger("click");

        expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs().add(1, "month").format("MMMM YYYY"));
    });

    it("dates between the range have the appropriate class", () => {
        const picker = mount(DatePicker, {
            props: {
                initialDate: validRange[0],
                selectedStartDate: validRange[0],
                selectedEndDate: validRange[1]
            }
        });

        const date = dayjs(validRange[1]).subtract(2, "days").format("DD-MM-YYYY");
        const dayElement = picker.find(`[data-date="${date}"]`);

        expect(dayElement?.classes()).toContain("datepicker__day--in-range");
    });
})
