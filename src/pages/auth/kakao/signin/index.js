import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
    _getAccessTokenWithKakao,
    _createFirebaseToken,
    _signInWithCustomToken,
} from "utils/firebase/auth";
import { useNavigateContext } from "utils/navigate";
import { CircularProgress } from "@mui/material";

const KakaoSignin = () => {
    const [search, setSearch] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigateContext();

    React.useEffect(() => {
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
    }, []);

    return (
        <main className="pages-auth-kakao-signin">
            <CircularProgress size={45} color="primary" />
        </main>
    );
};

export default KakaoSignin;
