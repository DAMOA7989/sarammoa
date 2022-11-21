import { selectorFamily, waitForAll } from "recoil";
import { writingIdsState, writingInfoState } from "./atoms";
import { getWriting } from "utils/firebase/writing";

export const writingInfosSelector = selectorFamily({
    key: "writingInfosSelector",
    get:
        (uid) =>
        async ({ get }) => {
            const writingIds = get(writingIdsState(uid));

            const writingInfos = (writingIds || []).map(
                async (writingId) => await getWriting(writingId)
            );

            return writingInfos;
        },
});
