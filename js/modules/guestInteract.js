import { guestCollection, db, doc, setDoc, getDoc,updateDoc,} from "./database.js";
import { guest } from "./users.js";

const guestConverter = {
    toFirestore: (guest) => {
        return {
            id: guest.id,
            name: guest.name,
            password: guest.password,
            likes: guest.likes,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new guest(
            data.id,
            data.name,
            data.password,
            data.likes,
        );
    },
};

async function validate(guestID) {
    const guestDocumentReference = doc(
        guestCollection,
        guestID
    ).withConverter(guestConverter);

    try {
        return guestnapshot.exists();
    } catch {
        return false;
    }
}

//pull entire guest and if it doesn't exist, create one
async function pullGuest(guestID) {
    const guestDocumentReference = doc(
        guestCollection,
        guestID
    ).withConverter(guestConverter);

    try {
        const guestnapshot = await getDoc(guestDocumentReference);
        console.log(
            "A document with this ID exists, and the data has been retrieved and is being returned."
        );
        return guestnapshot.data();
    } catch {
        const newguest = new guest(guestID);
        pushguest(newguest);
        return newguest;
    }
}

//push entire guest - OVERWRITE
async function pushGuest(guest) {
    const guestRef = doc(guestCollection, guest.id).withConverter(
        guestConverter
    );

    await setDoc(guestRef, guest, { merge: true });
}

//pull ambiguous parameter
async function pullGuestParam(guestID, field) {
    const guest = pullguest(guestID);
    return guest[field];
}

//push ambiguous parameter
async function pushGuestParam(guestID, field, value) {
    const guestRef = doc(db, guestCollection, guestID);
    try {
        await updateDoc(guestRef, { [field]: value }, { merge: true });
    } catch {
        return "Something went wrong, push failed.";
    }
}

export { validate, pushGuestParam, pushGuest, pullGuestParam, pullGuest };
