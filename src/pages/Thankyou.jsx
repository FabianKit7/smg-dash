import Tap from '@tapfiliate/tapfiliate-js';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Thankyou() {
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return navigate("/login")
            const { data, error } = await supabase
            .from('users')
                .select()
                .eq('user_id', user.id)
            if (error) return navigate("/login")

            if (user && !data[0]?.subscribed) {
                window.location.pathname = `subscriptions/${data[0].username}`;
                return;
            }

            if (data?.[0]) {
                const username = data[0].username
                Tap.conversion('DM', '30');
                navigate(`/dashboard/${username}`);
            }
        };

        getData();
    }, [navigate]);

    return (
        <div></div>
    )
}
