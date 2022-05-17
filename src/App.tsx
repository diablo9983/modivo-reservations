import {defineComponent} from "vue";
import ReserveDate from "@/components/ReserveDate/ReserveDate";


export default defineComponent({
    setup() {
        const reservationDetails = {
            price: 298,
            currencySymbol: "zł",
            rating: 3.5,
            ratingCount: 123,
            startDate: null,
            emdDate: null,
            unavailableDates: [],
            reserveButtonLabel: "Reserve"
        }

        return {
            reservationDetails
        }
    },

    render() {
        return <div style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <ReserveDate {...this.reservationDetails} />
        </div>
    }
})
