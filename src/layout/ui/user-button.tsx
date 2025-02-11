// 'use client'
'use server'
// ^^ this file requires pragma?

import { Avatar, AvatarFallback, AvatarImage } from '#/layout/ui/avatar'
import { Button } from '#/layout/ui/button'
// import { 
//   Button,
// } from '@radix-ui/themes'

// ** AUTH GUARD
// import { SessionProvider } from 'next-auth/react'
// import { useSession } from 'next-auth/react'
import { auth } from '#/lib/auth/auth'
import { SignIn, SignOut } from '#/layout/ui/auth-components'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/layout/ui/dropdown-menu'

export default async function UserButton() {
// export default function UserButton() {

  const session = await auth()
  // const { data: session, status } = useSession()
  
  if (!session || !session.user) {
    // return <></>
    return <SignIn />
  }
  
  return (
    <div 
      style={{
      }}
    >
      {/* <span className='hidden text-sm sm:inline-flex'>
        {session.user.email}
      </span> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            style={{
              // border: 0,
              // marginRight: 4,
            }}
          >
            <div 
              className='mr-3 ml-0'
            >
              {session.user.name}
            </div>
            <Avatar 
              className='w-2 h-7'
            >
              {session.user.image && (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  className='rounded-full w-5 h-5 mt-1'
                  // style={{
                  //   maxWidth: '16px',
                  //   maxHeight: '16px',
                  // }}
                />
              )}
              <AvatarFallback>{session.user.email}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          {/* <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {session.user.name}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel> */}
          <DropdownMenuItem>
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
