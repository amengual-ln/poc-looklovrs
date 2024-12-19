"use client"

import { useEffect, useState } from "react";
import { useWardrobe } from "@/stores/wardrobe";
import Image from "next/image";
import NewItemModal from "@/components/NewItemModal";

export default function Page() {
  const { wardrobe, addItem, removeItem } = useWardrobe();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleNewItem = () => {
    setShowModal(true);
  };

  const handleItemSubmit = (item) => {
    setShowModal(false);
    addItem(item);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 w-full max-w-[600px] mx-auto px-4 mt-4">
        <article
          onClick={handleNewItem}
          className="grid place-content-center border border-gray-200 rounded-lg"
        >
          Nueva prenda
        </article>
        {wardrobe.map((item, index) => (
          <article
            key={index}
            className="group/item relative gap-4 p-4 border border-gray-200 rounded-lg items-center"
          >
            <button className="absolute -top-2 -right-2 py-1 px-3 text-xl bg-black text-white rounded-full scale-75 invisible group-hover/item:visible" onClick={() => removeItem(item.id)}>x</button>
            <div className="flex flex-col h-[250px]">
              <Image
                src={item.image.includes("base64") ? item.image : "/wardrobe/" + item.image}
                alt={item.name}
                width={100}
                height={100}
                className="h-[200px] w-auto object-cover aspect-square"
              />
              <p className="text-center">{item.name}</p>
            </div>
          </article>
        ))}
      </div>

      {showModal && (
        <NewItemModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleItemSubmit}
        />
      )}
    </>
  );
}