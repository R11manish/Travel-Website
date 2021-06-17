import axios from "axios";
import { showAlert } from "./alerts";

export const updateSetting = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:3000/api/v1/users/update-me',
            data: {
                name,
                email
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Data updated successfully!!')
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}


