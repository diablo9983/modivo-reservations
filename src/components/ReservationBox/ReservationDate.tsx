import {computed, defineComponent, ref} from "vue";
import type {PropType} from "vue";
import DatePicker from "@/components/DatePicker/DatePicker";
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
        range: Object as PropType<{ from: Date | null, to: Date | null }>
    },

    directives: {
        clickOutside: vClickOutside.directive
    },

    setup (props) {

        const pickerOpen = ref(false);
        const selectedDate = computed(() => props.range?.[props.type] ? dayjs(props.range?.[props.type]) : null);

        const onClickOutside = () => pickerOpen.value = false

        return {
            onClickOutside,
            pickerOpen,
            selectedDate
        }
    },

    render() {

        return (
            <div v-click-outside={() => this.onClickOutside()}>
                <div class={clsx("reserve-dates__date", this.pickerOpen && "reserve-dates__date--active")} onClick={() => this.pickerOpen = !this.pickerOpen}>
                    {this.selectedDate ? this.selectedDate?.format("DD MMM YYYY") : "Date from"}
                </div>
                {this.pickerOpen && <div class={"reserve-date__picker"}>
                    <DatePicker
                      type={this.type}
                      initialDate={this.selectedDate ? this.selectedDate.toDate() : undefined}
                      selectedStartDate={this.range?.from ?? undefined}
                      selectedEndDate={this.range?.to ?? undefined}
                    />
                </div>}
            </div>
        )
    }
})
