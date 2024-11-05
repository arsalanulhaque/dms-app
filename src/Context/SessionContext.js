import { useNavigate } from 'react-router-dom';

function useSession() {
    const navigate = useNavigate();

    const setSession = (value) => {
        localStorage.setItem("session", JSON.stringify(value));
    }

    const getSession = () => {
        let temp = JSON.parse(localStorage.getItem("session"))
        if (temp === null || temp === undefined) { 
            navigate('/')
        }
        else { return temp }
    }

    const killSession = () => {
        localStorage.removeItem("session");
    }

    return [getSession, setSession, killSession]
}

export default useSession;
