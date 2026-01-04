import { db } from "../conf/firebase";
import {
    doc,
    setDoc,
    addDoc,
    collection,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy,
    getDoc,
    limit
} from "firebase/firestore";

/**
 * Generates a deterministic chatId from two UIDs.
 */
export const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
};

/**
 * Creates a chat thread if it doesn't already exist.
 */
export const createChat = async (uid1, uid2) => {
    const chatId = getChatId(uid1, uid2);
    const chatRef = doc(db, "chats", chatId);

    try {
        // We use setDoc with merge: true to initialize if not exists
        // This is safer than getDoc if rules are strict on path existence
        await setDoc(chatRef, {
            users: [uid1, uid2],
            updatedAt: serverTimestamp(),
            // We only want to set createdAt if it's new
            // But since this is a deterministic ID, we can initialize it simple
        }, { merge: true });

        // Ensure createdAt exists if it was just created (not perfect with merge but works for state)
        const snap = await getDoc(chatRef);
        if (snap.exists() && !snap.data().createdAt) {
            await setDoc(chatRef, { createdAt: serverTimestamp() }, { merge: true });
        }

        console.log("Chat initialized/found:", chatId);
        return chatId;
    } catch (err) {
        console.error("Error in createChat service:", err);
        throw err;
    }
};

/**
 * Sends a message in a chat thread.
 */
export const sendMessage = async (chatId, senderId, text) => {
    if (!text.trim()) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);

    await addDoc(messagesRef, {
        senderId,
        text,
        createdAt: serverTimestamp()
    });

    await setDoc(chatRef, {
        lastMessage: text,
        updatedAt: serverTimestamp()
    }, { merge: true });
};

/**
 * Real-time listener for user's chats.
 */
export const getChatsListener = (uid, callback) => {
    const q = query(
        collection(db, "chats"),
        where("users", "array-contains", uid)
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(chats);
    }, (error) => {
        console.error("Error in getChatsListener:", error);
        if (error.message.includes("index")) {
            console.warn("CRITICAL: A composite index is required for this query. Check the browser console for a Firebase link to create it.");
        }
    });
};

/**
 * Real-time listener for messages in a chat.
 */
export const getMessagesListener = (chatId, callback) => {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    });
};
