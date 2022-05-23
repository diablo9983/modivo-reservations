import {describe, expect, it} from "vitest";
import {mount, shallowMount} from "@vue/test-utils";
import ReservationDate from "@/components/ReservationBox/ReservationDate/ReservationDate";
import dayjs from "dayjs";


describe('ReservationDate', () => {
    describe(":props", () => {
        it("renders emptyLabel", () => {
            const box = shallowMount(ReservationDate, {
                props: {
                    emptyLabel: "Date from"
                }
            });

            const label = box.find(".reserve-dates__date");

            expect(label.text()).toEqual("Date from");
        });

        it("renders from date", () => {
            const date = new Date("23-05-2022");
            const box = mount(ReservationDate, {
                props: {
                    emptyLabel: "Date from",
                    range: {from: date, to: null}
                }
            });

            const el = box.find(".reserve-dates__date");

            expect(el.classes()).toContain("reserve-dates__date-selected");
            expect(el.text()).toContain(dayjs(date).format("DD MMM YYYY"));
        });

        it("renders to date", async () => {
            const date = new Date("23-05-2022");
            const box = mount(ReservationDate, {
                props: {
                    type: "to",
                    emptyLabel: "Date to",
                    range: {from: null, to: date}
                }
            });
            await box.vm.$nextTick();

            const el = box.find(".reserve-dates__date");

            expect(el.classes()).toContain("reserve-dates__date-selected");
            expect(el.text()).toContain(dayjs(date).format("DD MMM YYYY"));
        });
    });

    it("correctly applies class to element on picker open", async () => {
        const box = shallowMount(ReservationDate, {
            props: {
                emptyLabel: "Date from"
            }
        });

        const el = box.find(".reserve-dates__date");
        await el.trigger("click");

        expect(el.classes()).toContain("reserve-dates__date--active");
    });

    it("should emit change event with correct value", async () => {
        const box = shallowMount(ReservationDate, {
            global: {
                stubs: {
                    DatePicker: {
                        template: `<div></div>`,
                        mounted() {
                            this.$emit('select', new Date("23-05-2022"));
                        },
                    }
                }
            },
            props: {
                emptyLabel: "Date from"
            },
        });

        const el = box.find(".reserve-dates__date");
        await el.trigger("click");

        await box.vm.$nextTick();

        const emitted: Array<Array<Date | null>> | undefined = box.emitted('change');

        expect(dayjs(emitted?.[0]?.[0]).format("DD-MM-YYYY")).toEqual(dayjs("23 05 2022").format("DD-MM-YYYY"))
    });

    it("should emit change event with null on clear button click", () => {
        const date = new Date("23-05-2022");
        const box = shallowMount(ReservationDate, {
            props: {
                emptyLabel: "Date from",
                range: {from: date, to: null}
            },
        });

        const button = box.find("[data-clear]");
        button?.trigger("click");
        const emitted: Array<Array<Date | null>> | undefined = box.emitted('change');

        expect(emitted?.[0]?.[0]).toBeNull();
    });
});
