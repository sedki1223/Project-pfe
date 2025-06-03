import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

const AddDish = () => {
  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  })

  const [inputs, setInputs] = useState({
    dishName: '',
    price: 0,
    features: {
      Spicy: false,
      Vegetarian: false,
      'Gluten-Free': false,
      'Contains Nuts': false,
      'Chef Special': false,
    },
  })

  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (
      !inputs.dishName ||
      !inputs.price ||
      !inputs.features ||
      !Object.values(images).some((image) => image)
    ) {
      toast.error('Please fill all the fields and upload images')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('dishName', inputs.dishName)
      formData.append('price', inputs.price)
      const selectedFeatures = Object.keys(inputs.features).filter(
        (key) => inputs.features[key]
      )
      formData.append('features', JSON.stringify(selectedFeatures))
      Object.keys(images).forEach((key) => {
        if (images[key]) formData.append('images', images[key])
      })

      const { data } = await axios.post('/api/food/', formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data.success) {
        toast.success(data.message)
        setInputs({
          dishName: '',
          price: 0,
          features: {
            Spicy: false,
            Vegetarian: false,
            'Gluten-Free': false,
            'Contains Nuts': false,
            'Chef Special': false,
          },
        })
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title align="left" font="outfit" title="Add Dish" subTitle="Fill in the details" />
      {/* Upload Area For Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`dishImages${key}`} key={key}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`dishImages${key}`}
              hidden
              onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Dish Name</p>
          <input
            type="text"
            placeholder="Enter dish name"
            value={inputs.dishName}
            onChange={(e) => setInputs({ ...inputs, dishName: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          />
        </div>
        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/ serving</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.price}
            onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Features</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(inputs.features).map((feature, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`features${index + 1}`}
              checked={inputs.features[feature]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  features: { ...inputs.features, [feature]: !inputs.features[feature] },
                })
              }
            />
            <label htmlFor={`features${index + 1}`}> {feature}</label>
          </div>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Adding Dish...' : 'Add Dish'}
      </button>
    </form>
  )
}

export default AddDish
