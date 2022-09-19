import React from "react";
import { useParams } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "utils/firebase";

const NoticeMessageDetail = () => {
    const { mid } = useParams();
    const [_messages, _setMessages] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        if (!mid) return;
        const q = query(
            collection(db, `messages/${mid}/sends`),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((docSnapshot) => {
                docs.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                });
            });

            _setMessages(docs);
        });

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        setMessages([...messages, ..._messages]);
    }, [_messages]);

    return (
        <main className="protected-notice-message-detail">
            <ul>
                {messages.map((message, idx) => (
                    <li key={idx}>{message.message}</li>
                ))}
            </ul>
        </main>
    );
};

export default NoticeMessageDetail;
