import React from "react";
import { useParams } from "react-router-dom";

const Detail = () => {
    const { uid } = useParams();

    return <main>uid: {uid}</main>;
};

export default Detail;
