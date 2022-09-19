import React from "react";
import { useTranslation } from "react-i18next";
import MessageCard from "components/surface/MessageCard";
import { _getMessages } from "utils/firebase/notice";
import { useAuthContext } from "utils/auth";
import { useStoreContext } from "utils/store";

const Message = () => {
    const { t } = useTranslation();
    const { userInfo } = useAuthContext();
    const { subscribe, unsubscribe } = useStoreContext();
    const [messages, setMessages] = React.useState([]);

    // React.useEffect(() => {
    //     setMessages([
    //         {
    //             userInfo: {
    //                 id: 0,
    //                 nickname: "Walter Yoon",
    //                 profileThumbnailUrl:
    //                     "https://firebasestorage.googleapis.com/v0/b/sarammoa-cc444.appspot.com/o/75PaGQeeXzM5Jzc2bThrDnRMyWL2%2FprofileThumbnail?alt=media&token=81ca7d39-3efd-41ac-bc9b-abf4222397fa",
    //             },
    //             message:
    //                 "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //             date: "2022.09.16 13:15",
    //         },
    //     ]);
    // }, []);

    React.useEffect(() => {
        if (!Boolean(userInfo?.id)) return;
        const observe = subscribe({
            path: `messages`,
            query: {
                type: "where",
                args: ["participants", "array-contains", userInfo?.id],
            },
            setData: setMessages,
        });

        return unsubscribe(observe);
    }, [userInfo?.id]);

    console.log("d messages", messages);

    return (
        <div className="pages-protected-notice-message">
            <ul className="messages">
                {(messages || []).map((message, idx) => (
                    <li key={idx}>
                        <MessageCard
                            user={message?.userInfo}
                            message={message?.message}
                            date={message?.date}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Message;
