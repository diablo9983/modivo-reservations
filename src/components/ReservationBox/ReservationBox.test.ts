import {describe, expect, it} from "vitest";
import ReservationBox from "@/components/ReservationBox/ReservationBox";
import {shallowMount} from "@vue/test-utils";
import type {PropType} from "vue";

describe("ReservationBox", () => {
    describe(":props", () => {
        it("correctly renders props", () => {
            const box = shallowMount(ReservationBox, {
                props: {
                    price: 125,
                    currencySymbol: "zł",
                    rating: 4.5,
                    ratingCount: 12,
                    reserveButtonLabel: "Reserve"
                }
            });

            const ratingCountEl = box.find(".reserve-rating__count");
            const reserveButtonEl = box.find(".reserve-date__reserve");
            const priceEl = box.find(".reserve-date__price");

            expect(ratingCountEl.text()).toEqual("12");
            expect(reserveButtonEl.text()).toEqual("Reserve");
            expect(priceEl.text()).toEqual("125 zł");
        })
    });

    it("should NOT emit change event if either start or end date is not selected", () => {
        const box = shallowMount(ReservationBox, {
            props: {
                price: 125,
                currencySymbol: "zł",
                rating: 4.5,
                ratingCount: 12,
                reserveButtonLabel: "Reserve"
            }
        });

        const reserveButton = box.find("[data-reserve]");
        reserveButton?.trigger("click");

        const emitted = box.emitted('change');

        expect(emitted).toBeUndefined();
    })

    it("should emit change event if both start or end date are selected", () => {
        const dates = { from: new Date("23-05-2022"), to: new Date("26-05-2022") };
        const box = shallowMount(ReservationBox, {
            props: {
                price: 125,
                currencySymbol: "zł",
                rating: 4.5,
                ratingCount: 12,
                reserveButtonLabel: "Reserve",
                startDate: dates.from,
                endDate: dates.to
            }
        });

        const reserveButton = box.find("[data-reserve]");
        reserveButton?.trigger("click");

        const emitted: Array<Array<{ from: Date, to: Date }>> | undefined = box.emitted('change');

        expect(emitted?.[0]?.[0]).toEqual(dates);
    });

    it.each([["selectedStartDate", "from"], ["selectedEndDate", "to"]])("correctly sets %s on change event from ReservationDate", async (key, type) => {
        const date = new Date("22-05-2022");
        const box = shallowMount(ReservationBox, {
            global: {
                stubs: {
                    ReservationDate: {
                        props: {
                            type: String as PropType<"from" | "to">
                        },
                        template: "<span></span>",
                        setup(props, { emit }) {
                            if (props.type === type) {
                                emit("change", date);
                            }
                        }
                    }
                }
            },
            props: {
                price: 125,
                currencySymbol: "zł",
                rating: 4.5,
                ratingCount: 12,
                reserveButtonLabel: "Reserve"
            }
        });

        await box.vm.$nextTick();

        expect(box.vm[key as 'selectedStartDate' | 'selectedEndDate']).toEqual(date);
    })
});
