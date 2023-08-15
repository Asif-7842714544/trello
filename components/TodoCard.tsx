"use client";
import getimageUrl from "@/lib/getImageURL";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  drgableProps: DraggableProvidedDraggableProps;
  dragableHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  id,
  index,
  innerRef,
  dragableHandleProps,
  drgableProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTodo);
  const [imageUrl, setimageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getimageUrl(todo.image!);
        if (url) 
        setimageUrl(url.toString());
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      className="bg-white space-y-2 drop-shadow-md rounded-md  "
      {...dragableHandleProps}
      {...drgableProps}
      ref={innerRef}
    >
      <div className="flex  justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-700 "
        >
          <XCircleIcon className="ml-5 h-8 w-8 " />
        </button>
      </div>
      {/* Add image here */}

      {imageUrl && (
        <div className="h-full w-full rounded-b-md ">
          <Image
            src={imageUrl}
            height={200}
            width={400}
            alt="task image"
            className="w-full object-contain rounded-b-md "
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
