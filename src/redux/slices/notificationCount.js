import { createSlice } from "@reduxjs/toolkit";

export const notificationCountSlice = createSlice({
    name: "notificationCount",
    initialState: {
        total: 0,
        unread: 0,
    },
    reducers: {
        setNotificationCounts: (state, action) => {
            const { total, unread } = action.payload;

            if (total !== undefined && total !== null) {
                state.total = Number(total);
            }
            if (unread !== undefined && unread !== null) {
                state.unread = Number(unread);
            }
        },
        markAsRead: (state) => {
            if (state.unread > 0) {
                state.unread -= 1;
            }
        },
        incrementUnread: (state) => {
            state.unread += 1;
            state.total += 1;
        }
    },
});

export const { setNotificationCounts, markAsRead, incrementUnread } = notificationCountSlice.actions;
export default notificationCountSlice.reducer;
