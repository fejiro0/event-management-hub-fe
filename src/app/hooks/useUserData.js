import { useEffects, useState } from 'react';
import cookies from 'js-cookie';

const useUserData = () => {
    const [userData, setuserData] = useState([]);

    useEffects(()=>{
        const userDataCookies = cookies.get('userData');
        const parsedUserData = JSON.parse(userDataCookies || '{}');
        setuserData(parsedUserData);

        const storageEventListener = (event) => {
            if(event.key === 'userData'){
                const updatedUserData = JSON.parse(event.newValue || '{}')
                setuserData(updatedUserData)
            }
        };

        window.addEventListener('storage', storageEventListener);

        return () => {
            window.removeEventListener('storage', storageEventListener);
        }
    }, []);

    return userData;
};

export default useUserData;