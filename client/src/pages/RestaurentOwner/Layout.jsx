import React, { useEffect } from 'react'
import Navbar from '../../components/FoodOwner/Navbar'
import SideBar from '../../components/FoodOwner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '@/context/AppContext'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner, navigate])

  if (isOwner === undefined) return null

  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className='flex h-full'>
        <SideBar />
        <main className='flex-1 p-4 pt-10 md:px-10 h-full'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
