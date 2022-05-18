import {defineComponent} from "vue";
import ReservationBox from "@/components/ReservationBox/ReservationBox";
import "./assets/app.scss";
import dayjs from "dayjs";

export default defineComponent({
    setup() {
        const reservationDetails = {
            price: 298,
            currencySymbol: "zł",
            rating: 3.5,
            ratingCount: 123,
            unavailableDates: [],
            reserveButtonLabel: "Reserve Date",
            startDate: dayjs("2022-03-15").toDate(),
            endDate: dayjs("2022-05-25").toDate()
        }

        return {
            reservationDetails
        }
    },

    render() {
        return <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <ReservationBox {...this.reservationDetails} />
        </div>
    }
})
