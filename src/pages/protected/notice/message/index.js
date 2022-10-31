import React from "react";
import { useTranslation } from "react-i18next";
import MessageCard from "components/surface/MessageCard";
import { useAuthContext } from "utils/auth";
import { db } from "utils/firebase";
import {
    onSnapshot,
    query,
    collection,
    collectionGroup,
    where,
    getDoc,
    doc,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { useNavigateContext } from "utils/navigate";
import { useStoreContext } from "utils/store";

const Message = () => {
    const { t } = useTranslation();
    const navigate = useNavigateContext();
    const { messages } = useStoreContext();

    return (
        <div className="pages-protected-notice-message">
            <ul className="messages">
                {(messages.state.rooms || []).map((message, idx) => (
                    <li key={message.id}>
                        <MessageCard
                            onClick={() => {
                                navigate.push({
                                    pathname: `/notice/${message?.id}`,
                                    mode: "sub",
                                });
                            }}
                            rid={message.id}
                            thumbnailUrl={message?.thumbnailUrl}
                            title={message?.title}
                            lastMessage={message?.lastMessage}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;
