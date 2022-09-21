import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useStatusContext } from "utils/status";
import {
    _getAccessTokenWithKakao,
    _createFirebaseToken,
    _signInWithCustomToken,
} from "utils/firebase/auth";
import { useNavigateContext } from "utils/navigate";

const KakaoSignin = () => {
    const { task } = useStatusContext();
    const [search, setSearch] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigateContext();

    React.useEffect(() => {
        task.run();
        const code = search.get("code");

        _getAccessTokenWithKakao({
            code,
            redirect_uri: `${process.env.REACT_APP_HOST_URL}${location.pathname}`,
        })
            .then(({ accessToken }) => {
                const kakao = window.Kakao;

                if (!kakao) return;

                if (!kakao.isInitialized()) {
                    kakao.init(process.env.REACT_APP_KAKAO_APP_JAVASCRIPT_KEY);
                }

                kakao.Auth.setAccessToken(accessToken);
                return accessToken;
            })
            .then((accessToken) => {
                _createFirebaseToken({ accessToken })
                    .then(({ firebaseToken }) => {
                        _signInWithCustomToken({ token: firebaseToken }).then(
                            () => {
                                navigate.replace({
                                    pathname: "/",
                                    mode: "main",
                                });
                            }
                        );
                    })
                    .catch((e) => {
                        console.dir(e);
                    });
            });

        return () => {
            task.finish();
        };
    }, []);

    return <main className="pages-auth-kakao-signin"></main>;
};

export default KakaoSignin;
