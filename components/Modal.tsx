"use client";

import { useModalStore } from "@/store/ModalStrore";
import { FormEvent, Fragment, MouseEvent, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useBoardStore } from "@/store/BoardStore";
import TasktypeRadioGroup from "./TasktypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

function Modal() {
  const imagepickerRef = useRef<HTMLInputElement>(null);
  const [isOpen, closeModal, openModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
    state.openModal,
  ]);

  const [newTaskInput, setnewTaskInput, setImage, image, addTask, newTaskType] =
    useBoardStore((state) => [
      state.newTaskInput,
      state.setnewTaskInput,
      state.setImage,
      state.Image,
      state.addTask,
      state.newTaskType,
    ]);

  // const handleSubmit = (
  //   e:
  //     | FormEvent<HTMLFormElement>
  //     | MouseEvent<HTMLDivElement>
  //     | MouseEvent<HTMLButtonElement>
  // ) => {
  //   e.preventDefault();
  //   console.log("hiiiiii");

  //   // if (!newTaskInput) return;

  //   // addTask(newTaskInput, newTaskType, image);

  //   setImage(null);
  //   closeModal();
  // };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          // onSubmit={(e) => handleSubmit}
          className="relative z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add a Task
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setnewTaskInput(e.target.value)}
                      placeholder="Enter a Task here...."
                      className="w-full border border-gray-300 rounded-md outline-none p-5 "
                    />
                  </div>

                  {/* Task Type Radio group */}

                  <TasktypeRadioGroup />

                  <div className="mt-4">
                    {image && (
                      <Image
                        alt="uploaded image"
                        height={200}
                        width={200}
                        onClick={() => setImage(null)}
                        className="w-full h-44 object-fill mt-2 filter hover:grayscale 
                        transition-all duration-150 cursor-not-allowed "
                        src={URL.createObjectURL(image)}
                      />
                    )}
                    {/* <button
                      type="button"
                      onClick={() => imagepickerRef.current?.click()}
                      className="w-full border border-gray-300 rounded-md outline-nonep-5
                    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                      Upload Image
                    </button> */}

                    <input
                      type="file"
                      ref={imagepickerRef}
                      hidden
                      onChange={(e) => {
                        if (!e.target.files![0]?.type?.startsWith("image/"))
                          return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>

                  <div
                    // onClick={(e) => handleSubmit}
                    className="mt-2"
                  >
                    <button
                      // type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!newTaskInput) return;
                        addTask(newTaskInput, newTaskType, image);

                        setImage(null);
                        closeModal();
                      }}
                      disabled={!newTaskInput}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                     text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 
                     focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed "
                    >
                      Add task
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Modal;
