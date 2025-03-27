// contexts/AuthorContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Crea il contesto di autenticazione
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Effettua il recupero dell'utente da localStorage se disponibile
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Imposta l'utente dallo storage
        }
    }, []);

const [token,setToken] = useState (() => {
    return localStorage.getItem('token');
});

    const login = (userData,userToken) => {
        setUser(userData); // Imposta lo stato dell'utente
        setToken(userToken); 
        localStorage.setItem('user', JSON.stringify(userData)); // Salva l'utente in localStorage
        localStorage.setItem('token', userToken);
    }; 

    const logout = () => {
        setUser(null); // Rimuove l'utente dallo stato
        setToken(null);
        localStorage.removeItem('user'); // Rimuove l'utente da localStorage
        localStorage.removeItem('token'); // Rimuove il token dal localStorage
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Funzione per accedere al contesto
export const useAuth = () => {
    return useContext(AuthContext);
};


