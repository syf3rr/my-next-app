import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
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
  createdAt: Date;
  updatedAt?: Date;
}

export interface ItemInput {
  title: string;
  description: string;
  createdAt: Date;
}

// Items collection operations
export const itemsCollection = "items";

// Add a new item
export const addItem = async (
  title: string,
  description: string
): Promise<string> => {
  try {
    const docRef: DocumentReference<DocumentData> = await addDoc(
      collection(db, itemsCollection),
      {
        title,
        description,
        createdAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding item: ", error);
    throw error;
  }
};

// Get all items
export const getItems = async (): Promise<Item[]> => {
  try {
    const q: Query<DocumentData> = query(
      collection(db, itemsCollection),
      orderBy("createdAt", "desc")
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    return items;
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

// Real-time listener for items
export const subscribeToItems = (
  callback: (items: Item[]) => void
): Unsubscribe => {
  const q: Query<DocumentData> = query(
    collection(db, itemsCollection),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const items: Item[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    callback(items);
  });
};
