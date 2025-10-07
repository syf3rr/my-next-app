import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  where,
  DocumentData,
  QuerySnapshot,
  Unsubscribe,
  DocumentReference,
  Query,
} from "firebase/firestore";

// Types
export interface Item {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ItemInput {
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
}

// Items collection operations
export const itemsCollection = "items";

// Add a new item
export const addItem = async (
  title: string,
  description: string,
  userId: string
): Promise<string> => {
  try {
    const docRef: DocumentReference<DocumentData> = await addDoc(
      collection(db, itemsCollection),
      {
        title,
        description,
        userId,
        createdAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding item: ", error);
    throw error;
  }
};

// Get items for a specific user
export const getItems = async (userId: string): Promise<Item[]> => {
  try {
    const q: Query<DocumentData> = query(
      collection(db, itemsCollection),
      where("userId", "==", userId)
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    // Sort in JavaScript instead of Firestore
    return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Error getting items: ", error);
    throw error;
  }
};

// Update an item
export const updateItem = async (
  id: string,
  title: string,
  description: string
): Promise<void> => {
  try {
    const itemRef = doc(db, itemsCollection, id);
    await updateDoc(itemRef, {
      title,
      description,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating item: ", error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, itemsCollection, id));
  } catch (error) {
    console.error("Error deleting item: ", error);
    throw error;
  }
};

// Real-time listener for items for a specific user
export const subscribeToItems = (
  userId: string,
  callback: (items: Item[]) => void
): Unsubscribe => {
  const q: Query<DocumentData> = query(
    collection(db, itemsCollection),
    where("userId", "==", userId)
  );
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    // Sort in JavaScript instead of Firestore
    const sortedItems = items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    callback(sortedItems);
  });
};
