"use client"

import { useState } from "react";
import Image from "next/image";

export default function NewItemModal({ onClose, onSubmit }) {
  const [imagePreview, setImagePreview] = useState("");
  const [item, setItem] = useState({
    name: "",
    image: "",
  });

  const handleImageLoad = (e) => {
    const file = e.target.files[0];
    const imagePreviewURL = URL.createObjectURL(file);
    setImagePreview(imagePreviewURL);

    const reader = new FileReader();
    reader.onloadend = () => {
      setItem({ ...item, image: reader.result, id: crypto.randomUUID() });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <section className="fixed bottom-0 left-0 flex justify-center items-center z-10">
        <div className="w-[100vw] flex flex-col gap-4 bg-white rounded-lg p-4 border border-gray-200">
          <h1 className="text-xl mb-4">Nueva prenda</h1>
          {imagePreview && (
            <Image 
              src={imagePreview} 
              width={100} 
              height={100} 
              alt="Preview" 
              className="w-full h-full object-cover aspect-square" 
            />
          )}
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleImageLoad}
            className="w-full border p-4 text-xl outline-none"
          />
          <input
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            placeholder="Nombre"
            className="w-full border p-4 text-xl outline-none"
          />
          <button
            onClick={() => onSubmit(item)}
            className="flex justify-center items-center border p-2 text-xl"
          >
            Agregar
          </button>
        </div>
      </section>
    </>
  );
}