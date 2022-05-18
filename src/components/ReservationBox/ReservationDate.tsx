import {defineComponent, ref} from "vue";
import type {PropType} from "vue";
import DatePicker from "@/components/DatePicker/DatePicker";
import dayjs from "dayjs";

export default defineComponent({
    name: "ReservationDate",

    props: {
        type: {
            type: String as PropType<"from" | "to">,
            default: "from"
        },
        range: Object as PropType<{ from: Date | null, to: Date | null }>
    },

    setup (props) {

        const pickerOpen = ref(false);
        const selectedDate = ref(dayjs(props.range?.[props.type]));

        return {
            selectedDate,
            pickerOpen
        }
    },

    render() {

        return (
            <div>
                <div class={"reserve-dates__date"} onClick={() => this.pickerOpen = !this.pickerOpen}>
                    {this.selectedDate.format("DD MMM YYYY") || "Date from"}
                </div>
                {this.pickerOpen && <div class={"reserve-date__picker"}>
                    <DatePicker type={this.type} initialDate={this.selectedDate.toDate()} />
                </div>}
            </div>
        )
    }
})
