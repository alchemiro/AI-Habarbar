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
    return new judge(data.id, data.name, data.password, data.projects);
  },
};

async function validate(judgeID) {
  const judgeDocumentReference = doc(judgeCollection, judgeID);
  const judgeSnapshot = await getDoc(judgeDocumentReference);
  try {
    return judgeSnapshot.exists();
  } catch {
    return false;
  }
}

//pull entire judge and if it doesn't exist, create one
async function pullJudge(judgeID) {
  const judgeDocumentReference = doc(judgeCollection, judgeID).withConverter(
    judgeConverter
  );

  try {
    const judgeSnapshot = await getDoc(judgeDocumentReference);
    console.log(
      "A document with this ID exists, and the data has been retrieved and is being returned."
    );
    return judgeSnapshot.data();
  } catch {
    const newjudge = new judge(judgeID);
    pushjudge(newjudge);
    return newjudge;
  }
}

//push entire judge - OVERWRITE
async function pushJudge(judge) {
  const judgeRef = doc(judgeCollection, judge.id).withConverter(judgeConverter);

  await setDoc(judgeRef, judge, { merge: true });
}

//pull ambiguous parameter
async function pullJudgeParam(judgeID, field) {
  const judge = pullJudge(judgeID);
  return judge[field];
}

//push ambiguous parameter
async function pushJudgeParam(judgeID, field, value) {
  const judgeRef = doc(db, judgeCollection, judgeID);
  try {
    await updateDoc(judgeRef, { [field]: value }, { merge: true });
  } catch {
    return "Something went wrong, push failed.";
  }
}

export { validate, pushJudgeParam, pushJudge, pullJudgeParam, pullJudge };
