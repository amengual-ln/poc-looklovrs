'use client'
import { useEffect, useState } from 'react'

import { SendIcon } from '../components/Icons'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css';

import { ScaleLoader } from 'react-spinners'

import { useWardrobe } from '@/stores/wardrobe'
import { marked } from 'marked'

export default function Home () {
  const { wardrobe, setInitialItems } = useWardrobe()
  const [value, setValue] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Esto es solo para la demo
  useEffect(() => {
    if (wardrobe.length > 0) return
    const demoWardrobe = [
      {
        id: 1,
        name: "Remera",
        image: "remera1.png",
      },
      {
        id: 2,
        name: "Sudadera",
        image: "sudadera2.png",
      },
      {
        id: 5,
        name: "Pantalon",
        image: "pantalon5.png",
      },
    ]
    demoWardrobe.forEach(item => {
      getBase64FromUrl('/wardrobe/' + item.image).then(base64 => base64)
        .then(image => item.image_base64 = image)
    })
    setInitialItems(demoWardrobe)
  }, [setInitialItems])

  async function getBase64FromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const replaceImageSrc = (markdownText) => {
    // Usar una expresión regular para encontrar y reemplazar los src
    return markdownText.replace(/<img src="(\d+|[\w-]+)"(.*?)\/>/g, (match, id, attributes) => {
      // Reemplazar el ID con la URL completa
      const newSrc = `${wardrobe.find(item => item.id === id).image}`;
      return `<img src="${newSrc}"${attributes} />`;
    });
  };

  const analyzeImage = async () => {
    setResponse('')
    setLoading(true)
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value,
          wardrobe
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }
      const response = await fetch('/api/vision', options)
      const data = await response.json()

      data.result = replaceImageSrc(data.result)

      console.log(data.result)
      setResponse(data)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    clearExceptInput()
  }, [value])

  const clear = () => {
    setValue('')
    setResponse('')
    setError('')
  }

  const clearExceptInput = () => {
    setResponse('')
    setError('')
  }

  return (
    <div className='app'>
      <section className={`flex justify-center transform h-[250px]`}>
        <img src="logo.png" alt="Logo" />
      </section>
      <section className='search-section'>
        <h1 className='text-xl pl-6 text-gray-400 mb-2'>Armario: </h1>
        <div className='h-[320px] min-w-[320px] mx-auto px-6'>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            autoplay={{ autoplay: 1000 }}
            loop
          >
            <SwiperSlide className='rounded-lg bg-[url("/wardrobe/remera1.png")] bg-contain bg-no-repeat bg-center min-h-[320px] max-h-[320px] min-w-[320px]'></SwiperSlide>
            <SwiperSlide className='rounded-lg bg-[url("/wardrobe/sudadera2.png")] bg-contain bg-no-repeat bg-center min-h-[320px] max-h-[320px] min-w-[320px]'></SwiperSlide>
            <SwiperSlide className='rounded-lg bg-[url("/wardrobe/blusa3.png")] bg-contain bg-no-repeat bg-center min-h-[320px] max-h-[320px] min-w-[320px]'></SwiperSlide>
            <SwiperSlide className='rounded-lg bg-[url("/wardrobe/pantalon4.png")] bg-contain bg-no-repeat bg-center min-h-[320px] max-h-[320px] min-w-[320px]'></SwiperSlide>
            <SwiperSlide className='rounded-lg bg-[url("/wardrobe/pantalon5.png")] bg-contain bg-no-repeat bg-center min-h-[320px] max-h-[320px] min-w-[320px]'></SwiperSlide>
          </Swiper>
        </div>
        <div className='flex w-full mx-auto p-6'>
          <input
            value={value}
            placeholder='Que outfit necesitas?'
            onChange={(e) => setValue(e.target.value)}
            className='w-full rounded-l-lg border border-r-0 py-4 pl-4 focus:pr-4 text-xl outline-none'
          />
          {loading &&
            <button className='w-[80px] flex justify-center items-center rounded-r-lg border px-2 text-xl'>
              <div style={{ transform: 'scale(.75)' }}>
                <ScaleLoader color='#ddd' />
              </div>
            </button>
          }
          {(!response && !error && !loading) && <button onClick={analyzeImage} className='w-[80px] flex justify-center items-center rounded-r-lg border px-2 text-xl'><SendIcon /></button>}
          {(response || error) && <button onClick={clear} className='w-[80px] flex justify-center items-center rounded-r-lg border px-2 text-xl'>Clear</button>}
        </div>
        {error && <p>{''}</p>}

        {!response && loading && (
          <div className='flex justify-center items-center mt-20'>
            <ScaleLoader color='#ddd' />
          </div>
        )}
        {response && <p className='p-6 text-lg mb-3' dangerouslySetInnerHTML={{ __html: marked(response.result) }}></p>}
      </section>
    </div>
  )
}
