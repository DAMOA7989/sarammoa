export const timestampToDate = (timestamp) => {
    return new Date(timestamp?.seconds * 1000);
};

export const dateToString = (date, format) => {
    let str = "";
    switch (format) {
        case "message":
            str += date.getFullYear();
            str += ".";
            str += date.getMonth() + 1;
            str += ".";
            str += date.getDate();
            str += " ";
            str += date.getHours();
            str += ":";
            str += date.getMinutes();
            break;
    }

    return str;
};
