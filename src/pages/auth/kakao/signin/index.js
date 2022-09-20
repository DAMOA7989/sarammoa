import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useStatusContext } from "utils/status";
import { _getAccessTokenWithKakao } from "utils/firebase/auth";

const KakaoSignin = () => {
    const { task } = useStatusContext();
    const [search, setSearch] = useSearchParams();
    const location = useLocation();

    React.useEffect(() => {
        task.run();
        const code = search.get("code");

        _getAccessTokenWithKakao({
            code,
            redirect_uri: `${process.env.REACT_APP_HOST_URL}${location.pathname}`,
        }).then(({ accessToken }) => {
            console.log("d accessToken", accessToken);
            const kakao = window.Kakao;

            if (!kakao) return;

            if (!kakao.isInitialized()) {
                kakao.init(process.env.REACT_APP_KAKAO_APP_JAVASCRIPT_KEY);
            }

            kakao.Auth.setAccessToken(accessToken);

            kakao.API.request({
                url: "/v2/user/me",
                success: function (response) {
                    console.log("d response", response);
                },
                fail: function (error) {},
            });
        });

        return () => {
            task.finish();
        };
    }, []);

    return <main className="pages-auth-kakao-signin"></main>;
};

export default KakaoSignin;
