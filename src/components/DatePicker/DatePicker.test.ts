import {describe, expect, test} from "vitest";
import {mount} from "@vue/test-utils";
import DatePicker from "@/components/DatePicker/DatePicker";
import type {DateRange} from "@/components/DatePicker/DatePicker";
import dayjs from "dayjs";
import {dateRange} from "@/utils/dateRange";

const dates = {
    today: new Date(),
    past: new Date("01 Jan 1970"),
    future: new Date("25 May 2031")
}

const validRange = [new Date("12 May 2022"), new Date("17 May 2022")];
// const invalidRange = [new Date("08 May 2022"), new Date("12 May 2022")];

const disabledDates: (Date | DateRange)[] = [
    new Date("10 May 2022"),
    {from: new Date("28 May 2022"), to: new Date("30 May 2022")}
];

describe("DatePicker", () => {
    describe(":props", () => {
        describe(':initialDate - render proper month based on initial date', () => {
            for (const date of Object.values(dates)) {
                test(date.toString(), async () => {
                    const picker = mount(DatePicker, {
                        props: {
                            initialDate: date
                        }
                    });

                    await picker.vm.$nextTick();

                    expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs(date).format("MMMM YYYY"));
                });
            }
        });

        test(':selectedStartDate - properly shows selected start day as active', async () => {
            const picker = mount(DatePicker, {
                props: {
                    selectedStartDate: validRange[0]
                }
            });
            await picker.vm.$nextTick();

            expect(picker.find(`[data-date="${dayjs(validRange[0]).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--start-range");
        });

        test(':selectedEndDate - properly shows selected end day as active', async () => {
            const picker = mount(DatePicker, {
                props: {
                    selectedEndDate: validRange[1]
                }
            });
            await picker.vm.$nextTick();

            expect(picker.find(`[data-date="${dayjs(validRange[1]).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--end-range");
        });

        test(':unavailableDates - properly shows disabled date as disabled', async () => {
            const picker = mount(DatePicker, {
                props: {
                    unavailableDates: [disabledDates[0]]
                }
            });
            await picker.vm.$nextTick();

            expect(picker.find(`[data-date="${dayjs(disabledDates[0] as Date).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--disabled");
        });

        test(':unavailableDates - properly shows disabled range of dates as disabled', async () => {
            const picker = mount(DatePicker, {
                props: {
                    unavailableDates: [disabledDates[1]]
                }
            });
            await picker.vm.$nextTick();

            const range = disabledDates[1] as DateRange;
            const dates = dateRange(range.from, range.to);

            for (const date of dates) {
                expect(picker.find(`[data-date="${dayjs(date).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--disabled");
            }
        });
    });

    test('properly shows today day as active', async () => {
        const picker = mount(DatePicker);
        await picker.vm.$nextTick();

        expect(picker.find(`[data-date="${dayjs(dates.today).format("DD-MM-YYYY")}"]`).classes()).toContain("datepicker__day--today")
    });

    test("shows previous month on previous month button click", async () => {
        const picker = mount(DatePicker);
        await picker.vm.$nextTick();

        const element = picker.find(".datepicker__change-month--previous");
        await element.trigger("click");
        await picker.vm.$nextTick();

        expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs().subtract(1, "month").format("MMMM YYYY"));
    });

    test("shows previous month on next month button click", async () => {
        const picker = mount(DatePicker);
        await picker.vm.$nextTick();

        const element = picker.find(".datepicker__change-month--next");
        await element.trigger("click");
        await picker.vm.$nextTick();

        expect(picker.find('.datepicker__current-date').text()).toEqual(dayjs().add(1, "month").format("MMMM YYYY"));
    });
})
