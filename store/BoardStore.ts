import { ID, databases, storage } from "@/appWrite";
import { getTodoGroupedByColumns } from "@/lib/getTodoGroupedByColumns";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;

  updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;
  deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  newTaskInput: string;
  setnewTaskInput: (input: string) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskType: TypedColumn;
  setnewTaskedType: (columnId: TypedColumn) => void;

  Image: File | null;
  setImage: (image: File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  newTaskInput: "",

  setnewTaskInput: (input: string) => set({ newTaskInput: input }),

  searchString: "",

  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    const board = await getTodoGroupedByColumns();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDb: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },

  deleteTodo: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    //delete todoId from new column
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id
    );

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
  },

  newTaskType: "todo",
  setnewTaskedType: (columnId: TypedColumn) =>
    set({
      newTaskType: columnId,
    }),

  Image: null,
  setImage: (Image: File | null) => set({ Image: Image }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    //upload image
    let file: Image | undefined;

    if (image) {
      const fileuploaded = await uploadImage(image);
      if (fileuploaded) {
        file = {
          bucketId: fileuploaded.bucketId,
          fileId: fileuploaded.$id,
        };
      }
    }

    //upload todo

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
