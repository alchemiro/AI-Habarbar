import {
    judgeCollection,
    db,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "./database.js";
import { judge } from "./users.js";

const judgeConverter = {
    toFirestore: (judge) => {
        return {
            id: judge.id,
            name: judge.name,
            password: judge.password,
            projects: judge.projects,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new judge(
            data.id,
            data.name,
            data.grades,
            data.likes
            data.summary,
            data.img,
            data.round,
            data.category
        );
    },
};

async function validate(judgeID) {
    const judgeDocumentReference = doc(
        judgeCollection,
        judgeID
    ).withConverter(judgeConverter);

    try {
        return judgenapshot.exists();
    } catch {
        return false;
    }
}

//pull entire judge and if it doesn't exist, create one
async function pulljudge(judgeID) {
    const judgeDocumentReference = doc(
        judgeCollection,
        judgeID
    ).withConverter(judgeConverter);

    try {
        const judgenapshot = await getDoc(judgeDocumentReference);
        console.log(
            "A document with this ID exists, and the data has been retrieved and is being returned."
        );
        return judgenapshot.data();
    } catch {
        const newjudge = new judge(judgeID);
        pushjudge(newjudge);
        return newjudge;
    }
}

//push entire judge - OVERWRITE
async function pushjudge(judge) {
    const judgeRef = doc(judgeCollection, judge.id).withConverter(
        judgeConverter
    );

    await setDoc(judgeRef, judge, { merge: true });
}

//pull ambiguous parameter
async function pulljudgeParam(judgeID, field) {
    const judge = pulljudge(judgeID);
    return judge[field];
}

//push ambiguous parameter
async function pushjudgeParam(judgeID, field, value) {
    const judgeRef = doc(db, judgeCollection, judgeID);
    try {
        await updateDoc(judgeRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}

export { validate, pushjudgeParam, pushjudge, pulljudgeParam, pulljudge };
