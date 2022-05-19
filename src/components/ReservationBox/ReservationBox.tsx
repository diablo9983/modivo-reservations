import {defineComponent, ref} from "vue";
import type { PropType } from "vue";
import "./ReservationBox.scss";
import ReservationDate from "@/components/ReservationBox/ReservationDate";

export default defineComponent({
    name: "ReserveDate",
    props: {
        price: {
            type: Number,
            required: true
        },
        currencySymbol: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        ratingCount: {
            type: Number,
            required: true
        },
        reserveButtonLabel: {
            type: String,
            required: true
        },
        startDate: Date,
        endDate: Date,
        unavailableDates: Array as PropType<(Date | { from: Date, to: Date })[]>
    },
    setup(props) {

        const selectedStartDate = ref(props.startDate || null);
        const selectedEndDate = ref(props.endDate || null);

        const handleReserveClick = () => {
            console.log({
                selectedStartDate: selectedStartDate.value,
                selectedEndDate: selectedEndDate.value
            })
        }

        return {
            handleReserveClick,
            selectedStartDate,
            selectedEndDate
        }
    },
    render() {
        return <div class={"reserve-date"}>
            <div class={"reserve-date__top"}>
                <div>
                    <span class={"reserve-date__price"}>{this.price} {this.currencySymbol}</span>
                    <div class={"reserve-rating"}>
                        <span class={"reserve-rating__stars"}>
                            <span class="reserve-rating__stars-full" style={{
                                width: `calc(${this.rating} * var(--star-width)`
                            }}></span>
                        </span>
                        <span class={"reserve-rating__count"}>{this.ratingCount}</span>
                    </div>
                </div>
                <button onClick={this.handleReserveClick} class={"reserve-date__reserve"}>{this.reserveButtonLabel}</button>
            </div>
            <div class={"reserve-date__bottom"}>
                <div class="reserve-dates">
                    <ReservationDate class="reserve-dates__from" range={{
                        from: this.selectedStartDate,
                        to: this.selectedEndDate
                    }} onChange={(date) => {
                        this.selectedStartDate = date;
                    }} unavailableDates={this.unavailableDates} />
                    <div class="reserve-dates__arrow">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.045 6.03L7.83 0.815C7.76071 0.744855 7.67818 0.689163 7.5872 0.651153C7.49622 0.613142 7.3986 0.59357 7.3 0.59357C7.2014 0.59357 7.10378 0.613142 7.0128 0.651153C6.92182 0.689163 6.83929 0.744855 6.77 0.815C6.63076 0.956264 6.5527 1.14665 6.5527 1.345C6.5527 1.54335 6.63076 1.73374 6.77 1.875L11.145 6.25H1C0.801088 6.25 0.610322 6.32902 0.46967 6.46967C0.329018 6.61032 0.25 6.80109 0.25 7C0.25 7.19891 0.329018 7.38968 0.46967 7.53033C0.610322 7.67098 0.801088 7.75 1 7.75H11.145L6.77 12.125C6.63076 12.2663 6.5527 12.4566 6.5527 12.655C6.5527 12.8534 6.63076 13.0437 6.77 13.185C6.83907 13.2553 6.92159 13.3111 7.01264 13.3489C7.10369 13.3867 7.20142 13.4057 7.3 13.405C7.39866 13.4063 7.49656 13.3875 7.58769 13.3497C7.67883 13.3118 7.76128 13.2558 7.83 13.185L13.045 7.97C13.3015 7.71232 13.4455 7.36356 13.4455 7C13.4455 6.63644 13.3015 6.28768 13.045 6.03Z" fill="#333333"/>
                        </svg>
                    </div>
                    <ReservationDate class="reserve-dates__to" type={"to"} range={{
                        from: this.selectedStartDate,
                        to: this.selectedEndDate
                    }} onChange={(date) => {
                        this.selectedEndDate = date;
                    }} unavailableDates={this.unavailableDates} />
                </div>
            </div>
        </div>
    }
});
