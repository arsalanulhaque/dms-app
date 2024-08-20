
function useSession() {

    const setSession = (value) => {
        localStorage.setItem("session", JSON.stringify(value));
    }

    const getSession = () => {
        let temp = JSON.parse(localStorage.getItem("session"))
        return temp
    }

    return [getSession, setSession]
}

export default useSession;
