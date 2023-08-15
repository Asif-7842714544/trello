import { databases } from "@/appWrite";

export const getTodoGroupedByColumns = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_COLLECTION_ID!
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      //checking image is there or not
      ...(todo.image && { image: JSON.parse(JSON.stringify(todo.image)) }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());
  //if column doesnt have any inprogress
  //  todo and done add them with empty todos list

  const columntypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const columntype of columntypes) {
    if (!columns.get(columntype)) {
      columns.set(columntype, {
        id: columntype,
        todos: [],
      });
    }
  }

  //Sort colums by columtype
  const sortedColums = new Map<TypedColumn, Column>(
    [...columns.entries()].sort(
      (a, b) => columntypes.indexOf(a[0]) - columntypes.indexOf(b[0])
    )
  );
  const board: Board = { columns: sortedColums };
  return board;
};
