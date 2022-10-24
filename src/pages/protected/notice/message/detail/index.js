import React from "react";
import { useParams } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "utils/firebase";
import { useNavigateContext } from "utils/navigate";
import { _getRoomInfo } from "utils/firebase/notice";

const NoticeMessageDetail = () => {
    const { rid } = useParams();
    const navigate = useNavigateContext();
    const [roomInfo, setRoomInfo] = React.useState(null);
    const [_messages, _setMessages] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    React.useLayoutEffect(() => {
        navigate.setLayout({
            screenTitle: roomInfo?.title,
        });
    }, [roomInfo]);

    React.useEffect(() => {
        if (!rid) return;

        _getRoomInfo({ rid })
            .then((doc) => {
                setRoomInfo(doc);
            })
            .catch((e) => {
                console.dir(e);
                setRoomInfo(null);
            });
    }, [rid]);

    React.useEffect(() => {
        if (!rid) return;
        const q = query(
            collection(db, `messages/${rid}/sends`),
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
