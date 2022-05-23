import {computed, defineComponent, ref, withModifiers} from "vue";
import type {PropType} from "vue";
import DatePicker from "@/components/DatePicker/DatePicker";
import type {DateRange} from "@/components/DatePicker/DatePicker";
import dayjs from "dayjs";
import vClickOutside from 'click-outside-vue3';
import clsx from "clsx";

export default defineComponent({
    name: "ReservationDate",
    props: {
        type: {
            type: String as PropType<"from" | "to">,
            default: "from"
        },
        range: Object as PropType<{ from: Date | null, to: Date | null }>,
        unavailableDates: Array as PropType<(Date | DateRange)[]>,
        emptyLabel: {
            type: String,
            required: true
        }
    },

    directives: {
        clickOutside: vClickOutside.directive
    },

    emits: {
        change: (date: Date | null) => date instanceof Date || date === null
    },

    setup (props, { emit }) {
        const pickerOpen = ref(false);
        const selectedDate = computed(() => props.range?.[props.type] ? dayjs(props.range?.[props.type]) : null);

        const onClickOutside = () => pickerOpen.value = false;
        const handleClear = () => emit('change', null);
        const handleSelect = (date: Date | null) => {
            pickerOpen.value = false;
            emit('change', date);
        }

        return {
            handleClear,
            handleSelect,
            onClickOutside,
            pickerOpen,
            selectedDate
        }
    },

    render() {
        return (
            <div v-click-outside={() => this.onClickOutside()}>
                <div class={clsx(
                    "reserve-dates__date",
                    this.pickerOpen && "reserve-dates__date--active",
                    this.selectedDate && "reserve-dates__date-selected"
                )} onClick={() => this.pickerOpen = !this.pickerOpen}>
                    {this.selectedDate
                        ? <>
                            {this.selectedDate?.format("DD MMM YYYY")}
                            <button class={"reserve-dates__clear"} data-clear="" onClick={withModifiers(this.handleClear, ["stop"])}>&times;</button>
                        </>
                        : this.emptyLabel
                    }
                </div>
                {this.pickerOpen && <div class={"reserve-date__picker"}>
                    <DatePicker
                      type={this.type}
                      initialDate={this.selectedDate ? this.selectedDate.toDate() : undefined}
                      selectedStartDate={this.range?.from ?? undefined}
                      selectedEndDate={this.range?.to ?? undefined}
                      onSelect={this.handleSelect}
                      unavailableDates={this.unavailableDates}
                    />
                </div>}
            </div>
        )
    }
})
