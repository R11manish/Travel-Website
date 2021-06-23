import axios from "axios"
import { showAlert } from "./alerts"
const stripe = Stripe('pk_test_51J4rMMSG8kXYCDhYKgSI9pXDpcR5fMpndtwmuQx86H4JCJn5gl5RaFKyOGeMAd0YA1u6peShiiMb40imSo9vp1zD00hDfH2JZq');

export const bookTour = async tourId => {

    try {
        //1 ) get chekout session from API
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)
        // console.log(session);
        //2 ) create checkout form + charge the credit card
        await stripe.redirectToCheckout({
            sessionId : session.data.session.id
        })
    } catch (err) {
        showAlert('error', err);
    };
}