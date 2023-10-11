import { guestCollection, db, doc, setDoc, getDoc } from "./database.js";

//pull entire guest and if it doesn't exist, create one
async function pullGuest(guestID) {
  const guestDocumentReference = doc(guestCollection, guestID);

  try {
    const guestSnapshot = await getDoc(guestDocumentReference);
    console.log(
      "A document with this ID exists, and the data has been retrieved and is being returned."
    );
    return guestSnapshot.data();
  } catch {
    return "No such document exists, or a different error occured.";
  }
}

//push entire guest - OVERWRITE
async function pushGuest(guest) {
  const guestRef = doc(guestsCollection, guest.id);
  const guestData = {
    id: guest.id,
    password: guest.password,
    name: guest.name,
    likes: guest.likes,
  };

  await setDoc(guestRef, guestData, { merge: true });
}

//pull ambiguous parameter
async function pullGuestParam(guestID, field) {
  const guest = pullguest(guestID);
  return guest[field];
}

//push ambiguous parameter
async function pushGuestParam(guestID, field, value) {
  const guestRef = doc(db, guestsCollection, guestID);
  try {
    await setDoc(guestRef, { [field]: value }, { merge: true });
  } catch {
    return "Something went wrong, push failed.";
  }
}

export { pushGuestParam, pushGuest, pullGuestParam, pullGuest };
