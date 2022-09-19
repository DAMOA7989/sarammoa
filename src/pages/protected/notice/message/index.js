import React from "react";
import { useTranslation } from "react-i18next";
import MessageCard from "components/surface/MessageCard";
import { _getMessages } from "utils/firebase/notice";
import { useAuthContext } from "utils/auth";
import { db } from "utils/firebase";
import {
    onSnapshot,
    query,
    collection,
    where,
    getDoc,
    doc,
    orderBy,
    limit,
} from "firebase/firestore";
import { useNavigateContext } from "utils/navigate";

const Message = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const navigate = useNavigateContext();
    const _messagesRef = React.useRef([]);
    const [messages, setMessages] = React.useState([]);
    const [lastMessages, setLastMessages] = React.useState({});

    React.useEffect(() => {
        if (!Boolean(userInfo?.id)) return;
        const messagesRef = collection(db, "messages");
        const q = query(
            messagesRef,
            where("participants", "array-contains", userInfo?.id)
        );

        const observers = [];
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = [];
            const tasks = [];
            querySnapshot.forEach((docSnapshot) => {
                const participants = docSnapshot.data()?.participants;
                const counterpartId = (participants || []).filter(
                    (x) => !x.includes(userInfo?.id)
                )?.[0];
                tasks.push(
                    getDoc(doc(db, `users/${counterpartId}`)).then(
                        (counterPartDocSnapshot) => {
                            const counterpartDoc = {
                                id: counterPartDocSnapshot.id,
                                ...counterPartDocSnapshot.data(),
                            };
                            docs.push({
                                id: docSnapshot.id,
                                ...docSnapshot.data(),
                                counterpart: counterpartDoc,
                            });
                        }
                    )
                );

                const sendCollectionRef = collection(
                    db,
                    `messages/${docSnapshot?.id}/sends`
                );
                const sendQuery = query(
                    sendCollectionRef,
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                observers.push(
                    onSnapshot(sendQuery, (sendQuerySnapshot) => {
                        let lastMessage = null;
                        sendQuerySnapshot.forEach((sendDocSnapshot) => {
                            lastMessage = {
                                id: sendDocSnapshot.id,
                                ...sendDocSnapshot.data(),
                            };
                        });

                        setLastMessages({
                            [docSnapshot.id]: lastMessage,
                        });
                    })
                );
            });

            Promise.allSettled(tasks || []).then(() => {
                _messagesRef.current = docs;
            });
        });

        return () => {
            observers.forEach((f) => f());
            unsubscribe();
        };
    }, [userInfo?.id]);

    React.useEffect(() => {
        setMessages([...messages, ..._messagesRef.current]);
    }, [_messagesRef.current]);

    return (
        <div className="pages-protected-notice-message">
            <ul className="messages">
                {(messages || []).map((message, idx) => (
                    <li key={idx}>
                        <MessageCard
                            onClick={() => {
                                navigate.push({
                                    pathname: `/notice/${message?.id}`,
                                    mode: "sub",
                                    screenTitle: "test",
                                });
                            }}
                            user={message?.counterpart}
                            lastMessage={lastMessages?.[message?.id]}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;
