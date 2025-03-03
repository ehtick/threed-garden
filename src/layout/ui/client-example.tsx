'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '#/layout/ui/button'
import { Input } from '#/layout/ui/input-old'
import SessionData from '#/layout/ui/session-data'
import CustomLink from '#/layout/ui/custom-link'

const UpdateForm = () => {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')

  if (!session?.user) return null
  return (
    <>
      <h2 className='text-xl font-bold'>Updating the session</h2>
      <form
        onSubmit={async () => {
          if (session) {
            const newSession = await update({
              ...session,
              user: { ...session.user, name },
            })
            console.log({ newSession })
          }
        }}
        className='flex items-center w-full max-w-sm space-x-2'
      >
        <Input
          type='text'
          placeholder={session.user.name ?? ''}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <Button type='submit'>Update</Button>
      </form>
    </>
  )
}

export default function ClientExample() {
  const { data: session, status } = useSession()
  return (
    <div className='space-y-2 p-2'>
      <h1 className='text-3xl font-bold'>🌱 Client Side Rendering Usage {session?.user?.name}</h1>
      <h2>threed:next15:app:client-example:page</h2>
      <p>
        This page fetches session data client side using the{' '}
        <CustomLink href='https://nextjs.authjs.dev/react#usesession'>
          <code>useSession</code>
        </CustomLink>{' '}
        React Hook.
      </p>
      <p>
        It needs the{' '}
        
          <code>'use client'</code>
        
        directive at the top of the file to enable client side rendering,
        <br/>
        and the {' '}
        <CustomLink href='https://nextjs.authjs.dev/react#sessionprovider'>
          <code>SessionProvider</code>
        </CustomLink>{' '}
        component in{' '}
        <strong>
          <code>client-example/page.tsx</code>
        </strong>{' '}
        to provide the session data.
      </p>

      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <SessionData session={session} />
      )}
      {/* <UpdateForm /> */}
    </div>
  )
}
